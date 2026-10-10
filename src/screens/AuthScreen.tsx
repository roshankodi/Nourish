import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sprout,
  CheckCircle2,
  Loader2,
  SlidersHorizontal,
  ShieldCheck,
  Activity,
  AlertCircle,
  KeyRound,
  ExternalLink,
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { navigate, loginWithGoogle, user, authStatus, configStatus } = useApp();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } finally {
      setLoading(false);
    }
  };

  const isOAuthConfigured = authStatus.isConfigured || configStatus?.googleOAuth.configured;
  const missingVars = authStatus.missingCredentials.length > 0
    ? authStatus.missingCredentials
    : configStatus?.googleOAuth.missing || [];

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[90vh] px-4 max-w-md mx-auto py-8">
      {/* Brand Icon */}
      <div className="relative flex items-center justify-center w-20 h-20 mb-5">
        <div className="w-16 h-16 rounded-full bg-[#cfe9d3] flex items-center justify-center text-[#4a6549] shadow-sm">
          <Sprout className="w-8 h-8 text-[#4a6549]" />
        </div>
      </div>

      <div className="text-center mb-6">
        <h1 className="font-editorial text-3xl text-[#1c1c17] tracking-tight font-medium">
          Welcome to Nourish
        </h1>
        <p className="text-[14px] text-[#434841] mt-2 max-w-xs mx-auto leading-relaxed">
          Your personal sanctuary for gentle, mindful nourishment and Google Health synchronization.
        </p>
      </div>

      {/* Main Google Auth Card */}
      <div className="w-full bg-[#ffffff] rounded-2xl p-6 shadow-md border border-[#e5e2da]/70 flex flex-col gap-4">
        {/* Google OAuth & Health Scope Header */}
        <div className="flex items-center justify-between pb-1 border-b border-[#e5e2da]/60">
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#4a6549]">
            <Activity className="w-4 h-4" />
            <span>Google Health Integration</span>
          </div>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
              isOAuthConfigured
                ? 'bg-[#cfe9d3] text-[#243d24]'
                : 'bg-[#ffdad6] text-[#ba1a1a]'
            }`}
          >
            {isOAuthConfigured ? 'Ready to Connect' : 'Setup Required'}
          </span>
        </div>

        {authStatus.isAuthenticated && authStatus.user ? (
          /* User currently authenticated with Google */
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#f6f3eb] border border-[#e5e2da]">
            {authStatus.user.picture ? (
              <img
                src={authStatus.user.picture}
                alt={authStatus.user.name || 'User'}
                className="w-12 h-12 rounded-full object-cover shadow-sm border border-[#e5e2da]"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-[#cfe9d3] text-[#243d24] flex items-center justify-center font-bold">
                {authStatus.user.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-[#1c1c17] truncate">{authStatus.user.name}</p>
              <p className="text-[13px] text-[#434841] truncate">{authStatus.user.email}</p>
              <span className="text-[11px] text-[#4a6549] font-medium flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Google Health Scope Authorized
              </span>
            </div>
          </div>
        ) : (
          /* Default profile preview or placeholder */
          <div className="p-3 rounded-xl bg-[#fbf9f4] border border-[#e5e2da] text-[13px] text-[#434841] flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#1c1c17]">Requested OAuth Scope:</span>
              <span className="text-[10px] font-mono bg-[#ebe8e0] px-1.5 py-0.5 rounded text-[#434841]">readonly</span>
            </div>
            <code className="text-[10px] bg-[#f1eee6] p-1.5 rounded font-mono text-[#536a58] break-all leading-relaxed">
              https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly
            </code>
            <p className="text-[11px] text-[#737970] mt-0.5">
              Authorizes synchronization of daily steps, active minutes, and calories burned with Nourish.
            </p>
            {configStatus?.googleHealthApi?.configured && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#243d24] bg-[#cfe9d3]/60 px-2.5 py-1 rounded-lg mt-1 border border-[#b4cdb8]/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4a6549]" />
                <span>Health Project Key Active ({configStatus.googleHealthApi.apiKeyPreview})</span>
              </div>
            )}
          </div>
        )}

        {/* Diagnostic alert if Client ID or Secret are not yet configured in .env */}
        {!isOAuthConfigured && (
          <div className="bg-[#fff8f2] border border-[#f5d0b5] rounded-xl p-3.5 text-[12px] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#b04a1b] font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Google Cloud Credentials Needed</span>
            </div>
            <p className="text-[#6d4c41] leading-relaxed">
              To connect real Google accounts and the Google Health API, specify your credentials in <code className="bg-[#fbeee4] px-1 rounded font-mono">.env</code>:
            </p>
            <div className="font-mono text-[11px] bg-[#fdf5f0] p-2 rounded border border-[#f0cbb0] text-[#7a4128] space-y-1">
              <div>GOOGLE_CLIENT_ID="your_client_id.apps.googleusercontent.com"</div>
              <div>GOOGLE_CLIENT_SECRET="your_client_secret"</div>
              <div>GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"</div>
            </div>
            <p className="text-[11px] text-[#8c6b60]">
              Missing: {missingVars.length > 0 ? missingVars.join(', ') : 'GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET'}
            </p>
          </div>
        )}

        {/* Real Google Sign In Action */}
        <button
          type="button"
          disabled={loading || !isOAuthConfigured}
          onClick={handleSignIn}
          className={`w-full py-3.5 px-4 rounded-full font-medium text-[15px] flex items-center justify-center gap-2.5 shadow-md active:scale-[0.99] transition-all cursor-pointer ${
            isOAuthConfigured
              ? 'bg-[#243d24] hover:bg-[#344a3a] text-white disabled:opacity-75'
              : 'bg-[#d8d5cc] text-[#737970] cursor-not-allowed'
          }`}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>
            {loading
              ? 'Opening Google Authorization...'
              : authStatus.isAuthenticated
              ? 'Reconnect Google Health'
              : 'Sign In & Link Google Health'}
          </span>
        </button>

        {authStatus.isAuthenticated && (
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="w-full py-3 px-4 rounded-full bg-[#4a6549] hover:bg-[#3d553c] text-white font-medium text-[14px] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Proceed to Sanctuary Dashboard</span>
          </button>
        )}

        <div className="relative flex items-center justify-center my-1">
          <div className="w-full border-t border-[#e5e2da]" />
          <span className="bg-[#ffffff] px-3 text-[11px] text-[#737970] uppercase tracking-wider absolute">
            Or setup new
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('onboarding-1')}
          className="w-full py-3 px-4 rounded-full bg-[#f6f3eb] hover:bg-[#ebe8e0] text-[#1c1c17] font-medium text-[14px] flex items-center justify-center gap-2 border border-[#e5e2da] transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 text-[#4a6549]" />
          <span>Start Guided Onboarding</span>
        </button>
      </div>

      {/* Trust & Sovereignty Footnote */}
      <div className="mt-8 flex items-center gap-2 text-center text-[#737970] text-[12px] max-w-xs leading-snug">
        <ShieldCheck className="w-4 h-4 text-[#4a6549] shrink-0" />
        <span>Consent-based access. Read-only health telemetry. Secrets never exposed to client.</span>
      </div>

      <button
        type="button"
        onClick={() => navigate('landing')}
        className="mt-6 text-[13px] text-[#737970] hover:text-[#1c1c17] underline underline-offset-4 cursor-pointer"
      >
        Back to Welcome Overview
      </button>
    </div>
  );
};
