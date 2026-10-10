import React from 'react';
import { useApp } from '../context/AppContext';
import { Sprout, Camera, Droplets, Leaf, ArrowRight, Clock, Sparkles, Activity } from 'lucide-react';

export const LandingScreen: React.FC = () => {
  const { navigate } = useApp();

  return (
    <div className="flex-1 flex flex-col relative w-full bg-[#fcf9f1] px-4 max-w-lg mx-auto pb-12 pt-4">
      {/* Top Navbar */}
      <div className="flex items-center justify-between py-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#cfe9d3] flex items-center justify-center shadow-xs">
            <Sprout className="w-5 h-5 text-[#4a6549]" />
          </div>
          <span className="font-editorial text-2xl text-[#1c1c17] tracking-tight font-medium">Nourish</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('auth')}
            className="text-[13px] text-[#434841] px-3.5 py-1.5 rounded-full bg-[#f6f3eb] hover:bg-[#ebe8e0] active:bg-[#e5e2da] transition-colors font-medium border border-[#e5e2da]/70 cursor-pointer"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="text-[13px] text-[#243d24] px-4 py-1.5 rounded-full bg-[#cfe9d3] hover:bg-[#b0cfad] transition-colors font-semibold shadow-xs cursor-pointer"
          >
            Open App
          </button>
        </div>
      </div>

      {/* Google Build with AI Bootcamps Recognition Banner */}
      <div className="flex items-center justify-between p-2.5 px-3.5 rounded-full bg-[#f6f3eb] border border-[#e5e2da] mb-4 text-[12px] text-[#434841] shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#4a6549]" />
          <span>Built for <strong>Google Build with AI Bootcamps</strong></span>
        </div>
        <span className="text-[10px] font-semibold text-[#243d24] bg-[#cfe9d3] px-2 py-0.5 rounded-full uppercase tracking-wider">
          Google AI &amp; Health API
        </span>
      </div>

      {/* Hero Visual Card */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-[#f6f3eb] shadow-sm mb-5 border border-[#e5e2da]/60">
        <div className="h-48 w-full relative overflow-hidden flex items-center justify-center">
          <img
            alt="Artisanal ceramic tableware with sliced ripe figs, fresh rosemary sprigs, and fluted glass carafe"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsYyYqZkzjpD3ZnPP4pXnpEWbhXUTadID7Eiy_adhyKE2Hdc9CKYCoVPpRBK2CVDgXT95P3kZMmMtMJ4o5uuYBBH8gBOZVwmPHE8kuXIjmdVU7dB4KIFRdDGo1n7F3ZCRirbMLTyVGzbsfS3byet2EYfricWV4VM6i0k3T_rPZY6r-WyQE1bUDLHd2PIsgzbkUs3EapQC6gp-1rSMuBBzA8jT-dG0pgS1hDdDqhbROBBJTJVbIQR37"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f6f3eb] via-[#f6f3eb]/20 to-transparent" />
          <div className="absolute bottom-3 left-3 bg-[#ffffff]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-2 border border-[#e5e2da]/50">
            <span className="w-2 h-2 rounded-full bg-[#4a6549] animate-pulse" />
            <span className="text-[11px] font-semibold text-[#4a6549] uppercase tracking-wider">
              Mindful Balance · Vol. 01
            </span>
          </div>
        </div>
      </div>

      {/* Editorial Headline */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#1c1c17] leading-snug font-normal text-balance">
          Small habits. A healthier relationship with food.
        </h1>
        <p className="text-[15px] text-[#434841] leading-relaxed">
          Nourish helps you track daily nourishment with zero judgment. Effortless AI food photo recognition, tactile hydration logging, and weekly rhythm insights designed to fit your natural flow.
        </p>
      </div>

      {/* Feature Triad Cards */}
      <div className="flex flex-col gap-3 mb-8">
        {/* Feature 1: AI Vision */}
        <div
          onClick={() => navigate('scanner')}
          className="group cursor-pointer flex items-start gap-3.5 p-3.5 rounded-xl bg-[#ffffff] shadow-sm hover:shadow-md transition-all active:scale-[0.99] border border-[#e5e2da]/70"
        >
          <div className="w-11 h-11 rounded-full bg-[#f1eee6] flex items-center justify-center shrink-0 shadow-inner text-[#4a6549]">
            <Camera className="w-5 h-5 text-[#4a6549]" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[16px] text-[#1c1c17] font-semibold">AI Vision Logging</span>
              <span className="text-[11px] font-semibold text-[#4a6549] bg-[#cfe9d3] px-2 py-0.5 rounded-full">
                Smart
              </span>
            </div>
            <p className="text-[13px] text-[#434841] leading-snug">
              Snap a plate, let intelligent recognition estimate ingredients and portions in seconds.
            </p>
          </div>
        </div>

        {/* Feature 2: Fluid Hydration */}
        <div
          onClick={() => navigate('hydration')}
          className="group cursor-pointer flex items-start gap-3.5 p-3.5 rounded-xl bg-[#ffffff] shadow-sm hover:shadow-md transition-all active:scale-[0.99] border border-[#e5e2da]/70"
        >
          <div className="w-11 h-11 rounded-full bg-[#f1eee6] flex items-center justify-center shrink-0 shadow-inner text-[#8b4e36]">
            <Droplets className="w-5 h-5 text-[#8b4e36]" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[16px] text-[#1c1c17] font-semibold">Fluid Hydration</span>
              <span className="text-[11px] font-semibold text-[#8b4e36] bg-[#ffdbce] px-2 py-0.5 rounded-full">
                Sensory
              </span>
            </div>
            <p className="text-[13px] text-[#434841] leading-snug">
              Satisfying, tactile water tracking with volume presets and peaceful ripple haptics.
            </p>
          </div>
        </div>

        {/* Feature 3: Compassionate Insights */}
        <div
          onClick={() => navigate('insights')}
          className="group cursor-pointer flex items-start gap-3.5 p-3.5 rounded-xl bg-[#ffffff] shadow-sm hover:shadow-md transition-all active:scale-[0.99] border border-[#e5e2da]/70"
        >
          <div className="w-11 h-11 rounded-full bg-[#f1eee6] flex items-center justify-center shrink-0 shadow-inner text-[#4d6452]">
            <Leaf className="w-5 h-5 text-[#4d6452]" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[16px] text-[#1c1c17] font-semibold">Compassionate Insights</span>
              <span className="text-[11px] font-semibold text-[#4d6452] bg-[#cfe9d3] px-2 py-0.5 rounded-full">
                Kind
              </span>
            </div>
            <p className="text-[13px] text-[#434841] leading-snug">
              Weekly habit rhythms and gentle patterns without restrictive calorie shaming.
            </p>
          </div>
        </div>

        {/* Feature 4: Google Health & Telemetry */}
        <div
          onClick={() => navigate('auth')}
          className="group cursor-pointer flex items-start gap-3.5 p-3.5 rounded-xl bg-[#ffffff] shadow-sm hover:shadow-md transition-all active:scale-[0.99] border border-[#e5e2da]/70"
        >
          <div className="w-11 h-11 rounded-full bg-[#f1eee6] flex items-center justify-center shrink-0 shadow-inner text-[#4a6549]">
            <Activity className="w-5 h-5 text-[#4a6549]" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[16px] text-[#1c1c17] font-semibold">Google Health Sync</span>
              <span className="text-[11px] font-semibold text-[#243d24] bg-[#cfe9d3] px-2 py-0.5 rounded-full">
                Google Cloud
              </span>
            </div>
            <p className="text-[13px] text-[#434841] leading-snug">
              Sync daily steps, active calorie expenditure, and mindful workouts via Google Health API.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="flex flex-col items-center gap-3 w-full mt-auto">
        <button
          type="button"
          onClick={() => navigate('onboarding-1')}
          className="w-full py-4 px-6 rounded-full bg-[#243d24] hover:bg-[#344a3a] text-white text-[16px] font-medium flex items-center justify-center gap-2 shadow-md active:translate-y-0.5 transition-all duration-150 cursor-pointer"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => navigate('auth')}
          className="w-full py-3.5 px-6 rounded-full bg-[#f6f3eb] hover:bg-[#ebe8e0] text-[#1c1c17] text-[15px] font-medium flex items-center justify-center gap-2.5 border border-[#e5e2da] active:scale-[0.99] transition-all cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-center pt-1">
          <Clock className="w-3.5 h-3.5 text-[#737970]" />
          <span className="text-[12px] text-[#737970]">Takes less than 2 minutes · No credit card required</span>
        </div>
      </div>
    </div>
  );
};
