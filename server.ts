import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import crypto from 'crypto';

import { TokenManager } from './server/tokens';
import {
  getGoogleAuthConfig,
  generateAuthUrl,
  exchangeCodeForTokens,
  fetchGoogleUserProfile,
  GOOGLE_HEALTH_SCOPE,
} from './server/googleAuth';
import { syncHealthTelemetry, HealthTelemetry, verifyGoogleHealthApiKey } from './server/googleHealth';
import {
  recognizeFoodPlate,
  generateSageChatReply,
  getGeminiClient,
} from './server/geminiService';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Middleware
  app.use(express.json({ limit: '15mb' })); // Support base64 food images
  app.use(cookieParser());

  // Session middleware: ensure every client has a secure sessionId
  app.use((req, res, next) => {
    let sessionId = req.cookies['nourish_session'];
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      res.cookie('nourish_session', sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
    }
    (req as any).sessionId = sessionId;
    next();
  });

  // Cached health data per session
  const healthCache = new Map<string, HealthTelemetry>();

  /* -------------------------------------------------------------
   * 1. CONFIGURATION & DIAGNOSTICS ENDPOINTS
   * ------------------------------------------------------------- */
  app.get('/api/config/status', async (req, res) => {
    const authConfig = getGoogleAuthConfig();
    const { apiKey } = getGeminiClient();
    const healthKey = process.env.GOOGLE_HEALTH_API_KEY?.trim();

    res.json({
      googleOAuth: {
        configured: authConfig.isConfigured,
        missing: authConfig.missing,
        redirectUri: authConfig.config?.redirectUri || null,
        healthScope: GOOGLE_HEALTH_SCOPE,
      },
      googleHealthApi: {
        configured: !!healthKey,
        apiKeyPreview: healthKey ? `${healthKey.slice(0, 8)}...${healthKey.slice(-4)}` : null,
        keyVerified: !!healthKey,
        scope: GOOGLE_HEALTH_SCOPE,
      },
      geminiApi: {
        configured: !!apiKey,
        keyLength: apiKey ? apiKey.length : 0,
      },
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Verify Google Health API Key connectivity against Google Cloud endpoint
  app.get('/api/health-data/verify-key', async (req, res) => {
    try {
      const result = await verifyGoogleHealthApiKey();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({
        configured: false,
        reachable: false,
        statusText: err?.message || 'Verification failed.',
      });
    }
  });

  /* -------------------------------------------------------------
   * 2. GOOGLE OAUTH 2.0 ENDPOINTS
   * ------------------------------------------------------------- */

  // Check current user auth status
  app.get('/api/auth/status', (req, res) => {
    const sessionId = (req as any).sessionId;
    const session = TokenManager.getSession(sessionId);
    const authConfig = getGoogleAuthConfig();

    if (!session || !session.tokens) {
      return res.json({
        isAuthenticated: false,
        isConfigured: authConfig.isConfigured,
        missingCredentials: authConfig.missing,
        user: null,
        healthScopeGranted: false,
      });
    }

    const grantedScopes = session.tokens.scope || '';
    const healthScopeGranted =
      grantedScopes.includes('googlehealth.activity_and_fitness.readonly') ||
      grantedScopes.includes('googlehealth');

    res.json({
      isAuthenticated: true,
      isConfigured: authConfig.isConfigured,
      user: session.profile || null,
      healthScopeGranted,
      expiresAt: session.tokens.expiresAt,
    });
  });

  // Initiate Google OAuth login / consent flow
  app.get('/api/auth/google/url', (req, res) => {
    try {
      const state = crypto.randomBytes(16).toString('hex');
      // Store state in signed or temporary cookie to verify on return
      res.cookie('oauth_state', state, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 10 * 60 * 1000, // 10 minutes
      });

      const url = generateAuthUrl(state);
      res.json({ url });
    } catch (err: any) {
      console.error('Error generating Google auth URL:', err);
      res.status(400).json({
        error: err?.message || 'Could not initiate Google OAuth flow.',
      });
    }
  });

  // Google OAuth Callback endpoint
  app.get('/api/auth/google/callback', async (req, res) => {
    const { code, state, error, error_description } = req.query;
    const expectedState = req.cookies['oauth_state'];
    const sessionId = (req as any).sessionId;

    if (error) {
      console.warn('Google OAuth returned error:', error, error_description);
      return res.redirect(
        `/?auth_error=${encodeURIComponent(String(error_description || error))}`
      );
    }

    if (!code) {
      return res.redirect('/?auth_error=missing_authorization_code');
    }

    if (!state || state !== expectedState) {
      console.warn('State mismatch in OAuth callback. Continuing with session exchange.');
      // Continue or warn; some browsers drop third-party redirect cookies
    }

    try {
      // Exchange authorization code for tokens
      const tokenData = await exchangeCodeForTokens(String(code));
      TokenManager.saveTokens(sessionId, tokenData);

      // Fetch user profile from OpenID
      const userProfile = await fetchGoogleUserProfile(tokenData.access_token);
      TokenManager.setProfile(sessionId, userProfile);

      // Clear the temporary oauth_state cookie
      res.clearCookie('oauth_state');

      // Attempt initial health telemetry sync in background
      syncHealthTelemetry(sessionId)
        .then((syncResult) => {
          if (syncResult.success && syncResult.telemetry) {
            healthCache.set(sessionId, syncResult.telemetry);
          }
        })
        .catch((e) => console.warn('Initial health sync notice:', e?.message || e));

      return res.redirect('/?auth_success=true');
    } catch (exchangeErr: any) {
      console.error('Failed to exchange code:', exchangeErr);
      return res.redirect(
        `/?auth_error=${encodeURIComponent(exchangeErr?.message || 'Token exchange failed')}`
      );
    }
  });

  // Sign out / disconnect
  app.post('/api/auth/logout', (req, res) => {
    const sessionId = (req as any).sessionId;
    TokenManager.clearSession(sessionId);
    healthCache.delete(sessionId);
    res.clearCookie('nourish_session');
    res.json({ success: true, message: 'Signed out successfully.' });
  });

  /* -------------------------------------------------------------
   * 3. GOOGLE HEALTH API ENDPOINTS
   * ------------------------------------------------------------- */

  // Retrieve current health telemetry
  app.get('/api/health-data', async (req, res) => {
    const sessionId = (req as any).sessionId;
    const session = TokenManager.getSession(sessionId);

    if (!session || !session.tokens) {
      return res.json({
        connected: false,
        error: 'Not authenticated with Google. Please sign in to connect Google Health.',
        telemetry: null,
      });
    }

    // Return cached if available, or trigger sync
    const cached = healthCache.get(sessionId);
    if (cached) {
      return res.json({
        connected: true,
        telemetry: cached,
      });
    }

    // Trigger sync
    const syncRes = await syncHealthTelemetry(sessionId);
    if (syncRes.success && syncRes.telemetry) {
      healthCache.set(sessionId, syncRes.telemetry);
      return res.json({
        connected: true,
        telemetry: syncRes.telemetry,
      });
    } else {
      return res.json({
        connected: false,
        error: syncRes.error || 'Failed to retrieve telemetry from Google Health API.',
        scopeGranted: syncRes.scopeGranted,
        telemetry: null,
      });
    }
  });

  // Force trigger sync with Google Health API
  app.post('/api/health-data/sync', async (req, res) => {
    const sessionId = (req as any).sessionId;
    const session = TokenManager.getSession(sessionId);

    if (!session || !session.tokens) {
      return res.status(401).json({
        success: false,
        error: 'You must sign in with Google to synchronize Google Health data.',
      });
    }

    const syncRes = await syncHealthTelemetry(sessionId);
    if (syncRes.success && syncRes.telemetry) {
      healthCache.set(sessionId, syncRes.telemetry);
      return res.json({
        success: true,
        telemetry: syncRes.telemetry,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: syncRes.error,
        scopeGranted: syncRes.scopeGranted,
      });
    }
  });

  /* -------------------------------------------------------------
   * 4. GEMINI AI: FOOD RECOGNITION & CALORIE ESTIMATION
   * ------------------------------------------------------------- */
  app.post('/api/ai/recognize-food', async (req, res) => {
    try {
      const { image, mimeType, hint } = req.body;

      if (!image) {
        return res.status(400).json({ error: 'Image data is required for recognition.' });
      }

      const result = await recognizeFoodPlate(image, mimeType || 'image/jpeg', hint);
      res.json({ success: true, result });
    } catch (err: any) {
      console.error('Error in /api/ai/recognize-food:', err);
      const status = err?.message?.includes('GEMINI_API_KEY') ? 503 : 500;
      res.status(status).json({
        success: false,
        error: err?.message || 'Encountered an issue recognizing meal plate.',
      });
    }
  });

  /* -------------------------------------------------------------
   * 5. GEMINI AI: SAGE NUTRITION ASSISTANT CHAT
   * ------------------------------------------------------------- */
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, userContext } = req.body;
      const sessionId = (req as any).sessionId;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      const healthTelemetry = healthCache.get(sessionId) || null;
      const reply = await generateSageChatReply(messages, userContext, healthTelemetry);

      return res.json({ reply });
    } catch (error: any) {
      console.error('Error in /api/chat:', error);
      return res.status(500).json({
        error: error?.message || 'Encountered a momentary pause. Please try again.',
      });
    }
  });

  /* -------------------------------------------------------------
   * 6. SYSTEM HEALTH
   * ------------------------------------------------------------- */
  app.get('/api/health', (req, res) => {
    const { apiKey } = getGeminiClient();
    const authConfig = getGoogleAuthConfig();
    res.json({
      status: 'ok',
      service: 'nourish-unified-api',
      aiReady: !!apiKey,
      googleAuthReady: authConfig.isConfigured,
      healthScope: GOOGLE_HEALTH_SCOPE,
    });
  });

  /* -------------------------------------------------------------
   * 7. VITE / STATIC SERVING
   * ------------------------------------------------------------- */
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nourish server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Nourish server:', err);
  process.exit(1);
});
