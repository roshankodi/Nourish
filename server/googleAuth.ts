/**
 * Google OAuth 2.0 Client & Token Lifecycle Manager
 * Handles consent URL generation, authorization code exchange,
 * automatic token refreshing, and user identity retrieval.
 */

import { GoogleTokens, TokenManager, GoogleUserProfile } from './tokens';

export const GOOGLE_HEALTH_SCOPE = 'https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly';
export const DEFAULT_SCOPES = [
  'openid',
  'email',
  'profile',
  GOOGLE_HEALTH_SCOPE,
];

export interface GoogleAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export function getGoogleAuthConfig(): { isConfigured: boolean; config?: GoogleAuthConfig; missing: string[] } {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  const redirectUri = process.env.GOOGLE_REDIRECT_URI?.trim() || `${appUrl}/api/auth/google/callback`;

  const missing: string[] = [];
  if (!clientId || clientId === 'MY_GOOGLE_CLIENT_ID') missing.push('GOOGLE_CLIENT_ID');
  if (!clientSecret || clientSecret === 'MY_GOOGLE_CLIENT_SECRET') missing.push('GOOGLE_CLIENT_SECRET');

  if (missing.length > 0) {
    return { isConfigured: false, missing };
  }

  return {
    isConfigured: true,
    config: {
      clientId: clientId!,
      clientSecret: clientSecret!,
      redirectUri,
    },
    missing: [],
  };
}

/**
 * Generates the Google OAuth 2.0 consent URL
 */
export function generateAuthUrl(state: string): string {
  const { isConfigured, config, missing } = getGoogleAuthConfig();
  if (!isConfigured || !config) {
    throw new Error(`Google OAuth credentials are missing: ${missing.join(', ')}. Please configure them in your .env or .env.local file.`);
  }

  const scopeParam = encodeURIComponent(DEFAULT_SCOPES.join(' '));
  const redirectUriParam = encodeURIComponent(config.redirectUri);

  // access_type=offline requests a refresh_token
  // prompt=consent ensures Google displays the consent screen and re-issues a refresh token
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(config.clientId)}&redirect_uri=${redirectUriParam}&response_type=code&scope=${scopeParam}&access_type=offline&prompt=consent&state=${encodeURIComponent(state)}&include_granted_scopes=true`;
}

/**
 * Exchanges the authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  scope?: string;
  id_token?: string;
}> {
  const { isConfigured, config, missing } = getGoogleAuthConfig();
  if (!isConfigured || !config) {
    throw new Error(`Cannot exchange authorization code: missing ${missing.join(', ')}.`);
  }

  const params = new URLSearchParams({
    code,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    redirect_uri: config.redirectUri,
    grant_type: 'authorization_code',
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorDesc = data.error_description || data.error || 'Token exchange failed';
    throw new Error(`Google OAuth token exchange failed: ${errorDesc}`);
  }

  return data;
}

/**
 * Refreshes an expired access token using the stored refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  expires_in: number;
  scope?: string;
  id_token?: string;
}> {
  const { isConfigured, config, missing } = getGoogleAuthConfig();
  if (!isConfigured || !config) {
    throw new Error(`Cannot refresh token: missing ${missing.join(', ')}.`);
  }

  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorDesc = data.error_description || data.error || 'Token refresh failed';
    throw new Error(`Google token refresh failed: ${errorDesc}`);
  }

  return data;
}

/**
 * Fetches user profile from Google OpenID userinfo endpoint
 */
export async function fetchGoogleUserProfile(accessToken: string): Promise<GoogleUserProfile> {
  const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Google user profile: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return {
    id: data.sub,
    email: data.email,
    name: data.name || data.email,
    picture: data.picture,
    verifiedEmail: data.email_verified,
  };
}

/**
 * Ensures an active, non-expired access token for the given session.
 * Automatically triggers refresh if expired.
 */
export async function getValidAccessToken(sessionId: string): Promise<string> {
  const session = TokenManager.getSession(sessionId);
  if (!session || !session.tokens) {
    throw new Error('User is not authenticated with Google.');
  }

  const tokens = session.tokens;

  // Check if token is still valid
  if (!TokenManager.isTokenExpired(tokens)) {
    return tokens.accessToken;
  }

  // Token is expired, try to refresh
  if (!tokens.refreshToken) {
    throw new Error('Access token expired and no refresh token is available. Please re-authenticate.');
  }

  try {
    const refreshed = await refreshAccessToken(tokens.refreshToken);
    TokenManager.saveTokens(sessionId, {
      access_token: refreshed.access_token,
      expires_in: refreshed.expires_in,
      scope: refreshed.scope || tokens.scope,
      id_token: refreshed.id_token || tokens.idToken,
    });
    return refreshed.access_token;
  } catch (err: any) {
    throw new Error(`Failed to refresh Google session: ${err?.message || err}`);
  }
}
