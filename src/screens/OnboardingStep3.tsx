import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sprout,
  Check,
  CheckCircle2,
  Flame,
  Droplets,
  Camera,
  Bell,
  Lightbulb,
  ArrowRight,
  Play,
} from 'lucide-react';

export const OnboardingStep3: React.FC = () => {
  const { goals, navigate, showToast } = useApp();

  const handleStartTour = () => {
    showToast('Guided tour: Use the center camera button to snap meals anytime!');
    navigate('dashboard');
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-20 pb-16 px-4 max-w-lg mx-auto bg-[#fcf9f1]">
      <div className="flex flex-col w-full pb-6">
        {/* Animated Celebration Icon */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="relative flex items-center justify-center w-24 h-24 mb-4">
            <div className="absolute inset-0 rounded-full bg-[#cfe9d3]/40 animate-ping opacity-30" style={{ animationDuration: '3s' }} />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#d88e72]/20 via-[#8ba888]/30 to-[#cfe9d3]/50 blur-sm" />
            <div className="relative w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center p-1">
              <div className="w-full h-full rounded-full bg-[#f6f3eb] flex items-center justify-center shadow-inner">
                <div className="w-12 h-12 rounded-full bg-[#4a6549]/10 flex items-center justify-center text-[#4a6549] shadow-inner">
                  <Sprout className="w-7 h-7 text-[#4a6549]" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#cfe9d3] text-[#0a2012] flex items-center justify-center shadow-md">
              <Check className="w-4 h-4 text-[#0a2012]" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cfe9d3]/60 text-[#536a58] text-[12px] font-medium mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4a6549]" />
            <span>Step 3 of 3 completed</span>
          </div>

          <h1 className="font-editorial text-2xl sm:text-3xl text-[#1c1c17] tracking-tight font-medium leading-snug max-w-xs text-balance">
            Your sanctuary of mindful nourishment is ready.
          </h1>
          <p className="text-[14px] text-[#434841] mt-2 max-w-xs">
            Here is your personalized daily blueprint:
          </p>
        </div>

        {/* Pillars of Balance Card */}
        <div className="rounded-2xl bg-[#f6f3eb] shadow-sm border border-[#e5e2da]/70 p-4 sm:p-5 mb-5">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e5e2da]/60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4a6549]" />
              <span className="text-[11px] uppercase tracking-wider text-[#737970] font-semibold">Pillars of Balance</span>
            </div>
            <span className="text-[12px] text-[#4a6549] font-medium">Harmonized</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Daily Calories */}
            <div className="rounded-xl bg-[#f1eee6] p-3 debossed-light flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#8b4e36] shadow-sm">
                  <Flame className="w-5 h-5 text-[#8b4e36]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] text-[#434841]">Daily Calorie Target</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl font-bold text-[#1c1c17] tabular-nums">
                      {goals.dailyCalories.toLocaleString()}
                    </span>
                    <span className="font-editorial text-sm italic text-[#737970]">{goals.energyUnit} / day</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-2 py-0.5 rounded-full bg-[#e5e2da] text-[#434841] text-[11px]">± 100 flex</span>
                <div className="w-14 h-1.5 rounded-full bg-[#e5e2da] mt-2 overflow-hidden">
                  <div className="w-3/4 h-full rounded-full bg-[#d88e72]" />
                </div>
              </div>
            </div>

            {/* Hydration */}
            <div className="rounded-xl bg-[#f1eee6] p-3 debossed-light flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#4a6549] shadow-sm">
                  <Droplets className="w-5 h-5 text-[#4a6549]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] text-[#434841]">Hydration Anchor</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl font-bold text-[#1c1c17] tabular-nums">
                      {goals.dailyHydration.toLocaleString()}
                    </span>
                    <span className="font-editorial text-sm italic text-[#737970]">ml</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#cfe9d3] text-[#536a58]">
                <Droplets className="w-3.5 h-3.5 text-[#4a6549]" />
                <span className="text-[12px] font-semibold">{Math.round(goals.dailyHydration / 250)} cups</span>
              </div>
            </div>

            {/* Twin Mode Badges */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl bg-[#f1eee6] p-3 debossed-light flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#4d6452] shadow-sm">
                    <Camera className="w-4 h-4 text-[#4a6549]" />
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#4a6549]" />
                </div>
                <div>
                  <span className="text-[11px] text-[#737970] block">Logging Mode</span>
                  <span className="text-[13px] text-[#1c1c17] font-semibold block mt-0.5">
                    {goals.loggingMode === 'ai' ? 'AI Camera Enabled' : 'Manual Database'}
                  </span>
                </div>
              </div>

              <div className="rounded-xl bg-[#f1eee6] p-3 debossed-light flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#4d6452] shadow-sm">
                    <Bell className="w-4 h-4 text-[#4a6549]" />
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#4d6452]" />
                </div>
                <div>
                  <span className="text-[11px] text-[#737970] block">Mindful Nudges</span>
                  <span className="text-[13px] text-[#1c1c17] font-semibold block mt-0.5">Gentle Rhythm</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Three Tips for Your First Day */}
        <div className="rounded-2xl bg-[#f6f3eb] shadow-sm border border-[#e5e2da]/70 p-4 sm:p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-[#4a6549]" />
            <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium">Three tips for your first day</h2>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white shadow-sm border border-[#e5e2da]/50">
              <div className="w-6 h-6 rounded-full bg-[#cfe9d3] text-[#0a2012] flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5">
                1
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] text-[#1c1c17] font-semibold">Snap breakfast or coffee</p>
                <p className="text-[12px] text-[#434841] mt-0.5 leading-snug">
                  Point the mindful lens at your next meal to effortlessly log whole ingredients without counting grams.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white shadow-sm border border-[#e5e2da]/50">
              <div className="w-6 h-6 rounded-full bg-[#cfe9d3] text-[#0a2012] flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5">
                2
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] text-[#1c1c17] font-semibold">Tap the water beaker</p>
                <p className="text-[12px] text-[#434841] mt-0.5 leading-snug">
                  Log your morning glass with a single weighted press on the ceramic fluid tile.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white shadow-sm border border-[#e5e2da]/50">
              <div className="w-6 h-6 rounded-full bg-[#cfe9d3] text-[#0a2012] flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5">
                3
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] text-[#1c1c17] font-semibold">Check your weekly rhythm</p>
                <p className="text-[12px] text-[#434841] mt-0.5 leading-snug">
                  Notice gentle trends rather than streaks. Consistency grows naturally through mindful presence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col items-center gap-3 mt-auto">
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="w-full h-14 rounded-full bg-[#4a6549] hover:bg-[#344a3a] text-white text-[16px] font-medium flex items-center justify-center gap-2 shadow-md active:translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Open My Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleStartTour}
            className="min-h-[44px] px-4 rounded-full flex items-center justify-center text-[13px] text-[#434841] hover:text-[#1c1c17] active:bg-[#f1eee6] transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 mr-1.5 text-[#737970]" />
            <span>Take a 30-second guided tour</span>
          </button>
        </div>
      </div>
    </div>
  );
};
