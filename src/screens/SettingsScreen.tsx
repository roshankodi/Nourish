import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  Minus,
  Plus,
  Droplets,
  Search,
  Bell,
  ShieldCheck,
  Lock,
  Download,
  RefreshCw,
  LogOut,
  Trash2,
  CheckCircle,
  Check,
  Activity,
  KeyRound,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    user,
    goals,
    updateGoals,
    signOut,
    showToast,
    authStatus,
    healthTelemetry,
    isHealthSyncing,
    healthError,
    syncGoogleHealth,
    loginWithGoogle,
    configStatus,
  } = useApp();

  const [caloricAnchor, setCaloricAnchor] = useState<number>(goals.dailyCalories);
  const [hydrationTarget, setHydrationTarget] = useState<number>(goals.dailyHydration);
  const [macroPreset, setMacroPreset] = useState<'balanced' | 'protein' | 'plant'>('balanced');
  const [massUnit, setMassUnit] = useState<'metric' | 'imperial'>(goals.massUnit);
  const [energyUnit, setEnergyUnit] = useState<'kcal' | 'kj'>(goals.energyUnit);
  const [loggingGesture, setLoggingGesture] = useState<'ai' | 'search'>(goals.loggingMode === 'ai' ? 'ai' : 'search');

  // Reminders
  const [hydrationChimes, setHydrationChimes] = useState(goals.hydrationReminders);
  const [eveningReflection, setEveningReflection] = useState(goals.eveningReflection);
  const [weeklyDigest, setWeeklyDigest] = useState(goals.weeklySynthesis);
  const [haptics, setHaptics] = useState(goals.hapticFeedback);

  const [savedFeedback, setSavedFeedback] = useState(false);

  // Macro calculations
  let carbPct = 50;
  let proteinPct = 25;
  let fatPct = 25;
  if (macroPreset === 'protein') {
    carbPct = 40;
    proteinPct = 35;
    fatPct = 25;
  } else if (macroPreset === 'plant') {
    carbPct = 60;
    proteinPct = 20;
    fatPct = 20;
  }

  const carbGrams = Math.round((caloricAnchor * (carbPct / 100)) / 4);
  const proteinGrams = Math.round((caloricAnchor * (proteinPct / 100)) / 4);
  const fatGrams = Math.round((caloricAnchor * (fatPct / 100)) / 9);

  const handleSave = () => {
    updateGoals({
      dailyCalories: caloricAnchor,
      dailyHydration: hydrationTarget,
      macroCarbs: carbPct,
      macroProtein: proteinPct,
      macroFats: fatPct,
      massUnit,
      energyUnit,
      loggingMode: loggingGesture === 'ai' ? 'ai' : 'manual',
      hydrationReminders: hydrationChimes,
      eveningReflection,
      weeklySynthesis: weeklyDigest,
      hapticFeedback: haptics,
    });
    setSavedFeedback(true);
    showToast('Preferences safely stored in your local sanctuary');
    setTimeout(() => {
      setSavedFeedback(false);
    }, 3000);
  };

  const handlePresetKcal = (k: number) => {
    setCaloricAnchor(k);
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-20 pb-36 px-4 max-w-lg mx-auto bg-[#fcf9f1]">
      <div className="flex flex-col w-full pb-6 space-y-5 pt-1">
        {/* 1. Profile & Membership Card */}
        <section className="w-full bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/80">
          <div className="flex items-center gap-3.5">
            <div className="relative w-16 h-16 rounded-full overflow-hidden shadow-inner shrink-0 border border-[#e5e2da]">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => showToast('Update profile photo')}
                aria-label="Edit profile photo"
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#4a6549] text-white flex items-center justify-center shadow-md hover:bg-[#344a3a] cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium truncate">{user.name}</h2>
                <span className="bg-[#cfe9d3] text-[#536a58] text-[11px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4a6549]" /> Sanctuary
                </span>
              </div>
              <p className="text-[12px] text-[#434841] truncate">{user.email}</p>
              <p className="text-[11px] uppercase tracking-wider text-[#737970] mt-0.5 font-semibold">
                Member since Nov 2023
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast('Profile details')}
              aria-label="Account details"
              className="w-9 h-9 rounded-full bg-[#ebe8e0] flex items-center justify-center text-[#434841] hover:text-[#1c1c17] transition-colors shrink-0 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* 2. Daily Goal Personalisation Section */}
        <section className="w-full space-y-3">
          <div>
            <div className="flex items-center gap-1 text-[#4a6549] mb-0.5">
              <SlidersHorizontal className="w-4 h-4 text-[#4a6549]" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Calibration</span>
            </div>
            <h2 className="font-editorial text-2xl text-[#1c1c17] font-medium">Daily Intentions &amp; Targets</h2>
            <p className="text-[13px] text-[#434841]">Flexible baselines calibrated to your natural energy flow.</p>
          </div>

          {/* Caloric Anchor Card */}
          <div className="w-full bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/80 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#4a6549] font-semibold">Energy Baseline</span>
                <h3 className="font-editorial text-[17px] text-[#1c1c17] font-medium mt-0.5">Caloric Anchor</h3>
                <p className="text-[12px] text-[#737970]">Adaptive baseline with ±150 kcal mindful buffer</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#ffffff] flex items-center justify-center text-[#8b4e36] shadow-sm">
                <Flame className="w-5 h-5 text-[#8b4e36]" />
              </div>
            </div>

            {/* Stepper */}
            <div className="bg-[#f1eee6] rounded-xl p-3 flex items-center justify-between debossed-well">
              <button
                type="button"
                onClick={() => setCaloricAnchor((p) => Math.max(1200, p - 50))}
                aria-label="Decrease calorie goal"
                className="w-10 h-10 rounded-full bg-white text-[#1c1c17] shadow-sm flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-semibold text-[#1c1c17] tracking-tight tabular-nums">
                    {caloricAnchor.toLocaleString()}
                  </span>
                  <span className="font-editorial text-lg text-[#737970] italic">kcal</span>
                </div>
                <span className="text-[11px] text-[#737970]">target per circadian cycle</span>
              </div>
              <button
                type="button"
                onClick={() => setCaloricAnchor((p) => Math.min(3600, p + 50))}
                aria-label="Increase calorie goal"
                className="w-10 h-10 rounded-full bg-white text-[#1c1c17] shadow-sm flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[1800, 2000, 2200].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => handlePresetKcal(k)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    caloricAnchor === k
                      ? 'bg-[#4a6549] text-white shadow-sm'
                      : 'bg-[#f1eee6] text-[#434841] hover:bg-[#ebe8e0]'
                  }`}
                >
                  {k.toLocaleString()} kcal{caloricAnchor === k ? ' · Active' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Macro Equilibrium Card */}
          <div className="w-full bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#4a6549] font-semibold">Macro Equilibrium</span>
                <h3 className="font-editorial text-[17px] text-[#1c1c17] font-medium mt-0.5">Nutrient Triad</h3>
              </div>
              <span className="text-[11px] font-semibold bg-[#cfe9d3] text-[#536a58] px-2.5 py-1 rounded-full">
                Harmonized
              </span>
            </div>

            {/* Segmented Bar */}
            <div className="space-y-1.5">
              <div className="h-4 w-full rounded-full bg-[#ebe8e0] overflow-hidden flex shadow-inner">
                <div className="bg-[#8ba888] h-full transition-all duration-300" style={{ width: `${carbPct}%` }} />
                <div className="bg-[#4a6549] h-full transition-all duration-300" style={{ width: `${proteinPct}%` }} />
                <div className="bg-[#d88e72] h-full transition-all duration-300" style={{ width: `${fatPct}%` }} />
              </div>
              <div className="flex justify-between items-center text-[#434841] text-[11px] pt-1">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8ba888]" />
                  <span>Carbs <strong>{carbPct}%</strong> ({carbGrams}g)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4a6549]" />
                  <span>Protein <strong>{proteinPct}%</strong> ({proteinGrams}g)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d88e72]" />
                  <span>Fats <strong>{fatPct}%</strong> ({fatGrams}g)</span>
                </div>
              </div>
            </div>

            {/* Ratio Presets */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setMacroPreset('balanced')}
                className={`px-2 py-2 rounded-xl text-center transition-all cursor-pointer ${
                  macroPreset === 'balanced'
                    ? 'bg-[#4a6549] text-white shadow-sm'
                    : 'bg-[#f1eee6] text-[#434841] hover:bg-[#ebe8e0]'
                }`}
              >
                <span className="block text-[12px] font-semibold">Balanced</span>
                <span className="text-[10px] opacity-80">50 · 25 · 25</span>
              </button>
              <button
                type="button"
                onClick={() => setMacroPreset('protein')}
                className={`px-2 py-2 rounded-xl text-center transition-all cursor-pointer ${
                  macroPreset === 'protein'
                    ? 'bg-[#4a6549] text-white shadow-sm'
                    : 'bg-[#f1eee6] text-[#434841] hover:bg-[#ebe8e0]'
                }`}
              >
                <span className="block text-[12px] font-semibold">Protein+</span>
                <span className="text-[10px] opacity-80">40 · 35 · 25</span>
              </button>
              <button
                type="button"
                onClick={() => setMacroPreset('plant')}
                className={`px-2 py-2 rounded-xl text-center transition-all cursor-pointer ${
                  macroPreset === 'plant'
                    ? 'bg-[#4a6549] text-white shadow-sm'
                    : 'bg-[#f1eee6] text-[#434841] hover:bg-[#ebe8e0]'
                }`}
              >
                <span className="block text-[12px] font-semibold">Plant Focus</span>
                <span className="text-[10px] opacity-80">60 · 20 · 20</span>
              </button>
            </div>
          </div>

          {/* Hydration Target Card */}
          <div className="w-full bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/80 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#4d6452] font-semibold">Liquid Vitality</span>
                <h3 className="font-editorial text-[17px] text-[#1c1c17] font-medium mt-0.5">Hydration Target</h3>
                <p className="text-[12px] text-[#737970]">Fluid target adjusts slightly on high movement days</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#cfe9d3] text-[#536a58] flex items-center justify-center">
                <Droplets className="w-5 h-5 text-[#4a6549]" />
              </div>
            </div>

            <div className="bg-[#f1eee6] rounded-xl p-3 flex items-center justify-between debossed-well">
              <button
                type="button"
                onClick={() => setHydrationTarget((p) => Math.max(500, p - 250))}
                aria-label="Decrease water target"
                className="px-3 py-1.5 rounded-full bg-white text-[#1c1c17] shadow-sm flex items-center gap-1 active:scale-95 transition-transform text-[12px] font-medium cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" /> 250ml
              </button>
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-semibold text-[#1c1c17] tracking-tight tabular-nums">
                    {hydrationTarget.toLocaleString()}
                  </span>
                  <span className="font-editorial text-lg text-[#737970] italic">ml</span>
                </div>
                <span className="text-[11px] text-[#737970]">≈ {Math.round(hydrationTarget / 250)} mindful vessels</span>
              </div>
              <button
                type="button"
                onClick={() => setHydrationTarget((p) => Math.min(5000, p + 250))}
                aria-label="Increase water target"
                className="px-3 py-1.5 rounded-full bg-white text-[#1c1c17] shadow-sm flex items-center gap-1 active:scale-95 transition-transform text-[12px] font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> 250ml
              </button>
            </div>
          </div>
        </section>

        {/* 3. Food & Logging Preferences */}
        <section className="w-full space-y-3">
          <div>
            <div className="flex items-center gap-1 text-[#4a6549] mb-0.5">
              <SlidersHorizontal className="w-4 h-4 text-[#4a6549]" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Ergonomics</span>
            </div>
            <h2 className="font-editorial text-2xl text-[#1c1c17] font-medium">Food &amp; Logging Preferences</h2>
            <p className="text-[13px] text-[#434841]">Structure how Nourish interprets and reads ingredients.</p>
          </div>

          <div className="w-full bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/80 space-y-3.5">
            {/* Measurement Units */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[14px] font-semibold text-[#1c1c17] block">Measurement Standard</span>
                <span className="text-[12px] text-[#737970]">Units for kitchen weights &amp; portions</span>
              </div>
              <div className="bg-[#ebe8e0] p-1 rounded-full flex gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setMassUnit('metric')}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                    massUnit === 'metric' ? 'bg-white text-[#1c1c17] shadow-sm font-semibold' : 'text-[#737970]'
                  }`}
                >
                  Metric (g, ml)
                </button>
                <button
                  type="button"
                  onClick={() => setMassUnit('imperial')}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                    massUnit === 'imperial' ? 'bg-white text-[#1c1c17] shadow-sm font-semibold' : 'text-[#737970]'
                  }`}
                >
                  Imperial (oz)
                </button>
              </div>
            </div>

            <div className="h-px bg-[#e5e2da] w-full" />

            {/* Energy Notation */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[14px] font-semibold text-[#1c1c17] block">Energy Units</span>
                <span className="text-[12px] text-[#737970]">Primary reporting unit</span>
              </div>
              <div className="bg-[#ebe8e0] p-1 rounded-full flex gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setEnergyUnit('kcal')}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                    energyUnit === 'kcal' ? 'bg-white text-[#1c1c17] shadow-sm font-semibold' : 'text-[#737970]'
                  }`}
                >
                  kcal
                </button>
                <button
                  type="button"
                  onClick={() => setEnergyUnit('kj')}
                  className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all cursor-pointer ${
                    energyUnit === 'kj' ? 'bg-white text-[#1c1c17] shadow-sm font-semibold' : 'text-[#737970]'
                  }`}
                >
                  kJ
                </button>
              </div>
            </div>

            <div className="h-px bg-[#e5e2da] w-full" />

            {/* Preferred Ingestion Gesture */}
            <div className="space-y-2">
              <span className="text-[14px] font-semibold text-[#1c1c17] block">Preferred Ingestion Gesture</span>
              <div className="grid grid-cols-1 gap-2">
                <div
                  onClick={() => setLoggingGesture('ai')}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                    loggingGesture === 'ai'
                      ? 'bg-white border-[#4a6549] shadow-sm'
                      : 'bg-[#f1eee6] border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-[#4a6549]" />
                    <div>
                      <span className="text-[13px] font-semibold text-[#1c1c17] block">AI Lens First</span>
                      <span className="text-[11px] text-[#737970]">Instant botanical &amp; plate recognition</span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      loggingGesture === 'ai' ? 'bg-[#4a6549] text-white shadow-sm' : 'bg-[#e5e2da]'
                    }`}
                  >
                    {loggingGesture === 'ai' && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>

                <div
                  onClick={() => setLoggingGesture('search')}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                    loggingGesture === 'search'
                      ? 'bg-white border-[#4a6549] shadow-sm'
                      : 'bg-[#f1eee6] border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-[#737970]" />
                    <div>
                      <span className="text-[13px] font-semibold text-[#1c1c17] block">Search Index First</span>
                      <span className="text-[11px] text-[#737970]">Manual catalog query &amp; barcode</span>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      loggingGesture === 'search' ? 'bg-[#4a6549] text-white shadow-sm' : 'bg-[#e5e2da]'
                    }`}
                  >
                    {loggingGesture === 'search' && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-[#e5e2da] w-full" />

            {/* Circadian Meal Slots */}
            <div className="space-y-1.5">
              <span className="text-[14px] font-semibold text-[#1c1c17] block">Circadian Meal Slots</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#f1eee6] p-2.5 rounded-xl debossed-light">
                  <span className="text-[10px] uppercase text-[#737970] font-semibold block">First Light</span>
                  <span className="text-xl font-bold text-[#1c1c17]">8:00</span>
                  <span className="text-[11px] text-[#4a6549] font-semibold block mt-0.5">Breakfast</span>
                </div>
                <div className="bg-[#f1eee6] p-2.5 rounded-xl debossed-light">
                  <span className="text-[10px] uppercase text-[#737970] font-semibold block">Zenith</span>
                  <span className="text-xl font-bold text-[#1c1c17]">1:00</span>
                  <span className="text-[11px] text-[#4a6549] font-semibold block mt-0.5">Midday</span>
                </div>
                <div className="bg-[#f1eee6] p-2.5 rounded-xl debossed-light">
                  <span className="text-[10px] uppercase text-[#737970] font-semibold block">Dusk</span>
                  <span className="text-xl font-bold text-[#1c1c17]">7:30</span>
                  <span className="text-[11px] text-[#4a6549] font-semibold block mt-0.5">Dinner</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Mindful Reminders */}
        <section className="w-full space-y-3">
          <div>
            <div className="flex items-center gap-1 text-[#4a6549] mb-0.5">
              <Bell className="w-4 h-4 text-[#4a6549]" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Atmosphere</span>
            </div>
            <h2 className="font-editorial text-2xl text-[#1c1c17] font-medium">Mindful Reminders</h2>
            <p className="text-[13px] text-[#434841]">Gentle, sensory nudges — never shrill or guilt-inducing alerts.</p>
          </div>

          <div className="w-full bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/80 divide-y divide-[#e5e2da] space-y-3">
            {/* Hydration Chimes */}
            <div className="flex items-center justify-between pt-1">
              <div className="pr-3">
                <h3 className="text-[14px] font-semibold text-[#1c1c17]">Hydration Chimes</h3>
                <p className="text-[12px] text-[#434841]">Gentle water reminder every 3 hours during active hours</p>
              </div>
              <button
                type="button"
                onClick={() => setHydrationChimes(!hydrationChimes)}
                className={`w-12 h-7 rounded-full relative p-0.5 transition-colors shrink-0 flex items-center cursor-pointer ${
                  hydrationChimes ? 'bg-[#4a6549]' : 'bg-[#e5e2da]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                    hydrationChimes ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Evening Reflection */}
            <div className="flex items-center justify-between pt-3">
              <div className="pr-3">
                <h3 className="text-[14px] font-semibold text-[#1c1c17]">Evening Reflection</h3>
                <p className="text-[12px] text-[#434841]">Quiet 8:30 PM reminder to review nourishment &amp; presence</p>
              </div>
              <button
                type="button"
                onClick={() => setEveningReflection(!eveningReflection)}
                className={`w-12 h-7 rounded-full relative p-0.5 transition-colors shrink-0 flex items-center cursor-pointer ${
                  eveningReflection ? 'bg-[#4a6549]' : 'bg-[#e5e2da]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                    eveningReflection ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Weekly Digest */}
            <div className="flex items-center justify-between pt-3">
              <div className="pr-3">
                <h3 className="text-[14px] font-semibold text-[#1c1c17]">Weekly Digest</h3>
                <p className="text-[12px] text-[#434841]">Sunday morning synthesis &amp; cyclical pattern journal</p>
              </div>
              <button
                type="button"
                onClick={() => setWeeklyDigest(!weeklyDigest)}
                className={`w-12 h-7 rounded-full relative p-0.5 transition-colors shrink-0 flex items-center cursor-pointer ${
                  weeklyDigest ? 'bg-[#4a6549]' : 'bg-[#e5e2da]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                    weeklyDigest ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sensory Mechanical Haptics */}
            <div className="flex items-center justify-between pt-3">
              <div className="pr-3">
                <h3 className="text-[14px] font-semibold text-[#1c1c17]">Sensory Mechanical Haptics</h3>
                <p className="text-[12px] text-[#434841]">Weighted ceramic clicks on water logs and ingredient captures</p>
              </div>
              <button
                type="button"
                onClick={() => setHaptics(!haptics)}
                className={`w-12 h-7 rounded-full relative p-0.5 transition-colors shrink-0 flex items-center cursor-pointer ${
                  haptics ? 'bg-[#4a6549]' : 'bg-[#e5e2da]'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${
                    haptics ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* 5. Google Cloud & Health API Integrations Section */}
        <section className="w-full space-y-3">
          <div>
            <div className="flex items-center gap-1 text-[#4a6549] mb-0.5">
              <Activity className="w-4 h-4 text-[#4a6549]" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Integrations</span>
            </div>
            <h2 className="font-editorial text-2xl text-[#1c1c17] font-medium">Google Cloud &amp; Health API</h2>
            <p className="text-[13px] text-[#434841]">
              Secure OAuth 2.0 authorization and telemetry synchronization. Developed with Google AI &amp; Google Build with AI Bootcamps.
            </p>
          </div>

          <div className="w-full bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/80 space-y-3">
            {/* Status overview */}
            <div className="flex items-center justify-between pb-2 border-b border-[#e5e2da]">
              <div>
                <h3 className="text-[14px] font-semibold text-[#1c1c17]">Google Health Telemetry</h3>
                <p className="text-[12px] text-[#434841]">
                  Scope: <code className="text-[10px] font-mono bg-[#ebe8e0] px-1 py-0.5 rounded">googlehealth.activity_and_fitness.readonly</code>
                </p>
              </div>
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  authStatus.healthScopeGranted
                    ? 'bg-[#cfe9d3] text-[#243d24]'
                    : 'bg-[#ffdad6] text-[#ba1a1a]'
                }`}
              >
                {authStatus.healthScopeGranted ? 'Scope Granted' : 'Scope Pending'}
              </span>
            </div>

            {/* Credential Status Details */}
            <div className="bg-[#ffffff] rounded-xl p-3 border border-[#e5e2da] text-[12px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#434841] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#4a6549]" />
                  OAuth Client ID:
                </span>
                <span className="font-mono text-[11px] font-semibold text-[#1c1c17]">
                  {configStatus?.googleOAuth.configured ? 'Configured in .env' : 'Missing in .env'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#434841] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#4a6549]" />
                  Google Health API Key:
                </span>
                <span className="font-mono text-[11px] font-semibold text-[#1c1c17]">
                  {configStatus?.googleHealthApi?.configured
                    ? `Active (${configStatus.googleHealthApi.apiKeyPreview})`
                    : 'Missing in .env'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#434841]">Redirect URI:</span>
                <span className="font-mono text-[10px] text-[#737970] truncate max-w-[200px]">
                  {configStatus?.googleOAuth.redirectUri || 'http://localhost:3000/api/auth/google/callback'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#434841]">Gemini Vision &amp; Chat:</span>
                <span className={`font-semibold ${configStatus?.geminiApi.configured ? 'text-[#4a6549]' : 'text-[#ba1a1a]'}`}>
                  {configStatus?.geminiApi.configured ? 'Active (Gemini 3.8 Flash)' : 'Missing Key in .env'}
                </span>
              </div>
            </div>

            {healthError && (
              <div className="bg-[#fff8f2] border border-[#f5d0b5] rounded-xl p-3 text-[12px] text-[#7a4128] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
                <span>{healthError}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={syncGoogleHealth}
                disabled={isHealthSyncing || !authStatus.isAuthenticated}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#4a6549] hover:bg-[#344a3a] text-white text-[13px] font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isHealthSyncing ? 'animate-spin' : ''}`} />
                <span>{isHealthSyncing ? 'Syncing...' : 'Sync Telemetry Now'}</span>
              </button>

              <button
                type="button"
                onClick={loginWithGoogle}
                className="py-2.5 px-3 rounded-xl bg-[#ebe8e0] hover:bg-[#e5e2da] text-[#1c1c17] text-[13px] font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>{authStatus.isAuthenticated ? 'Re-authorize OAuth' : 'Connect Account'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 6. Data Sovereignty */}
        <section className="w-full space-y-3">
          <div>
            <div className="flex items-center gap-1 text-[#4a6549] mb-0.5">
              <ShieldCheck className="w-4 h-4 text-[#4a6549]" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Sanctuary Trust</span>
            </div>
            <h2 className="font-editorial text-2xl text-[#1c1c17] font-medium">Data Sovereignty</h2>
          </div>

          <div className="w-full bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/80 space-y-3">
            {/* Privacy Promise Box */}
            <div className="bg-[#cfe9d3]/60 rounded-xl p-3.5 flex gap-3 items-start border border-[#b4cdb8]/60">
              <Lock className="w-5 h-5 text-[#4a6549] shrink-0 mt-0.5" />
              <p className="text-[12px] text-[#536a58] leading-relaxed">
                <strong className="text-[#1c1c17]">Data Privacy Guarantee:</strong> Your meal photos and logs are encrypted on-device. They are never sold or used to train public machine learning foundations.
              </p>
            </div>

            {/* Export Button */}
            <button
              type="button"
              onClick={() => showToast('Personal Health Dossier exported as CSV/PDF')}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#f1eee6] transition-colors text-[#1c1c17] flex items-center justify-between shadow-sm border border-[#e5e2da] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Download className="w-4 h-4 text-[#4a6549]" />
                <span className="text-[14px] font-semibold">Export Personal Health Dossier</span>
              </div>
              <span className="text-[11px] text-[#737970] font-semibold">CSV · PDF</span>
            </button>

            {/* Actions */}
            <div className="space-y-1 pt-1">
              <button
                type="button"
                onClick={() => showToast('AI Recognition cache cleared')}
                className="w-full py-2.5 px-3 rounded-xl text-left text-[#434841] hover:text-[#1c1c17] hover:bg-[#ebe8e0] transition-colors flex items-center gap-2.5 text-[13px] font-medium cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Clear Cached Recognition Models</span>
              </button>

              <button
                type="button"
                onClick={signOut}
                className="w-full py-2.5 px-3 rounded-xl text-left text-[#434841] hover:text-[#1c1c17] hover:bg-[#ebe8e0] transition-colors flex items-center gap-2.5 text-[13px] font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out from Device</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all sanctuary logs?')) {
                    showToast('Account records cleared');
                  }
                }}
                className="w-full py-2.5 px-3 rounded-xl text-left text-[#ba1a1a] hover:bg-[#ffdad6]/30 transition-colors flex items-center gap-2.5 text-[13px] font-medium cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Sanctuary Account &amp; All Records</span>
              </button>
            </div>
          </div>
        </section>

        {/* 6. Save Button & Feedback */}
        <div className="w-full pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-4 px-6 rounded-full bg-[#4a6549] hover:bg-[#344a3a] text-white font-editorial text-[18px] font-medium shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-5 h-5 text-white" />
            <span>Save Goal Changes</span>
          </button>
          {savedFeedback && (
            <p className="text-center text-[12px] text-[#4a6549] font-semibold mt-2 animate-fadeIn">
              Preferences safely stored in your local sanctuary.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
