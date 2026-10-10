/**
 * Server-side Token Store & Management for Google OAuth & Health API
 * Stores authorization tokens securely in server memory and handles expiration & refresh logic.
 * Secrets and tokens are NEVER sent to the client browser.
 */

export interface GoogleTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // UNIX timestamp in ms
  scope?: string;
  idToken?: string;
}

export interface GoogleUserProfile {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verifiedEmail?: boolean;
}

export interface UserSession {
  sessionId: string;
  tokens?: GoogleTokens;
  profile?: GoogleUserProfile;
  createdAt: number;
  lastActive: number;
}

// In-memory session store (keyed by sessionId)
const sessionStore = new Map<string, UserSession>();

export const TokenManager = {
  getOrCreateSession(sessionId: string): UserSession {
    let session = sessionStore.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        createdAt: Date.now(),
        lastActive: Date.now(),
      };
      sessionStore.set(sessionId, session);
    } else {
      session.lastActive = Date.now();
    }
    return session;
  },

  getSession(sessionId: string): UserSession | undefined {
    return sessionStore.get(sessionId);
  },

  saveTokens(sessionId: string, tokens: { access_token: string; refresh_token?: string; expires_in?: number; scope?: string; id_token?: string }) {
    const session = this.getOrCreateSession(sessionId);
    const existingRefreshToken = session.tokens?.refreshToken;

    const expiresAt = Date.now() + (tokens.expires_in ? tokens.expires_in * 1000 : 3600 * 1000);

    session.tokens = {
      accessToken: tokens.access_token,
      // Google only returns refresh_token on the first consent prompt or with prompt=consent
      refreshToken: tokens.refresh_token || existingRefreshToken,
      expiresAt,
      scope: tokens.scope,
      idToken: tokens.id_token,
    };
    session.lastActive = Date.now();
  },

  setProfile(sessionId: string, profile: GoogleUserProfile) {
    const session = this.getOrCreateSession(sessionId);
    session.profile = profile;
    session.lastActive = Date.now();
  },

  clearSession(sessionId: string) {
    sessionStore.delete(sessionId);
  },

  isTokenExpired(tokens?: GoogleTokens): boolean {
    if (!tokens || !tokens.accessToken) return true;
    // Buffer of 60 seconds before actual expiration
    return Date.now() >= tokens.expiresAt - 60000;
  },
};
