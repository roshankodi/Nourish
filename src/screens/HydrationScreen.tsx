import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  SlidersHorizontal,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Sprout,
  Coffee,
  CupSoda,
  Minus,
  Plus,
  PlusCircle,
  BarChart3,
  Sun,
  Utensils,
  Footprints,
  Moon,
  Trash2,
} from 'lucide-react';

export const HydrationScreen: React.FC = () => {
  const {
    goals,
    updateHydrationGoal,
    totalWater,
    waterLogs,
    addWaterLog,
    removeWaterLog,
    showToast,
  } = useApp();

  const [customStep, setCustomStep] = useState(100);

  const goalMl = goals.dailyHydration || 2000;
  const currentMl = totalWater;
  const pct = Math.min(100, Math.max(0, (currentMl / goalMl) * 100));
  const remaining = Math.max(0, goalMl - currentMl);

  const handleEditGoal = () => {
    const res = window.prompt('Set daily hydration goal (ml):', goalMl.toString());
    if (res) {
      const parsed = parseInt(res.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed) && parsed >= 500 && parsed <= 5000) {
        updateHydrationGoal(parsed);
      }
    }
  };

  const getLogIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('morning')) return <Moon className="w-4 h-4 text-[#536a58]" />;
    if (l.includes('lunch')) return <Utensils className="w-4 h-4 text-[#536a58]" />;
    if (l.includes('walk')) return <Footprints className="w-4 h-4 text-[#536a58]" />;
    if (l.includes('afternoon')) return <Sun className="w-4 h-4 text-[#536a58]" />;
    return <Droplets className="w-4 h-4 text-[#536a58]" />;
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-20 pb-36 px-4 max-w-lg mx-auto bg-[#fcf9f1]">
      <div className="flex flex-col w-full space-y-4 pt-1">
        {/* Header & Goal Button */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-editorial text-2xl sm:text-3xl text-[#1c1c17] tracking-tight font-medium">Hydration</h1>
              <p className="text-[13px] text-[#4d6452]">Rhythm of mineral nourishment</p>
            </div>
            <button
              type="button"
              onClick={handleEditGoal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f6f3eb] shadow-xs text-[#434841] border border-[#e5e2da] active:scale-95 transition-all hover:bg-[#ebe8e0] cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#4a6549]" />
              <span className="text-[12px] font-semibold">Goal: {goalMl.toLocaleString()} ml</span>
            </button>
          </div>

          {/* Date Navigation Strip */}
          <div className="flex items-center justify-between px-3 py-2 rounded-full bg-[#f6f3eb] debossed-light border border-[#e5e2da]">
            <button
              type="button"
              onClick={() => showToast('Previous day hydration archive')}
              aria-label="Previous day"
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#737970] hover:text-[#1c1c17] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#4a6549]" />
              <span className="text-[13px] font-semibold text-[#1c1c17]">Today, Oct 24</span>
            </div>
            <button
              type="button"
              onClick={() => showToast('Next day preview')}
              aria-label="Next day"
              className="w-8 h-8 flex items-center justify-center rounded-full text-[#737970] hover:text-[#1c1c17] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Central Tactile Measuring Carafe Vessel Card */}
        <section className="relative overflow-hidden rounded-2xl bg-[#ffffff] p-5 shadow-sm border border-[#e5e2da]/80">
          <div className="absolute -right-16 -top-16 w-52 h-52 rounded-full bg-[#cfe9d3]/40 blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-[#ccebc7]/30 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Carafe Body */}
            <div className="relative w-44 h-64 flex items-end justify-center py-2 px-3">
              <div className="absolute inset-0 rounded-b-[42px] rounded-t-[18px] bg-[#f6f3eb]/70 backdrop-blur-md shadow-[inset_0_2px_8px_rgba(255,255,255,0.9),inset_0_-3px_8px_rgba(77,100,82,0.12),0_12px_24px_-6px_rgba(48,53,47,0.08)] border border-[#e5e2da] overflow-hidden">
                {/* Measurement Gradations */}
                <div className="absolute right-3 top-6 bottom-7 w-12 flex flex-col justify-between items-end pointer-events-none z-20 text-[10px] text-[#737970]">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono">2000</span>
                    <div className="w-3 h-0.5 rounded-full bg-[#737970]/50" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono">1500</span>
                    <div className="w-2.5 h-0.5 rounded-full bg-[#737970]/50" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono">1000</span>
                    <div className="w-3 h-0.5 rounded-full bg-[#737970]/50" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono">500</span>
                    <div className="w-2.5 h-0.5 rounded-full bg-[#737970]/50" />
                  </div>
                </div>

                {/* Left Glass Highlight */}
                <div className="absolute left-2 top-4 bottom-5 w-1.5 rounded-full bg-gradient-to-b from-white/90 via-white/30 to-white/80 z-20 pointer-events-none" />

                {/* Fluid Water Column */}
                <div
                  className="absolute bottom-0 inset-x-0 rounded-b-[40px] transition-all duration-700 ease-out bg-gradient-to-t from-[#cfe9d3] via-[#b4cdb8] to-[#8ba888]/80 shadow-[inset_0_1px_10px_rgba(255,255,255,0.65),inset_0_0_18px_rgba(74,101,73,0.18)]"
                  style={{ height: `${pct}%` }}
                >
                  <div className="absolute -top-2 inset-x-0 h-4 bg-[#cfe9d3]/60 rounded-full blur-[0.5px] opacity-90" />
                  <div className="absolute -top-1.5 inset-x-2 h-2.5 bg-white/50 rounded-full blur-[1px]" />
                  <div className="absolute left-6 bottom-6 w-2 h-2 rounded-full bg-white/60 animate-ping" style={{ animationDuration: '3.2s' }} />
                  <div className="absolute right-10 bottom-14 w-1.5 h-1.5 rounded-full bg-white/70 animate-ping" style={{ animationDuration: '2.4s' }} />
                  <div className="absolute left-14 bottom-24 w-1 h-1 rounded-full bg-white/80" />
                </div>
              </div>

              {/* Specimen Badge Inside Carafe */}
              <div className="relative z-20 mb-3 flex flex-col items-center">
                <Droplets className="w-7 h-7 text-[#243d24] drop-shadow-xs" />
                <span className="text-[11px] font-bold tracking-wider text-[#243d24]">
                  {pct.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Inset Counter Cavity */}
            <div className="w-full mt-4 p-3.5 rounded-2xl bg-[#f6f3eb] debossed-well flex flex-col items-center text-center">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl text-[#1c1c17] tracking-tight font-semibold tabular-nums">
                  {currentMl.toLocaleString()}
                </span>
                <span className="font-editorial text-xl italic text-[#4d6452]">ml</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${remaining === 0 ? 'bg-[#4a6549]' : 'bg-[#8ba888]'}`} />
                <span className="text-[13px] text-[#434841] font-medium">
                  {remaining === 0
                    ? 'Daily goal achieved! Nourishment complete.'
                    : `${remaining.toLocaleString()} ml remaining to daily goal`}
                </span>
              </div>
            </div>

            {/* Mindful status note */}
            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f1eee6] text-[#536a58] text-center border border-[#e5e2da]/60">
              <Sprout className="w-4 h-4 text-[#4a6549]" />
              <span className="text-[13px] font-medium">
                {pct >= 100
                  ? 'Abundantly hydrated · Fluid harmony achieved'
                  : pct >= 50
                  ? 'Well hydrated · On track for afternoon'
                  : 'Gentle hydration pacing throughout morning'}
              </span>
            </div>
          </div>
        </section>

        {/* Tactile Quick-Log Buttons & Custom Stepper */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium">Tactile Quick Log</h2>
            <span className="text-[11px] text-[#4d6452] font-semibold">Single tap pour</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { amount: 150, label: 'Small cup / espresso', icon: <Coffee className="w-4 h-4" /> },
              { amount: 250, label: 'Standard glass', icon: <Droplets className="w-4 h-4" /> },
              { amount: 350, label: 'Ceramic mug', icon: <Coffee className="w-4 h-4" /> },
              { amount: 500, label: 'Tumbler / carafe', icon: <CupSoda className="w-4 h-4" /> },
            ].map((btn) => (
              <button
                key={btn.amount}
                type="button"
                onClick={() => addWaterLog(btn.amount, btn.label)}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#ffffff] shadow-xs border border-[#e5e2da] active:scale-95 transition-all text-left group hover:bg-[#f6f3eb] cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="text-[16px] font-semibold text-[#1c1c17] tabular-nums">
                    +{btn.amount} <span className="font-editorial text-[12px] text-[#4d6452] italic">ml</span>
                  </span>
                  <span className="text-[11px] text-[#737970]">{btn.label}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#f1eee6] flex items-center justify-center text-[#4a6549] group-hover:bg-[#cfe9d3] transition-colors">
                  {btn.icon}
                </div>
              </button>
            ))}
          </div>

          {/* Custom Stepper */}
          <div className="p-3 rounded-2xl bg-[#f6f3eb] flex items-center justify-between gap-3 debossed-light border border-[#e5e2da]">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCustomStep((p) => Math.max(50, p - 50))}
                className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#1c1c17] active:scale-95 transition-transform cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="px-3 py-1 rounded-lg bg-white shadow-inner flex items-center gap-1">
                <span className="text-[15px] font-semibold text-[#1c1c17] tabular-nums">{customStep}</span>
                <span className="font-editorial text-[12px] text-[#4d6452] italic">ml</span>
              </div>
              <button
                type="button"
                onClick={() => setCustomStep((p) => Math.min(1000, p + 50))}
                className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#1c1c17] active:scale-95 transition-transform cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => addWaterLog(customStep, 'Custom pour')}
              className="flex-1 py-2 px-3 rounded-full bg-[#4a6549] hover:bg-[#344a3a] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Custom</span>
            </button>
          </div>
        </section>

        {/* 7-Day Consistency Rhythm */}
        <section className="p-4 rounded-2xl bg-[#ffffff] shadow-xs border border-[#e5e2da] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#4a6549]" />
              <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium">Weekly Rhythm</h2>
            </div>
            <span className="text-[11px] font-semibold text-[#536a58] bg-[#cfe9d3] px-2.5 py-0.5 rounded-full">
              Target 2.0L
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 pt-2 items-end h-28">
            {[
              { day: 'M', vol: '2.0L', height: 100, active: true },
              { day: 'T', vol: '2.2L', height: 100, active: true },
              { day: 'W', vol: `${(totalWater / 1000).toFixed(1)}L`, height: Math.min(100, pct), active: true, today: true },
              { day: 'T', vol: '-', height: 0, active: false },
              { day: 'F', vol: '-', height: 0, active: false },
              { day: 'S', vol: '-', height: 0, active: false },
              { day: 'S', vol: '-', height: 0, active: false },
            ].map((d, i) => (
              <div key={i} className={`flex flex-col items-center gap-1.5 h-full justify-end ${!d.active ? 'opacity-40' : ''}`}>
                <span className={`text-[10px] ${d.today ? 'text-[#4a6549] font-bold' : 'text-[#737970]'}`}>{d.vol}</span>
                <div className="w-full bg-[#f1eee6] rounded-full h-16 flex items-end p-0.5">
                  <div
                    className={`w-full rounded-full transition-all duration-500 ${
                      d.today ? 'bg-[#8ba888]' : d.active ? 'bg-[#4a6549]' : 'bg-transparent'
                    }`}
                    style={{ height: `${d.height}%` }}
                  />
                </div>
                <span className={`text-[12px] ${d.today ? 'font-bold text-[#1c1c17]' : 'text-[#737970]'}`}>{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Today's Intake Chronological Stream */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium">Today's Intake</h2>
            <span className="text-[12px] text-[#737970]">{waterLogs.length} logs recorded</span>
          </div>

          <div className="space-y-2">
            {waterLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#ffffff] shadow-xs border border-[#e5e2da]/70 transition-all hover:bg-[#f6f3eb]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#cfe9d3] flex items-center justify-center text-[#536a58] shrink-0">
                    {getLogIcon(log.label)}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[14px] font-semibold text-[#1c1c17]">{log.ml} ml</span>
                      <span className="text-[12px] text-[#4d6452]">{log.label}</span>
                    </div>
                    <span className="text-[11px] text-[#737970]">{log.time}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeWaterLog(log.id)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-[#737970] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors cursor-pointer"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Editorial Visual Pairing Note */}
        <div className="relative overflow-hidden rounded-2xl bg-[#f6f3eb] p-4 flex items-center gap-3.5 shadow-xs border border-[#e5e2da]">
          <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-[#e5e2da] shadow-inner">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC_IQ64tDVivJtyy5I1dc0SCa3lolxFzSVdQUFhFVSrfoE52W5sia4ej1BB3wkUEeyHzldWPYf-WfecqEDTMhOZkRJHEe5MoSdA9MuoQ7bK3pY2014ZMzXCotcY1Glysm-LjQONg8CLL7j9FZprho2Aqh30v-BzgZNIhumjic0s2oP4TavB-ARe_0eM_kzOsPGEJKvzDKvrfW2GEh3nolQwIQDXTYmJaiaLXYLNAiLkrgfyDhCR7Pn"
              alt="Water carafe with mint and lemon"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-[#8b4e36] uppercase tracking-wider font-semibold">Mindful Practice</span>
            <p className="text-[13px] text-[#434841] mt-0.5 leading-snug">
              Hydration needs vary with climate and activity level. Drink intentionally before thirst speaks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
