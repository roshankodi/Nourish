import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flame, Minus, Plus, Sparkles, Droplets, Flower2, SlidersHorizontal, ArrowRight, CheckCircle2 } from 'lucide-react';

export const OnboardingStep1: React.FC = () => {
  const { goals, updateGoals, navigate } = useApp();
  const [calorieVal, setCalorieVal] = useState<number>(goals.dailyCalories || 2000);
  const [waterVal, setWaterVal] = useState<number>(goals.dailyHydration || 2000);

  const handleCalorieChange = (delta: number) => {
    const next = Math.max(1200, Math.min(3600, calorieVal + delta));
    setCalorieVal(next);
    updateGoals({ dailyCalories: next });
  };

  const handleCaloriePreset = (val: number) => {
    setCalorieVal(val);
    updateGoals({ dailyCalories: val });
  };

  const handleWaterPreset = (val: number) => {
    setWaterVal(val);
    updateGoals({ dailyHydration: val });
  };

  const handleCustomWater = () => {
    const res = window.prompt('Enter your preferred hydration target (ml):', waterVal.toString());
    if (res) {
      const parsed = parseInt(res.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed) && parsed >= 500 && parsed <= 5000) {
        setWaterVal(parsed);
        updateGoals({ dailyHydration: parsed });
      }
    }
  };

  // Compute macro grams based on calories (50% carbs, 25% protein, 25% fats)
  const carbsG = Math.round((calorieVal * 0.5) / 4);
  const proteinG = Math.round((calorieVal * 0.25) / 4);
  const fatsG = Math.round((calorieVal * 0.25) / 9);

  // Water level percentage
  const waterPct = Math.min(95, Math.max(25, (waterVal / 3000) * 100));

  return (
    <div className="flex-1 flex flex-col relative w-full pt-20 pb-16 px-4 max-w-lg mx-auto bg-[#fcf9f1]">
      <div className="flex flex-col w-full pb-6">
        {/* Progress & Context Strip */}
        <div className="flex items-center justify-between py-2 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cfe9d3] text-[#536a58]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a6549] animate-pulse" />
            <span className="text-[12px] font-medium">Step 1 of 3 · Personal Rhythm</span>
          </div>
          <span className="text-[13px] text-[#737970]">Paced &amp; Mindful</span>
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-1 mb-5">
          <h1 className="font-editorial text-2xl sm:text-3xl text-[#1c1c17] tracking-tight font-medium leading-snug">
            Set your gentle daily intentions.
          </h1>
          <p className="text-[15px] text-[#434841] leading-relaxed">
            We use flexible targets rather than rigid limits. You can adjust these anytime in your sanctuary settings.
          </p>
        </div>

        {/* Card 1: Calorie Guideline */}
        <section className="rounded-2xl bg-[#f6f3eb] p-4 sm:p-5 shadow-sm border border-[#e5e2da]/70 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#f1eee6] flex items-center justify-center text-[#8b4e36] shadow-inner">
                <Flame className="w-4 h-4 text-[#8b4e36]" />
              </div>
              <div>
                <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium leading-tight">
                  Daily Calorie Guideline
                </h2>
                <p className="text-[12px] text-[#737970]">Nourishment baseline</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ccebc7] text-[#07200b] text-[11px] font-semibold uppercase tracking-wider">
              Adaptive
            </span>
          </div>

          {/* Stepper */}
          <div className="my-3 rounded-xl bg-[#f1eee6] p-3.5 debossed-well">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleCalorieChange(-50)}
                aria-label="Decrease target calories"
                className="w-11 h-11 rounded-full bg-[#ffffff] text-[#1c1c17] flex items-center justify-center shadow-sm active:translate-y-0.5 active:shadow-inner transition-transform cursor-pointer"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl text-[#1c1c17] font-semibold tracking-tight tabular-nums">
                    {calorieVal.toLocaleString()}
                  </span>
                  <span className="font-editorial text-lg italic text-[#434841]">kcal</span>
                </div>
                <span className="text-[11px] text-[#737970] tracking-wider uppercase font-medium">
                  Baseline daily energy
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCalorieChange(50)}
                aria-label="Increase target calories"
                className="w-11 h-11 rounded-full bg-[#ffffff] text-[#1c1c17] flex items-center justify-center shadow-sm active:translate-y-0.5 active:shadow-inner transition-transform cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preset Chips */}
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            {[1800, 2000, 2200, 2400].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleCaloriePreset(preset)}
                className={`py-2 px-1 rounded-full text-center text-[13px] font-medium transition-all cursor-pointer ${
                  calorieVal === preset
                    ? 'bg-[#4d6452] text-white shadow-sm font-semibold'
                    : 'bg-[#f1eee6] text-[#434841] hover:bg-[#ebe8e0]'
                }`}
              >
                {preset.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Buffer explanation */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#e5e2da]/50 text-[#434841] mb-3 text-[13px]">
            <Sparkles className="w-4 h-4 text-[#4a6549] shrink-0" />
            <span>
              Based on moderate daily movement · Gentle <strong className="text-[#1c1c17]">±150 kcal buffer</strong>{' '}
              included.
            </span>
          </div>

          {/* Macronutrient Preview */}
          <div className="flex flex-col gap-2 pt-2 border-t border-[#e5e2da]/60">
            <div className="flex items-center justify-between text-[11px] text-[#737970] font-semibold uppercase tracking-wider">
              <span>Macronutrient Balance Preview</span>
              <span className="text-[#4a6549]">Harmonized</span>
            </div>

            <div className="h-3 w-full rounded-full bg-[#f1eee6] overflow-hidden flex p-0.5 gap-0.5 debossed-light">
              <div className="h-full rounded-full bg-[#8ba888] transition-all duration-300" style={{ width: '50%' }} />
              <div className="h-full rounded-full bg-[#d88e72] transition-all duration-300" style={{ width: '25%' }} />
              <div className="h-full rounded-full bg-[#b4cdb8] transition-all duration-300" style={{ width: '25%' }} />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-1">
              <div className="flex flex-col items-center p-2 rounded-lg bg-[#f1eee6]">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#8ba888]" />
                  <span className="text-[13px] text-[#1c1c17] font-semibold">50%</span>
                </div>
                <span className="text-[11px] text-[#737970]">Carbs</span>
                <span className="text-[13px] text-[#434841] font-medium">{carbsG}g</span>
              </div>

              <div className="flex flex-col items-center p-2 rounded-lg bg-[#f1eee6]">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#d88e72]" />
                  <span className="text-[13px] text-[#1c1c17] font-semibold">25%</span>
                </div>
                <span className="text-[11px] text-[#737970]">Protein</span>
                <span className="text-[13px] text-[#434841] font-medium">{proteinG}g</span>
              </div>

              <div className="flex flex-col items-center p-2 rounded-lg bg-[#f1eee6]">
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#b4cdb8]" />
                  <span className="text-[13px] text-[#1c1c17] font-semibold">25%</span>
                </div>
                <span className="text-[11px] text-[#737970]">Fats</span>
                <span className="text-[13px] text-[#434841] font-medium">{fatsG}g</span>
              </div>
            </div>
          </div>
        </section>

        {/* Card 2: Hydration Rhythm */}
        <section className="rounded-2xl bg-[#f6f3eb] p-4 sm:p-5 shadow-sm border border-[#e5e2da]/70 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#cfe9d3] flex items-center justify-center text-[#536a58] shadow-inner">
                <Droplets className="w-4 h-4 text-[#4a6549]" />
              </div>
              <div>
                <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium leading-tight">
                  Hydration Rhythm
                </h2>
                <p className="text-[12px] text-[#737970]">Daily water flow</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#cfe9d3] text-[#536a58] text-[11px] font-semibold uppercase tracking-wider">
              Standard
            </span>
          </div>

          {/* Water Cylinder Graphic and Readout */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f1eee6] debossed-well my-2">
            <div className="relative w-16 h-28 rounded-2xl bg-[#ebe8e0] overflow-hidden shadow-inner flex flex-col justify-end p-1 border border-[#e5e2da]">
              <div className="absolute inset-y-2 left-1.5 flex flex-col justify-between z-10 pointer-events-none opacity-40">
                <span className="w-2.5 h-[1.5px] bg-[#1c1c17]" />
                <span className="w-1.5 h-[1.5px] bg-[#1c1c17]" />
                <span className="w-2.5 h-[1.5px] bg-[#1c1c17]" />
                <span className="w-1.5 h-[1.5px] bg-[#1c1c17]" />
                <span className="w-2.5 h-[1.5px] bg-[#1c1c17]" />
              </div>
              <div
                className="w-full rounded-xl bg-[#8ba888]/80 transition-all duration-500 ease-out flex items-start justify-center pt-1 shadow-sm"
                style={{ height: `${waterPct}%` }}
              >
                <span className="w-6 h-1 rounded-full bg-white/60" />
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl text-[#1c1c17] font-semibold tracking-tight tabular-nums">
                  {waterVal.toLocaleString()}
                </span>
                <span className="font-editorial text-lg italic text-[#434841]">ml</span>
              </div>
              <p className="text-[14px] text-[#434841] font-medium mt-0.5">
                Approx. {Math.round(waterVal / 250)} mindful glasses
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-[#737970] text-[12px]">
                <Flower2 className="w-4 h-4 text-[#4a6549]" />
                <span>Refreshes cellular energy naturally</span>
              </div>
            </div>
          </div>

          {/* Water Presets */}
          <div className="flex items-center gap-2 pt-2 overflow-x-auto pb-1">
            {[1750, 2000, 2500].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleWaterPreset(preset)}
                className={`flex-1 py-2 px-2.5 rounded-full text-center text-[13px] font-medium transition-all cursor-pointer ${
                  waterVal === preset
                    ? 'bg-[#4d6452] text-white shadow-sm font-semibold'
                    : 'bg-[#f1eee6] text-[#434841] hover:bg-[#ebe8e0]'
                }`}
              >
                {preset.toLocaleString()} ml
              </button>
            ))}
            <button
              type="button"
              onClick={handleCustomWater}
              className="flex-1 py-2 px-2.5 rounded-full text-center text-[13px] font-medium bg-[#f1eee6] text-[#434841] hover:bg-[#ebe8e0] flex items-center justify-center gap-1 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Custom</span>
            </button>
          </div>
        </section>

        {/* Inspiring Culinary Photo Card */}
        <div className="relative w-full h-36 rounded-2xl overflow-hidden shadow-sm bg-[#f1eee6] mb-6 border border-[#e5e2da]/70">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXsK4iWWIM7VlnueHf6dl10P4RnOQijf9g2Y9pI9ZrhdN0_670gOOwCoujRDFYL6HjFEvqN1hRVVfjqaI9xgKgQ6KZtZCqx_LzC9NBTYuzgFpK1g2yijq0-ZmL_UGN3WqUly-iuWsxp3zeS2gsdABpcqWR_o-o1_HlftSFQi4m1MX_S35NpRcQDQrTIu5bkmAtHik_Brk8rjwKaj5E1sndr7WpBwvmgHd_BrlJJFojZFwr2OL0qfGC"
            alt="Warm culinary breakfast table with carafe and ceramic bowl"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c17]/75 via-[#1c1c17]/30 to-transparent flex items-end p-4">
            <p className="font-editorial text-[17px] text-[#ffffff] italic leading-snug">
              "Listen to your hunger with kindness and steady attention."
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-2.5 items-center">
          <button
            type="button"
            onClick={() => navigate('onboarding-2')}
            className="w-full min-h-[52px] px-6 rounded-full bg-[#4a6549] hover:bg-[#344a3a] text-white text-[16px] font-medium flex items-center justify-center gap-2 shadow-md active:translate-y-0.5 transition-all cursor-pointer"
          >
            <span>Continue to Preferences</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-center text-[#737970] text-[12px] pt-1">
            <CheckCircle2 className="w-4 h-4 text-[#4d6452]" />
            <span>Nourish supports mindful wellness, not restrictive dieting.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
