import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Camera,
  Sparkles,
  PlusCircle,
  Droplets,
  Flame,
  Moon,
  Utensils,
  Pencil,
  Plus,
  UtensilsCrossed,
  Activity,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Footprints,
  Timer,
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const {
    user,
    goals,
    navigate,
    meals,
    totalCalories,
    totalWater,
    addWaterLog,
    waterLogs,
    authStatus,
    healthTelemetry,
    isHealthSyncing,
    healthError,
    syncGoogleHealth,
    loginWithGoogle,
  } = useApp();

  const [dateOffset, setDateOffset] = useState(0);

  // Calculate calories and macros
  const remainingKcal = Math.max(0, goals.dailyCalories - totalCalories);
  const caloriePercent = Math.min(100, Math.round((totalCalories / goals.dailyCalories) * 100));

  // Compute hydration
  const remainingWater = Math.max(0, goals.dailyHydration - totalWater);
  const waterPercent = Math.min(100, (totalWater / goals.dailyHydration) * 100);

  // Group meals
  const breakfastItems = meals.filter((m) => m.mealType === 'breakfast');
  const lunchItems = meals.filter((m) => m.mealType === 'lunch');
  const dinnerItems = meals.filter((m) => m.mealType === 'dinner');
  const snackItems = meals.filter((m) => m.mealType === 'snack');

  const breakfastKcal = breakfastItems.reduce((s, i) => s + i.calories, 0);
  const lunchKcal = lunchItems.reduce((s, i) => s + i.calories, 0);
  const dinnerKcal = dinnerItems.reduce((s, i) => s + i.calories, 0);
  const snackKcal = snackItems.reduce((s, i) => s + i.calories, 0);

  const loggedMealsCount =
    (breakfastItems.length > 0 ? 1 : 0) +
    (lunchItems.length > 0 ? 1 : 0) +
    (dinnerItems.length > 0 ? 1 : 0) +
    (snackItems.length > 0 ? 1 : 0);

  const getDateString = () => {
    if (dateOffset === 0) return 'Wed, Oct 24';
    if (dateOffset === -1) return 'Tue, Oct 23';
    if (dateOffset === 1) return 'Thu, Oct 25';
    return dateOffset < 0 ? `Oct ${24 + dateOffset}` : `Oct ${24 + dateOffset}`;
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-20 pb-36 px-4 max-w-lg mx-auto bg-[#fcf9f1]">
      <div className="flex flex-col w-full gap-4 pt-1">
        {/* Header Greeting & Date */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="font-editorial text-2xl sm:text-3xl text-[#1c1c17] tracking-tight font-medium">
                Good morning, {user.name.split(' ')[0]}
              </h1>
              <p className="text-[14px] text-[#434841]">Small steps, better habits.</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#cfe9d3] text-[#536a58] shadow-xs border border-[#b4cdb8]/40">
              <span className="w-2 h-2 rounded-full bg-[#4a6549]" />
              <span className="text-[12px] font-semibold">Day 14</span>
            </div>
          </div>

          {/* Date Dial Bar */}
          <div className="flex items-center justify-between p-1.5 rounded-full bg-[#f6f3eb] shadow-inner mt-1 border border-[#e5e2da]/70">
            <button
              type="button"
              onClick={() => setDateOffset((p) => p - 1)}
              aria-label="Previous day"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#434841] hover:text-[#1c1c17] active:scale-90 transition-transform cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#4d6452]" />
              <span className="text-[14px] font-semibold text-[#1c1c17] tracking-tight">{getDateString()}</span>
              {dateOffset === 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#e5e2da] text-[#434841] text-[10px] uppercase tracking-wider font-semibold">
                  Today
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => setDateOffset((p) => p + 1)}
              aria-label="Next day"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#434841] hover:text-[#1c1c17] active:scale-90 transition-transform cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Quick Action Pill Strip */}
        <section className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          <button
            type="button"
            onClick={() => navigate('scanner')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#4a6549] text-white shadow-md active:scale-[0.97] transition-all shrink-0 hover:bg-[#344a3a] cursor-pointer"
          >
            <div className="relative flex items-center justify-center">
              <Camera className="w-4 h-4" />
              <Sparkles className="w-2.5 h-2.5 absolute -top-1.5 -right-1.5 text-[#ffdbce]" />
            </div>
            <span className="text-[13px] font-medium tracking-wide">Scan Food</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('diary')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#f6f3eb] text-[#1c1c17] shadow-xs hover:bg-[#ebe8e0] active:scale-[0.97] transition-all shrink-0 border border-[#e5e2da] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#4d6452]" />
            <span className="text-[13px] font-medium">Add Manual</span>
          </button>

          <button
            type="button"
            onClick={() => addWaterLog(250, 'Standard glass')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#f6f3eb] text-[#1c1c17] shadow-xs hover:bg-[#ebe8e0] active:scale-[0.97] transition-all shrink-0 border border-[#e5e2da] cursor-pointer"
          >
            <Droplets className="w-4 h-4 text-[#8b4e36]" />
            <span className="text-[13px] font-medium">Log Water (+250ml)</span>
          </button>
        </section>

        {/* Energy Balance Card */}
        <section className="rounded-2xl p-5 bg-[#ffffff] shadow-sm border border-[#e5e2da]/80 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#8b4e36]" />
              <h2 className="font-editorial text-[19px] text-[#1c1c17] font-medium">Energy Balance</h2>
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#4d6452] font-semibold">Daily Metric</span>
          </div>

          {/* Circular Dial Visualizer */}
          <div className="flex flex-col items-center justify-center my-2">
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                <circle cx="80" cy="80" fill="none" r="66" stroke="#f1eee6" strokeLinecap="round" strokeWidth="12" />
                <circle cx="80" cy="80" fill="none" r="66" stroke="#e5e2da" strokeWidth="2" />
                <circle
                  className="transition-all duration-1000 ease-out"
                  cx="80"
                  cy="80"
                  fill="none"
                  r="66"
                  stroke="#8ba888"
                  strokeDasharray="414.69"
                  strokeDashoffset={414.69 - (414.69 * caloriePercent) / 100}
                  strokeLinecap="round"
                  strokeWidth="12"
                />
              </svg>

              {/* Center Debossed Well */}
              <div className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#f6f3eb] debossed-well flex flex-col items-center justify-center text-center p-2">
                <span className="text-[10px] uppercase text-[#4d6452] tracking-widest font-semibold mb-0.5">Consumed</span>
                <span className="text-3xl sm:text-4xl font-semibold text-[#1c1c17] leading-none tracking-tight tabular-nums">
                  {totalCalories.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#434841] font-medium mt-1">
                  <span className="text-[#8b4e36] font-semibold">{remainingKcal.toLocaleString()}</span> {goals.energyUnit} left
                </span>
                <div className="w-10 h-0.5 bg-[#e5e2da] rounded-full mt-1.5 opacity-70" />
                <span className="text-[10px] text-[#737970] mt-0.5">Goal {goals.dailyCalories.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Macronutrient Cavities */}
          <div className="grid grid-cols-3 gap-2.5 mt-2 pt-2 border-t border-[#e5e2da]/60">
            {/* Protein */}
            <div className="flex flex-col p-2.5 rounded-xl bg-[#f6f3eb] debossed-light">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#1c1c17]">Protein</span>
                <span className="w-2 h-2 rounded-full bg-[#d88e72]" />
              </div>
              <div className="flex items-baseline gap-0.5 my-0.5">
                <span className="text-[17px] font-semibold text-[#1c1c17] leading-none tabular-nums">68</span>
                <span className="text-[11px] text-[#737970]">/110g</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#e5e2da] overflow-hidden mt-1 shadow-inner">
                <div className="h-full bg-[#d88e72] rounded-full" style={{ width: '61.8%' }} />
              </div>
            </div>

            {/* Carbs */}
            <div className="flex flex-col p-2.5 rounded-xl bg-[#f6f3eb] debossed-light">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#1c1c17]">Carbs</span>
                <span className="w-2 h-2 rounded-full bg-[#8ba888]" />
              </div>
              <div className="flex items-baseline gap-0.5 my-0.5">
                <span className="text-[17px] font-semibold text-[#1c1c17] leading-none tabular-nums">142</span>
                <span className="text-[11px] text-[#737970]">/220g</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#e5e2da] overflow-hidden mt-1 shadow-inner">
                <div className="h-full bg-[#8ba888] rounded-full" style={{ width: '64.5%' }} />
              </div>
            </div>

            {/* Fats */}
            <div className="flex flex-col p-2.5 rounded-xl bg-[#f6f3eb] debossed-light">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#1c1c17]">Lipids</span>
                <span className="w-2 h-2 rounded-full bg-[#ffb59a]" />
              </div>
              <div className="flex items-baseline gap-0.5 my-0.5">
                <span className="text-[17px] font-semibold text-[#1c1c17] leading-none tabular-nums">44</span>
                <span className="text-[11px] text-[#737970]">/65g</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#e5e2da] overflow-hidden mt-1 shadow-inner">
                <div className="h-full bg-[#ffb59a] rounded-full" style={{ width: '67.7%' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Google Health Telemetry & Synchronization Section */}
        <section className="rounded-2xl p-5 bg-[#ffffff] shadow-sm border border-[#e5e2da]/80 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${healthTelemetry ? 'bg-[#4a6549] animate-pulse' : 'bg-[#d8d5cc]'}`} />
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#4a6549]" />
                <h2 className="font-editorial text-[19px] text-[#1c1c17] font-medium">Google Health Synchronization</h2>
              </div>
            </div>

            {authStatus.isAuthenticated && (
              <button
                type="button"
                onClick={syncGoogleHealth}
                disabled={isHealthSyncing}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f6f3eb] hover:bg-[#ebe8e0] text-[#4a6549] text-[11px] font-semibold border border-[#e5e2da] transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isHealthSyncing ? 'animate-spin' : ''}`} />
                <span>{isHealthSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            )}
          </div>

          {healthTelemetry ? (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2.5">
                {/* Steps */}
                <div className="p-3 rounded-xl bg-[#f6f3eb] debossed-light flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#4a6549]">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#737970]">Daily Steps</span>
                    <Footprints className="w-3.5 h-3.5" />
                  </div>
                  <div className="my-1.5">
                    <span className="text-xl font-bold text-[#1c1c17] tabular-nums block">
                      {healthTelemetry.stepsToday.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[#737970]">Target: 10,000</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#e5e2da] overflow-hidden">
                    <div
                      className="h-full bg-[#4a6549] rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, (healthTelemetry.stepsToday / 10000) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Active Burn */}
                <div className="p-3 rounded-xl bg-[#f6f3eb] debossed-light flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#8b4e36]">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#737970]">Active Burn</span>
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <div className="my-1.5">
                    <span className="text-xl font-bold text-[#8b4e36] tabular-nums block">
                      +{healthTelemetry.activeCaloriesBurned}
                    </span>
                    <span className="text-[10px] text-[#737970]">kcal burned</span>
                  </div>
                  <span className="text-[10px] text-[#4a6549] font-medium">Vitality Buffer</span>
                </div>

                {/* Active Minutes */}
                <div className="p-3 rounded-xl bg-[#f6f3eb] debossed-light flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[#4d6452]">
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-[#737970]">Movement</span>
                    <Timer className="w-3.5 h-3.5" />
                  </div>
                  <div className="my-1.5">
                    <span className="text-xl font-bold text-[#1c1c17] tabular-nums block">
                      {healthTelemetry.activeMinutesToday}
                    </span>
                    <span className="text-[10px] text-[#737970]">active mins</span>
                  </div>
                  <span className="text-[10px] text-[#737970]">Circadian flow</span>
                </div>
              </div>

              {/* Dynamic Vitality Adjustment Note */}
              <div className="bg-[#cfe9d3]/40 border border-[#b4cdb8]/60 rounded-xl p-3 flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-2 text-[#243d24]">
                  <CheckCircle2 className="w-4 h-4 text-[#4a6549] shrink-0" />
                  <span>
                    <strong>Energy Buffer:</strong> Active burn adjusts your mindful remaining target to{' '}
                    <strong>{(remainingKcal + healthTelemetry.activeCaloriesBurned).toLocaleString()} kcal</strong>.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#737970] pt-0.5">
                <span>Source: Google Health API (Activity &amp; Fitness)</span>
                <span>Last Synced: {healthTelemetry.lastSyncTime}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#fbf9f4] border border-[#e5e2da] flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#cfe9d3] text-[#4a6549] flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-semibold text-[#1c1c17]">Link Google Health &amp; Activity</h3>
                  <p className="text-[12px] text-[#434841] mt-0.5 leading-relaxed">
                    Grant read-only access to synchronize real-time steps, active calorie expenditure, and workout duration directly into Nourish.
                  </p>
                </div>
              </div>

              {healthError && (
                <div className="bg-[#fff8f2] border border-[#f5d0b5] rounded-lg p-2.5 text-[11px] text-[#7a4128] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
                  <span>{healthError}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="py-2.5 px-4 rounded-full bg-[#4a6549] hover:bg-[#344a3a] text-white text-[13px] font-medium shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>Connect Google Health</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('settings')}
                  className="py-2.5 px-3 rounded-full bg-[#ebe8e0] hover:bg-[#e5e2da] text-[#434841] text-[12px] font-medium transition-colors cursor-pointer"
                >
                  View OAuth Scopes
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Water Intake Tracker Card ("Hydration Well") */}
        <section className="rounded-2xl p-5 bg-[#ffffff] shadow-sm border border-[#e5e2da]/80 relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#b4cdb8]" />
              <h2 className="font-editorial text-[19px] text-[#1c1c17] font-medium">Hydration Well</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('hydration')}
              className="text-[11px] font-semibold text-[#4d6452] px-2.5 py-0.5 rounded-full bg-[#cfe9d3] hover:bg-[#b0cfad] transition-colors cursor-pointer"
            >
              {waterPercent.toFixed(1)}% Complete
            </button>
          </div>

          <div className="flex items-center gap-4 py-2">
            {/* Tactile Graduated Water Glass Vessel */}
            <div
              onClick={() => navigate('hydration')}
              className="cursor-pointer relative w-20 h-28 rounded-xl bg-[#f6f3eb] debossed-well overflow-hidden flex items-end justify-center shrink-0 border border-[#e5e2da]"
            >
              <div className="absolute inset-y-2 left-1.5 flex flex-col justify-between z-10 opacity-40 pointer-events-none">
                <div className="w-2 h-0.5 bg-[#737970]" />
                <div className="w-3 h-0.5 bg-[#737970]" />
                <div className="w-2 h-0.5 bg-[#737970]" />
                <div className="w-3 h-0.5 bg-[#737970]" />
              </div>

              {/* Water Level */}
              <div
                className="w-full bg-[#cfe9d3] relative transition-all duration-700 ease-in-out"
                style={{ height: `${waterPercent}%` }}
              >
                <div className="absolute -top-1 inset-x-0 h-2 rounded-full bg-[#cfe9d3] opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4d6452]/20 to-transparent" />
              </div>

              {/* Glass overlay reflection */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/10 pointer-events-none" />
            </div>

            {/* Metrics Readout */}
            <div className="flex flex-col flex-1 justify-center">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-semibold text-[#1c1c17] leading-tight tracking-tight tabular-nums">
                  {totalWater.toLocaleString()}
                </span>
                <span className="font-editorial text-lg text-[#737970] italic">ml</span>
              </div>
              <p className="text-[13px] text-[#434841] mt-0.5">
                <strong className="text-[#4d6452]">{remainingWater.toLocaleString()} ml remaining</strong> to reach your{' '}
                {(goals.dailyHydration / 1000).toFixed(1)}L goal today.
              </p>
              <div className="w-full h-2 rounded-full bg-[#ebe8e0] shadow-inner overflow-hidden mt-3">
                <div
                  className="h-full bg-[#4a6549] rounded-full transition-all duration-500"
                  style={{ width: `${waterPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Water Quick-Add Buttons */}
          <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#e5e2da]/60">
            {[150, 250, 500].map((vol) => (
              <button
                key={vol}
                type="button"
                onClick={() => addWaterLog(vol, vol === 150 ? 'Small cup' : vol === 250 ? 'Standard glass' : 'Carafe')}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#f6f3eb] shadow-xs active:translate-y-0.5 hover:bg-[#ebe8e0] transition-all text-[#1c1c17] border border-[#e5e2da] cursor-pointer"
              >
                <span className="text-[13px] font-semibold">+{vol}</span>
                <span className="text-[10px] text-[#737970] uppercase">ml</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => navigate('hydration')}
              className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#cfe9d3] text-[#243d24] shadow-xs active:translate-y-0.5 hover:bg-[#b0cfad] transition-all border border-[#b4cdb8] cursor-pointer"
            >
              <Plus className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] uppercase tracking-wider font-semibold">Custom</span>
            </button>
          </div>
        </section>

        {/* Today's Meals Timeline */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-[#4a6549]" />
              <h2 className="font-editorial text-[19px] text-[#1c1c17] font-medium">Meals &amp; Sustenance</h2>
            </div>
            <span className="text-[13px] text-[#434841] font-medium">{loggedMealsCount} of 4 logged</span>
          </div>

          {/* Breakfast Tile */}
          <div className="rounded-2xl p-4 bg-[#ffffff] shadow-sm border border-[#e5e2da]/80 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4a6549]" />
                <span className="font-editorial text-[17px] font-semibold text-[#1c1c17]">Breakfast</span>
                <span className="text-[12px] text-[#737970]">· 8:15 AM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-[#1c1c17]">
                  {breakfastKcal} <span className="text-[12px] text-[#737970] font-normal">{goals.energyUnit}</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigate('diary')}
                  aria-label="Edit Breakfast"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#737970] hover:text-[#1c1c17] hover:bg-[#f1eee6] transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {breakfastItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#f6f3eb] border border-[#e5e2da]/50">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover shadow-inner shrink-0"
                      />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-medium text-[#1c1c17] truncate">{item.name}</span>
                      <span className="text-[11px] text-[#434841]">
                        {item.carbs}g Carbs · {item.protein}g Protein · {item.fat}g Fat
                      </span>
                    </div>
                  </div>
                  <span className="text-[13px] font-semibold text-[#1c1c17] shrink-0">{item.calories} kcal</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lunch Tile */}
          <div className="rounded-2xl p-4 bg-[#ffffff] shadow-sm border border-[#e5e2da]/80 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4a6549]" />
                <span className="font-editorial text-[17px] font-semibold text-[#1c1c17]">Lunch</span>
                <span className="text-[12px] text-[#737970]">· 1:10 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-[#1c1c17]">
                  {lunchKcal} <span className="text-[12px] text-[#737970] font-normal">{goals.energyUnit}</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigate('diary')}
                  aria-label="Edit Lunch"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#737970] hover:text-[#1c1c17] hover:bg-[#f1eee6] transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {lunchItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#f6f3eb] border border-[#e5e2da]/50">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover shadow-inner shrink-0"
                      />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-medium text-[#1c1c17] truncate">{item.name}</span>
                      <span className="text-[11px] text-[#434841]">
                        {item.carbs}g Carbs · {item.protein}g Protein · {item.fat}g Fat
                      </span>
                    </div>
                  </div>
                  <span className="text-[13px] font-semibold text-[#1c1c17] shrink-0">{item.calories} kcal</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dinner Tile (Planned / Unlogged) */}
          <div className="rounded-2xl p-4 bg-[#f6f3eb] border border-[#e5e2da] shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-full bg-[#ebe8e0] flex items-center justify-center text-[#737970] shadow-inner shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-editorial text-[17px] font-medium text-[#1c1c17] leading-tight">Dinner</span>
                <span className="text-[12px] text-[#737970] truncate">What did you nourish yourself with?</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('scanner')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4a6549] text-white shadow-xs active:scale-95 transition-all text-[13px] font-semibold hover:bg-[#344a3a] shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Snacks Tile */}
          <div className="rounded-2xl p-4 bg-[#ffffff] shadow-sm border border-[#e5e2da]/80 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#d88e72]" />
                <span className="font-editorial text-[17px] font-semibold text-[#1c1c17]">Snacks</span>
                <span className="text-[12px] text-[#737970]">· 4:30 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold text-[#1c1c17]">
                  {snackKcal} <span className="text-[12px] text-[#737970] font-normal">{goals.energyUnit}</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigate('diary')}
                  aria-label="Edit Snacks"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#737970] hover:text-[#1c1c17] hover:bg-[#f1eee6] transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {snackItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#f6f3eb] border border-[#e5e2da]/50">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover shadow-inner shrink-0"
                      />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-medium text-[#1c1c17] truncate">{item.name}</span>
                      <span className="text-[11px] text-[#434841]">
                        {item.carbs}g Carbs · {item.protein}g Protein · {item.fat}g Fat
                      </span>
                    </div>
                  </div>
                  <span className="text-[13px] font-semibold text-[#1c1c17] shrink-0">{item.calories} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Daily Activity Summary Card */}
        <section className="rounded-2xl p-4 bg-[#ebe8e0] debossed-light flex items-center justify-around my-1 border border-[#e5e2da]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#ffffff] flex items-center justify-center text-[#4d6452] shadow-xs shrink-0">
              <Utensils className="w-4 h-4 text-[#4d6452]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-[#1c1c17] leading-tight tabular-nums">
                {loggedMealsCount} Meals
              </span>
              <span className="text-[10px] uppercase text-[#737970] font-semibold">Logged</span>
            </div>
          </div>

          <div className="w-px h-8 bg-[#c3c8bf]" />

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#ffffff] flex items-center justify-center text-[#4d6452] shadow-xs shrink-0">
              <Droplets className="w-4 h-4 text-[#4d6452]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-[#1c1c17] leading-tight tabular-nums">
                {waterLogs.length} Entries
              </span>
              <span className="text-[10px] uppercase text-[#737970] font-semibold">Water</span>
            </div>
          </div>

          <div className="w-px h-8 bg-[#c3c8bf]" />

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#ffffff] flex items-center justify-center text-[#8b4e36] shadow-xs shrink-0">
              <Flame className="w-4 h-4 text-[#8b4e36]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-[#1c1c17] leading-tight">1 Day</span>
              <span className="text-[10px] uppercase text-[#737970] font-semibold">Streak</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
