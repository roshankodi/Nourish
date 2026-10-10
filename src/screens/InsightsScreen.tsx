import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DayInsight } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Droplets,
  BookOpen,
  Zap,
  Utensils,
  Star,
  TrendingUp,
  Dumbbell,
  Clock,
  Share2,
  ShieldCheck,
} from 'lucide-react';

export const InsightsScreen: React.FC = () => {
  const { weeklyInsights, selectedDayInsight, setSelectedDayInsight, showToast } = useApp();
  const [showExportModal, setShowExportModal] = useState(false);

  const handleDaySelect = (day: DayInsight) => {
    setSelectedDayInsight(day);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-20 pb-36 px-4 max-w-lg mx-auto bg-[#fcf9f1]">
      <div className="flex flex-col w-full gap-4 pt-1">
        {/* Header Section with Date Range Pill */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#4d6452] font-semibold">
              Weekly Synthesis
            </span>
            <div className="flex items-center gap-1 bg-[#ebe8e0] px-2.5 py-1 rounded-full shadow-inner text-[#434841] border border-[#e5e2da]">
              <button
                type="button"
                onClick={() => showToast('Previous week: Oct 11 – Oct 17')}
                aria-label="Previous week"
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white active:scale-90 transition-transform cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-semibold text-[#1c1c17] px-1">Oct 18 – Oct 24</span>
              <button
                type="button"
                onClick={() => showToast('Viewing current week')}
                aria-label="Next week"
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white active:scale-90 transition-transform cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl text-[#1c1c17] tracking-tight font-medium leading-tight">
            Your Week in Review
          </h1>
          <p className="text-[13px] text-[#434841] italic">Consistent habits compound into wellness.</p>
        </div>

        {/* Hero Editorial Specimen */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-[#ffffff] shadow-sm p-4 flex items-center gap-3.5 border border-[#e5e2da]/80">
          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-inner bg-[#f1eee6]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmMrw3mnWnwzw-6t6-U8AvY5B1diRQquNFKybPza_voKsQLMGTOQdIg0JPNTlVEDBZKYfok3s1zPMlQKR3U9Rm1ECq-qf-53OFV3-HkfxjtQ0mxQUVw0hZihT7AGyfHrpiNnYbeiPiqfEY5cKCy4xyYxQf4KPdXbhBx_aUDQaOqwoIbAmRHXY1gE0D2HtQq2HlzqyGkjxbVqb1iXmIqPTbLSUznfyZo2LZpp9bdhG0OAsXA1GjBOb5"
              alt="Artisanal roasted figs and wild greens bowl"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <span className="text-[10px] uppercase tracking-wider text-[#8b4e36] font-semibold">
              Weekly Mindful Index
            </span>
            <p className="font-editorial text-[18px] text-[#1c1c17] leading-tight font-medium mt-0.5">
              92% Nourishment Harmony
            </p>
            <p className="text-[12px] text-[#434841] truncate mt-0.5">
              6 whole-food rich days with steady circadian intervals.
            </p>
          </div>
        </div>

        {/* 2x2 Tactile Ceramic Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Tile 1: Calories */}
          <div className="bg-[#f6f3eb] rounded-2xl p-3.5 shadow-sm border border-[#e5e2da]/70 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#4d6452]">
              <Flame className="w-5 h-5 text-[#4d6452]" />
              <span className="text-[11px] font-semibold bg-[#f1eee6] px-2 py-0.5 rounded-full text-[#434841]">
                Daily Avg
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold text-[#1c1c17] leading-none tabular-nums">
                1,890 <span className="text-[12px] text-[#737970] font-normal">kcal</span>
              </div>
              <p className="text-[11px] text-[#434841] mt-1">
                Goal: 2,000 · <strong className="text-[#4a6549]">-110 kcal</strong>
              </p>
            </div>
          </div>

          {/* Tile 2: Hydration */}
          <div className="bg-[#f6f3eb] rounded-2xl p-3.5 shadow-sm border border-[#e5e2da]/70 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#4d6452]">
              <Droplets className="w-5 h-5 text-[#4d6452]" />
              <span className="text-[11px] font-semibold bg-[#cfe9d3] text-[#536a58] px-2 py-0.5 rounded-full">
                +100 ml
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold text-[#1c1c17] leading-none tabular-nums">
                2,100 <span className="text-[12px] text-[#737970] font-normal">ml</span>
              </div>
              <p className="text-[11px] text-[#434841] mt-1">
                Goal: 2,000 · <strong className="text-[#4a6549]">Above goal</strong>
              </p>
            </div>
          </div>

          {/* Tile 3: Food Logging */}
          <div className="bg-[#f6f3eb] rounded-2xl p-3.5 shadow-sm border border-[#e5e2da]/70 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#4d6452]">
              <BookOpen className="w-5 h-5 text-[#4d6452]" />
              <span className="w-2 h-2 rounded-full bg-[#4a6549]" />
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold text-[#1c1c17] leading-none tabular-nums">
                6 <span className="text-[12px] text-[#737970] font-normal">of 7 days</span>
              </div>
              <p className="text-[11px] text-[#434841] mt-1">86% weekly consistency</p>
            </div>
          </div>

          {/* Tile 4: Streak */}
          <div className="bg-[#f6f3eb] rounded-2xl p-3.5 shadow-sm border border-[#e5e2da]/70 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8b4e36]">
              <Zap className="w-5 h-5 text-[#8b4e36]" />
              <span className="text-[11px] font-semibold bg-[#ffdbce] text-[#370e00] px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold text-[#1c1c17] leading-none tabular-nums">
                5 <span className="text-[12px] text-[#737970] font-normal">days</span>
              </div>
              <p className="text-[11px] text-[#434841] mt-1">Keep the rhythm alive</p>
            </div>
          </div>
        </div>

        {/* Calorie Rhythm Chart Card */}
        <div className="bg-[#ffffff] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium leading-tight">Calorie Rhythm</h2>
              <p className="text-[12px] text-[#737970]">Daily energy intake vs. 2,000 kcal target</p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#737970] font-medium">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8ba888]" /> Within
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d88e72]" /> Flex
              </div>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="relative w-full pt-4 pb-1">
            <div className="absolute left-0 right-0 top-[38%] flex items-center z-10 pointer-events-none">
              <div className="w-full border-t border-dashed border-[#c3c8bf]" />
              <span className="absolute right-0 -top-3.5 text-[10px] text-[#737970] bg-white px-1 font-mono">
                Goal 2,000
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 items-end h-40 relative z-20">
              {weeklyInsights.map((day) => {
                const isSelected = selectedDayInsight.day === day.day;
                const isFlex = day.calories > 2000;
                const heightPercent = Math.min(100, (day.calories / 2500) * 100);

                return (
                  <button
                    key={day.day}
                    type="button"
                    onClick={() => handleDaySelect(day)}
                    className="group flex flex-col items-center h-full justify-end focus:outline-none cursor-pointer"
                  >
                    <div
                      className={`w-full max-w-[28px] transition-all rounded-full relative flex items-start justify-center pt-1 shadow-xs ${
                        day.isToday
                          ? 'bg-[#cfe9d3] group-hover:bg-[#b4cdb8]'
                          : isFlex
                          ? 'bg-[#d88e72] group-hover:bg-[#8b4e36]'
                          : 'bg-[#8ba888] group-hover:bg-[#4a6549]'
                      } ${isSelected ? 'ring-2 ring-[#1c1c17]' : ''}`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      {day.isToday && (
                        <span className="w-2 h-2 rounded-full bg-[#4a6549] absolute -top-1" />
                      )}
                      <span className="text-[9px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {(day.calories / 1000).toFixed(1)}k
                      </span>
                    </div>
                    <span
                      className={`text-[11px] mt-2 font-medium ${
                        day.isToday ? 'text-[#4a6549] font-bold' : isSelected ? 'text-[#1c1c17] font-bold' : 'text-[#737970]'
                      }`}
                    >
                      {day.shortDay}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Tap Detail Tray */}
          <div className="bg-[#f6f3eb] rounded-xl p-3 flex items-center justify-between debossed-light border border-[#e5e2da]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#4a6549] shadow-xs">
                <Utensils className="w-4 h-4 text-[#4a6549]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-[#1c1c17]">{selectedDayInsight.day}</span>
                  <span className="text-[11px] text-[#434841] font-mono">
                    {selectedDayInsight.calories.toLocaleString()} kcal
                  </span>
                </div>
                <p className="text-[11px] text-[#737970] leading-tight">
                  {selectedDayInsight.notes} ({selectedDayInsight.breakdown})
                </p>
              </div>
            </div>
            <span className="text-[10px] text-[#4d6452] bg-[#cfe9d3] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
              Tap bars
            </span>
          </div>
        </div>

        {/* Weekly Hydration Flow */}
        <div className="bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/70 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium">Hydration Flow</h2>
              <p className="text-[12px] text-[#737970]">Daily volume with 2,000 ml milestones</p>
            </div>
            <div className="flex items-center gap-1 text-[#4a6549] text-[11px] font-semibold bg-[#cfe9d3] px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-[#4a6549] text-[#4a6549]" />
              <span>5 Milestones</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 items-end pt-1">
            {[
              { day: 'Mon', vol: 2150, met: true },
              { day: 'Tue', vol: 2300, met: true },
              { day: 'Wed', vol: 1850, met: false },
              { day: 'Thu', vol: 2050, met: true },
              { day: 'Fri', vol: 2400, met: true },
              { day: 'Sat', vol: 2100, met: true },
              { day: 'Sun', vol: 1800, met: false, today: true },
            ].map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                {d.met ? (
                  <Star className="w-3.5 h-3.5 fill-[#4a6549] text-[#4a6549]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c3c8bf] my-[3.5px]" />
                )}
                <div className="w-full h-20 bg-[#f1eee6] rounded-lg p-0.5 flex flex-col justify-end">
                  <div
                    className={`w-full rounded-[6px] transition-all ${
                      d.met ? 'bg-[#4d6452]' : 'bg-[#b0cfad]'
                    }`}
                    style={{ height: `${Math.min(100, (d.vol / 2500) * 100)}%` }}
                  />
                </div>
                <span className={`text-[11px] ${d.today ? 'font-bold text-[#4a6549]' : 'text-[#737970]'}`}>{d.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[#434841] text-[12px] bg-[#f1eee6] px-3 py-2 rounded-xl">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#4d6452]" />
              Peak intake window: 2:15 PM – 4:30 PM
            </span>
            <span className="font-mono text-[11px] font-semibold text-[#1c1c17]">Avg 2.1L</span>
          </div>
        </div>

        {/* Patterns Worth Noticing */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium">Patterns Worth Noticing</h2>
            <span className="text-[12px] text-[#8b4e36] font-semibold">3 insights</span>
          </div>

          {/* Card 1 */}
          <div className="bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/70 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#cfe9d3] text-[#536a58] flex items-center justify-center shrink-0 mt-0.5">
              <Droplets className="w-5 h-5 text-[#536a58]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-[#4a6549] uppercase font-semibold">Consistent Hydration</span>
              <h3 className="font-editorial text-[16px] text-[#1c1c17] font-medium mt-0.5 leading-snug">
                Afternoon Habit Flourishing
              </h3>
              <p className="text-[13px] text-[#434841] mt-1 leading-snug">
                You met your water intake target 5 days this week. Afternoon hydration between 2–4 PM was your strongest ritual.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/70 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#ccebc7] text-[#07200b] flex items-center justify-center shrink-0 mt-0.5">
              <Dumbbell className="w-5 h-5 text-[#07200b]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-[#4d6452] uppercase font-semibold">Macronutrient Harmony</span>
              <h3 className="font-editorial text-[16px] text-[#1c1c17] font-medium mt-0.5 leading-snug">
                Balanced Protein Intake
              </h3>
              <p className="text-[13px] text-[#434841] mt-1 leading-snug">
                Your average daily protein was 98g, remaining exceptionally steady across weekdays to support energy resilience.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/70 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#ffdbce] text-[#370e00] flex items-center justify-center shrink-0 mt-0.5">
              <Clock className="w-5 h-5 text-[#370e00]" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-[#8b4e36] uppercase font-semibold">Circadian Rhythm</span>
              <h3 className="font-editorial text-[16px] text-[#1c1c17] font-medium mt-0.5 leading-snug">
                Weekend Meal Shift
              </h3>
              <p className="text-[13px] text-[#434841] mt-1 leading-snug">
                Calorie intake on weekends shifted 2 hours later into the day, reflecting a relaxed social digestive pattern.
              </p>
            </div>
          </div>
        </div>

        {/* Specimen Highlights */}
        <div className="bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/70 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-editorial text-[18px] text-[#1c1c17] font-medium">Specimen Highlights</span>
            <span className="text-[11px] text-[#737970] font-medium">Culinary Diary</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="relative rounded-xl overflow-hidden h-28 bg-[#ebe8e0]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4sXiChb3-GMFUyfb2Ojz4ISXNyUFaCq6CbKXPvAwjqhHFD6tEbnjsCW3gTK7KivjejASO8muu695M1GsIdL4dgFL4mGYKnl2tyrMM-1bwggxJbD8ccOnSlUafy9gC20D8li4zgdZ3Hv8YICJOjNSFEdGhQxwEaGdM1zR8wC2znOcKdJU-PWZ2IWdlJm0U99A3npCn11n-psuax8pOhv7s3Rb3Qa7cqK85rtlfF-0GXZ7VYnbvVJXR"
                alt="Thu Breakfast Avocado toast"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1.5 left-1.5 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#1c1c17]">
                Thu Breakfast · 440 kcal
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden h-28 bg-[#ebe8e0]">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzoBTbgJHVviNLhr5zgyoempUp7pnejUjKFk55AjUGhMdR0CbZJVF1GKb5ybhR03A4x3T4I83iRXJ0BMfjk6UoyCpZWEMhFHkwiuqTtB9HsfCwKt8LbQUieABXZX5OFFBkjXK9UfD4yaQIB7TjRnneBuyJA-lw06J7OVc4Slkimhe4OuVm5PeVFt3JX_-stU1KJwpE6ITQbGdG8D0xGJl16KB1VsScC8OBGwNZoB3P7z4iD0jCf9-Y"
                alt="Sat Ritual Matcha & apples"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1.5 left-1.5 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#1c1c17]">
                Sat Ritual · 210 kcal
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Export Report */}
        <div className="pt-1 pb-2">
          <button
            type="button"
            onClick={handleExport}
            className="w-full h-14 bg-[#243d24] hover:bg-[#344a3a] text-white rounded-full shadow-md flex items-center justify-center gap-2 active:scale-[0.98] transition-transform text-[15px] font-medium cursor-pointer"
          >
            <Share2 className="w-5 h-5 text-white" />
            <span>Export Weekly Wellness Report</span>
          </button>
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#fcf9f1] rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-[#e5e2da]">
              <div className="flex items-center gap-2.5 mb-2">
                <ShieldCheck className="w-6 h-6 text-[#4a6549]" />
                <h3 className="font-editorial text-xl text-[#1c1c17] font-semibold">Weekly Report Prepared</h3>
              </div>
              <p className="text-[13px] text-[#434841] mb-4 leading-relaxed">
                Your 7-day nourishment digest is synthesized into a clean, unbranded medical/wellness dossier.
              </p>
              <div className="p-3 bg-[#f1eee6] rounded-xl text-[12px] space-y-1 mb-4">
                <div className="flex justify-between">
                  <span className="text-[#737970]">Period:</span>
                  <span className="font-semibold">Oct 18 – Oct 24, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737970]">Avg Intake:</span>
                  <span className="font-semibold">1,890 kcal / day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737970]">Hydration:</span>
                  <span className="font-semibold">2,100 ml / day (105% target)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#737970]">Consistency:</span>
                  <span className="font-semibold">86% Logged</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 py-2.5 rounded-full bg-[#f1eee6] text-[#434841] text-[13px] font-medium hover:bg-[#ebe8e0] cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExportModal(false);
                    showToast('Report downloaded to device');
                  }}
                  className="flex-1 py-2.5 rounded-full bg-[#4a6549] text-white text-[13px] font-semibold shadow-xs hover:bg-[#344a3a] cursor-pointer"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
