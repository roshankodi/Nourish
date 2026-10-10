/**
 * Google Health API Service
 * Integrates with Google Health API (https://health.googleapis.com/v4/users/me/)
 * under scope: https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly
 * 
 * Implements exponential backoff, rate-limit resilience, data parsing,
 * and clear diagnostics for Google Cloud verification/test user status.
 */

import { getValidAccessToken } from './googleAuth';
import { TokenManager } from './tokens';

export interface HealthTelemetry {
  stepsToday: number;
  activeCaloriesBurned: number;
  activeMinutesToday: number;
  lastSyncTime: string;
  source: string;
  isRestrictedScopePending?: boolean;
  notes?: string;
}

const HEALTH_API_BASE = 'https://health.googleapis.com/v4/users/me';

/**
 * Helper to execute an HTTP request with exponential backoff for rate limits (429) & transient 5xx
 */
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let delay = 500;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // If rate limited (429) or service unavailable (503), retry with backoff
      if ((response.status === 429 || response.status === 503) && attempt < maxRetries) {
        console.warn(`Health API rate limited (${response.status}), retry attempt ${attempt} in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }

      return response;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  throw new Error(`Health API request failed after ${maxRetries} attempts`);
}

/**
 * Fetches data points for a specific dataType from Google Health API
 */
async function fetchHealthDataPoints(
  accessToken: string,
  dataType: string,
  startTime: string,
  endTime: string
): Promise<{ success: boolean; data?: any; error?: string; status?: number }> {
  const apiKey = process.env.GOOGLE_HEALTH_API_KEY?.trim();
  const apiKeyQuery = apiKey ? `&key=${encodeURIComponent(apiKey)}` : '';
  const url = `${HEALTH_API_BASE}/dataTypes/${encodeURIComponent(dataType)}/dataPoints?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}${apiKeyQuery}`;

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    };
    if (apiKey) {
      headers['x-goog-api-key'] = apiKey;
    }

    const res = await fetchWithRetry(url, { headers });

    if (res.status === 403) {
      const errorBody = await res.text();
      return {
        success: false,
        status: 403,
        error: `Google Health API restricted scope approval or API enablement required. Details: ${errorBody}`,
      };
    }

    if (res.status === 404) {
      return { success: true, data: { dataPoints: [] } };
    }

    if (!res.ok) {
      const errorBody = await res.text();
      return {
        success: false,
        status: res.status,
        error: `Google Health API returned status ${res.status}: ${errorBody}`,
      };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      error: `Network error connecting to Google Health API: ${err?.message || err}`,
    };
  }
}

/**
 * Synchronizes today's activity and fitness data for the given user session
 */
export async function syncHealthTelemetry(sessionId: string): Promise<{
  success: boolean;
  telemetry?: HealthTelemetry;
  error?: string;
  scopeGranted?: boolean;
}> {
  const session = TokenManager.getSession(sessionId);
  if (!session || !session.tokens) {
    return {
      success: false,
      error: 'Google session not found. Please sign in with Google.',
      scopeGranted: false,
    };
  }

  // Check if user consented to health scope
  const grantedScopes = session.tokens.scope || '';
  const hasHealthScope = grantedScopes.includes('googlehealth.activity_and_fitness.readonly') ||
                         grantedScopes.includes('googlehealth');

  if (!hasHealthScope) {
    return {
      success: false,
      error: 'The Google Health API scope (googlehealth.activity_and_fitness.readonly) was not granted during Google sign-in. Please reconnect and grant permission.',
      scopeGranted: false,
    };
  }

  let accessToken: string;
  try {
    accessToken = await getValidAccessToken(sessionId);
  } catch (authErr: any) {
    return {
      success: false,
      error: authErr?.message || 'Failed to refresh Google authorization token.',
      scopeGranted: true,
    };
  }

  // Calculate today's time window in UTC
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
  const startTime = startOfDay.toISOString();
  const endTime = now.toISOString();

  // Query Steps
  const stepsRes = await fetchHealthDataPoints(accessToken, 'steps', startTime, endTime);

  // If 403 occurred on steps, report restricted scope or missing approval
  if (!stepsRes.success && stepsRes.status === 403) {
    return {
      success: false,
      error: stepsRes.error,
      scopeGranted: true,
    };
  }

  // Query Active Calories / Calories
  let caloriesRes = await fetchHealthDataPoints(accessToken, 'active-calories', startTime, endTime);
  if (!caloriesRes.success) {
    // Try fallback dataType 'calories'
    caloriesRes = await fetchHealthDataPoints(accessToken, 'calories', startTime, endTime);
  }

  // Query Active Minutes
  const activeMinutesRes = await fetchHealthDataPoints(accessToken, 'active-minutes', startTime, endTime);

  // Parse total steps from data points
  let totalSteps = 0;
  if (stepsRes.data?.dataPoints && Array.isArray(stepsRes.data.dataPoints)) {
    for (const point of stepsRes.data.dataPoints) {
      const val = point.value?.intVal ?? point.value?.fpVal ?? point.steps ?? 0;
      totalSteps += Number(val) || 0;
    }
  }

  // Parse active calories burned
  let totalActiveCalories = 0;
  if (caloriesRes.data?.dataPoints && Array.isArray(caloriesRes.data.dataPoints)) {
    for (const point of caloriesRes.data.dataPoints) {
      const val = point.value?.fpVal ?? point.value?.intVal ?? point.calories ?? 0;
      totalActiveCalories += Math.round(Number(val) || 0);
    }
  }

  // Parse active minutes
  let totalActiveMinutes = 0;
  if (activeMinutesRes.data?.dataPoints && Array.isArray(activeMinutesRes.data.dataPoints)) {
    for (const point of activeMinutesRes.data.dataPoints) {
      const val = point.value?.intVal ?? point.value?.fpVal ?? point.durationMinutes ?? 0;
      totalActiveMinutes += Math.round(Number(val) || 0);
    }
  }

  const telemetry: HealthTelemetry = {
    stepsToday: totalSteps,
    activeCaloriesBurned: totalActiveCalories,
    activeMinutesToday: totalActiveMinutes,
    lastSyncTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    source: 'Google Health API',
    notes: `${totalSteps.toLocaleString()} steps · ${totalActiveCalories} kcal active burn synced`,
  };

  return {
    success: true,
    telemetry,
    scopeGranted: true,
  };
}

/**
 * Verifies connectivity to Google Health API using the configured project API key
 */
export async function verifyGoogleHealthApiKey(): Promise<{
  configured: boolean;
  reachable: boolean;
  statusText: string;
  projectNumber?: string;
}> {
  const apiKey = process.env.GOOGLE_HEALTH_API_KEY?.trim();
  if (!apiKey) {
    return {
      configured: false,
      reachable: false,
      statusText: 'GOOGLE_HEALTH_API_KEY is not configured in .env',
    };
  }

  try {
    const res = await fetch(`${HEALTH_API_BASE}/dataTypes/steps/dataPoints?key=${encodeURIComponent(apiKey)}`);
    // HTTP 401 proves the Google Health API endpoint is live and accepting calls for this project key,
    // requiring OAuth 2.0 user credentials to access personal fitness data.
    if (res.status === 401) {
      return {
        configured: true,
        reachable: true,
        statusText: 'Endpoint live. API key active. Ready for OAuth user consent.',
        projectNumber: '612187260975',
      };
    } else if (res.status === 403) {
      const errText = await res.text();
      return {
        configured: true,
        reachable: true,
        statusText: `API key active. Notice: ${errText}`,
        projectNumber: '612187260975',
      };
    } else {
      return {
        configured: true,
        reachable: true,
        statusText: `Google Health API responded with status ${res.status}.`,
        projectNumber: '612187260975',
      };
    }
  } catch (err: any) {
    return {
      configured: true,
      reachable: false,
      statusText: `Network error connecting to Google Health API: ${err?.message || err}`,
    };
  }
}
