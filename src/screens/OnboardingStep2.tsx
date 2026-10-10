import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  SlidersHorizontal,
  Ruler,
  Check,
  Camera,
  Sparkles,
  Search,
  Sprout,
  Droplets,
  Wheat,
  Moon,
  Calendar,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export const OnboardingStep2: React.FC = () => {
  const { goals, updateGoals, navigate } = useApp();
  const [massUnit, setMassUnit] = useState<'metric' | 'imperial'>(goals.massUnit);
  const [energyUnit, setEnergyUnit] = useState<'kcal' | 'kj'>(goals.energyUnit);
  const [loggingMode, setLoggingMode] = useState<'ai' | 'manual'>(goals.loggingMode);

  const [hydrationToggle, setHydrationToggle] = useState<boolean>(goals.hydrationReminders);
  const [eveningToggle, setEveningToggle] = useState<boolean>(goals.eveningReflection);
  const [weeklyToggle, setWeeklyToggle] = useState<boolean>(goals.weeklySynthesis);
  const [finalizing, setFinalizing] = useState(false);

  const handleFinalize = () => {
    setFinalizing(true);
    updateGoals({
      massUnit,
      energyUnit,
      loggingMode,
      hydrationReminders: hydrationToggle,
      eveningReflection: eveningToggle,
      weeklySynthesis: weeklyToggle,
    });
    setTimeout(() => {
      setFinalizing(false);
      navigate('onboarding-3');
    }, 500);
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-20 pb-16 px-4 max-w-lg mx-auto bg-[#fcf9f1]">
      <div className="flex flex-col w-full pb-6">
        {/* Editorial Header */}
        <div className="pt-2 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cfe9d3] text-[#536a58] mb-3 shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#4a6549]" />
            <span className="text-[12px] font-medium">Step 2 of 3 • Tailored Ritual</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl text-[#1c1c17] tracking-tight font-medium leading-snug">
            Tailor your tracking style.
          </h1>
          <p className="text-[15px] text-[#434841] mt-1.5 leading-relaxed">
            Customize how you record food and when you prefer gentle encouragement throughout your day.
          </p>
        </div>

        {/* Form Stack */}
        <div className="flex flex-col gap-4">
          {/* 1. Measurement Units */}
          <section className="rounded-2xl bg-[#f1eee6] p-4 sm:p-5 shadow-sm border border-[#e5e2da]/70">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#ffffff] flex items-center justify-center text-[#4a6549] shadow-sm">
                <Ruler className="w-4 h-4 text-[#4a6549]" />
              </div>
              <div>
                <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium leading-tight">Measurement Units</h2>
                <p className="text-[12px] text-[#737970]">Tangible portions calibrated to your kitchen</p>
              </div>
            </div>

            {/* Mass & Volume Switch */}
            <div className="mb-4">
              <label className="block text-[11px] uppercase text-[#737970] tracking-wider font-semibold mb-2">
                Mass &amp; Volume
              </label>
              <div className="relative bg-[#e5e2da] p-1 rounded-full flex items-center shadow-inner">
                <button
                  type="button"
                  onClick={() => setMassUnit('metric')}
                  className={`flex-1 py-2 px-3 rounded-full text-[13px] font-medium transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    massUnit === 'metric'
                      ? 'bg-[#ffffff] text-[#4a6549] shadow-sm font-semibold'
                      : 'text-[#434841] hover:text-[#1c1c17]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${massUnit === 'metric' ? 'bg-[#4a6549]' : 'bg-transparent'}`} />
                  Metric <span className="text-[#737970]">(g, ml)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMassUnit('imperial')}
                  className={`flex-1 py-2 px-3 rounded-full text-[13px] font-medium transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                    massUnit === 'imperial'
                      ? 'bg-[#ffffff] text-[#4a6549] shadow-sm font-semibold'
                      : 'text-[#434841] hover:text-[#1c1c17]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${massUnit === 'imperial' ? 'bg-[#4a6549]' : 'bg-transparent'}`} />
                  Imperial <span className="text-[#737970]">(oz, fl oz)</span>
                </button>
              </div>
            </div>

            {/* Energy Expression */}
            <div>
              <label className="block text-[11px] uppercase text-[#737970] tracking-wider font-semibold mb-2">
                Energy Expression
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setEnergyUnit('kcal')}
                  className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                    energyUnit === 'kcal'
                      ? 'bg-[#ffffff] border-[#4a6549] shadow-sm'
                      : 'bg-[#ebe8e0] border-transparent opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-[#4a6549] uppercase font-semibold">Standard</span>
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        energyUnit === 'kcal' ? 'bg-[#4a6549] text-white' : 'bg-[#e5e2da]'
                      }`}
                    >
                      {energyUnit === 'kcal' && <Check className="w-3 h-3 text-white" />}
                    </span>
                  </div>
                  <div className="text-[14px] font-semibold text-[#1c1c17]">Kilocalories</div>
                  <div className="text-[12px] text-[#737970]">kcal • everyday notation</div>
                </button>

                <button
                  type="button"
                  onClick={() => setEnergyUnit('kj')}
                  className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                    energyUnit === 'kj'
                      ? 'bg-[#ffffff] border-[#4a6549] shadow-sm'
                      : 'bg-[#ebe8e0] border-transparent opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-[#737970] uppercase font-semibold">SI Metric</span>
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        energyUnit === 'kj' ? 'bg-[#4a6549] text-white' : 'bg-[#e5e2da]'
                      }`}
                    >
                      {energyUnit === 'kj' && <Check className="w-3 h-3 text-white" />}
                    </span>
                  </div>
                  <div className="text-[14px] font-semibold text-[#1c1c17]">Kilojoules</div>
                  <div className="text-[12px] text-[#737970]">kJ • 1 kcal ≈ 4.184 kJ</div>
                </button>
              </div>
            </div>
          </section>

          {/* 2. Logging Style */}
          <section className="rounded-2xl bg-[#f1eee6] p-4 sm:p-5 shadow-sm border border-[#e5e2da]/70">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#ffffff] flex items-center justify-center text-[#4a6549] shadow-sm">
                <Camera className="w-4 h-4 text-[#4a6549]" />
              </div>
              <div>
                <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium leading-tight">Logging Style</h2>
                <p className="text-[12px] text-[#737970]">Choose your primary path to capture food</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Option A: AI Photo */}
              <div
                onClick={() => setLoggingMode('ai')}
                className={`cursor-pointer p-3.5 rounded-xl transition-all border ${
                  loggingMode === 'ai'
                    ? 'bg-[#ffffff] border-[#4a6549] shadow-md'
                    : 'bg-[#f6f3eb] border-transparent opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#e5e2da] shadow-inner">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFx0HeW4fKH0AmV2VK7OyhX5oiaXarc-mKqRIzSwMKEtf1y_7ycE5I1vq5UCsM1RMKcOK8ymBkluNOy3-INQauyut0LUzHlUTIaahiFskVKzZcD-MahiOVMW4_W9fA7ou0W8kNTVXdlpn8-zjoNzFj8qXevrUWn1OyGNYptmyj7mYTRvCIVjF7O3vGyi8ABBgDKEqu-tfaqrQuZYyKtkk-We_f_bLqYJuhvllGP51Hrn-4MItt4-6F"
                      alt="Steamed greens bowl"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4a6549]/30 to-transparent" />
                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#4a6549] shadow-sm">
                      <Sparkles className="w-3 h-3 text-[#4a6549]" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[14px] font-semibold text-[#1c1c17]">Smart AI Photo First</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-[#cfe9d3] text-[#536a58] text-[10px] tracking-wide uppercase font-semibold">
                          Recommended
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          loggingMode === 'ai' ? 'bg-[#4a6549] text-white shadow-sm' : 'bg-[#e5e2da]'
                        }`}
                      >
                        {loggingMode === 'ai' && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                    <p className="text-[13px] text-[#434841] mt-1 leading-snug">
                      Camera opens directly for fast sensory capture, ingredient detection, and mindful estimation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Option B: Classic Search */}
              <div
                onClick={() => setLoggingMode('manual')}
                className={`cursor-pointer p-3.5 rounded-xl transition-all border ${
                  loggingMode === 'manual'
                    ? 'bg-[#ffffff] border-[#4a6549] shadow-md'
                    : 'bg-[#f6f3eb] border-transparent opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#e5e2da] shadow-inner">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR24wKgJ2s-tfNJbvhrjyZrr1gy1wfvtxhybI4fiZ9T4C2BaCRsQatKjP3emI05Wc28NAp6D_LKsXZBbX2PHly6uzWnuGDbalbHRKYpbf0p4GWBGIRUtTRIs2XhyULZxFthy7eYTjUuwCkOj1wl3VwK1pJTCL0PDknj-majtvM2rNmXqRN3cxJ0yKl9xFG5btiy5DLKCxZzTyRKSbcEGQt6CAJgQiFfrJLxd1T1uNUKwx7WWFdz6QO"
                      alt="Recipe notebook"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#1c1c17]/10" />
                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#434841] shadow-sm">
                      <Search className="w-3 h-3 text-[#434841]" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[14px] font-semibold text-[#1c1c17]">Classic Search &amp; Manual</span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          loggingMode === 'manual' ? 'bg-[#4a6549] text-white shadow-sm' : 'bg-[#e5e2da]'
                        }`}
                      >
                        {loggingMode === 'manual' && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                    <p className="text-[13px] text-[#434841] mt-1 leading-snug">
                      Search verified culinary database, scan barcodes, or log heirloom recipes gram-by-gram.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Mindful Reminders */}
          <section className="rounded-2xl bg-[#f1eee6] p-4 sm:p-5 shadow-sm border border-[#e5e2da]/70">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-[#ffffff] flex items-center justify-center text-[#4a6549] shadow-sm">
                <Sprout className="w-4 h-4 text-[#4a6549]" />
              </div>
              <div>
                <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium leading-tight">Mindful Reminders</h2>
                <p className="text-[12px] text-[#737970]">Gentle, sensory nudges — never shrill alerts</p>
              </div>
            </div>

            {/* Philosophy Card */}
            <div className="my-3 p-3 rounded-xl bg-[#f6f3eb] flex items-center gap-3 border border-[#e5e2da]/60">
              <div className="w-8 h-8 rounded-full bg-[#cfe9d3] flex items-center justify-center text-[#0a2012] shrink-0">
                <Droplets className="w-4 h-4 text-[#4a6549]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#1c1c17]">Silent Chime Philosophy</div>
                <div className="text-[12px] text-[#737970]">Prompts reflect your natural rhythm without guilt metrics.</div>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-col gap-2.5">
              {/* Toggle 1: Hydration */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#ffffff] shadow-sm border border-[#e5e2da]/50">
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-1.5">
                    <Wheat className="w-4 h-4 text-[#4a6549]" />
                    <span className="text-[14px] font-medium text-[#1c1c17]">Hydration prompts</span>
                  </div>
                  <p className="text-[12px] text-[#434841] mt-0.5">Soft reminder every 3 hours during daytime</p>
                </div>
                <button
                  type="button"
                  onClick={() => setHydrationToggle(!hydrationToggle)}
                  className={`w-12 h-7 rounded-full relative p-0.5 transition-colors duration-200 shrink-0 flex items-center cursor-pointer ${
                    hydrationToggle ? 'bg-[#4a6549]' : 'bg-[#e5e2da]'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      hydrationToggle ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Evening Reflection */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#ffffff] shadow-sm border border-[#e5e2da]/50">
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-[#8b4e36]" />
                    <span className="text-[14px] font-medium text-[#1c1c17]">Evening reflection</span>
                  </div>
                  <p className="text-[12px] text-[#434841] mt-0.5">A quiet 8:30 PM reminder to review dinner and water</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEveningToggle(!eveningToggle)}
                  className={`w-12 h-7 rounded-full relative p-0.5 transition-colors duration-200 shrink-0 flex items-center cursor-pointer ${
                    eveningToggle ? 'bg-[#4a6549]' : 'bg-[#e5e2da]'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      eveningToggle ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: Weekly Synthesis */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#ffffff] shadow-sm border border-[#e5e2da]/50">
                <div className="flex-1 pr-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#4d6452]" />
                    <span className="text-[14px] font-medium text-[#1c1c17]">Weekly wellness synthesis</span>
                  </div>
                  <p className="text-[12px] text-[#434841] mt-0.5">Sunday morning pattern digest &amp; nourishment journal</p>
                </div>
                <button
                  type="button"
                  onClick={() => setWeeklyToggle(!weeklyToggle)}
                  className={`w-12 h-7 rounded-full relative p-0.5 transition-colors duration-200 shrink-0 flex items-center cursor-pointer ${
                    weeklyToggle ? 'bg-[#4a6549]' : 'bg-[#e5e2da]'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                      weeklyToggle ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex flex-col items-center">
          <button
            type="button"
            disabled={finalizing}
            onClick={handleFinalize}
            className="w-full py-4 px-6 rounded-full bg-[#4a6549] hover:bg-[#344a3a] text-white text-[16px] font-medium shadow-md active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {finalizing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Review &amp; Finalize</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="text-[12px] text-[#737970] mt-3 text-center">
            Notifications can be muted or customized anytime in Settings.
          </p>
        </div>
      </div>
    </div>
  );
};
