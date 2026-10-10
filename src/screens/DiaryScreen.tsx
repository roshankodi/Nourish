import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MealCategory } from '../types';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sprout,
  CheckCircle2,
  Sunrise,
  Sun,
  Moon,
  Leaf,
  Pencil,
  Trash2,
  Plus,
  Soup,
  Camera,
  SlidersHorizontal,
} from 'lucide-react';

export const DiaryScreen: React.FC = () => {
  const {
    goals,
    meals,
    removeFoodItem,
    addFoodItem,
    totalCalories,
    totalCarbs,
    totalProtein,
    totalFat,
    navigate,
    showToast,
  } = useApp();

  const [dateIndex, setDateIndex] = useState(1);
  const [showAddModal, setShowAddModal] = useState<MealCategory | null>(null);
  const [newMealName, setNewMealName] = useState('');
  const [newMealCal, setNewMealCal] = useState('');

  const dates = ['Tuesday, Oct 23', 'Wednesday, Oct 24', 'Thursday, Oct 25'];

  const remainingKcal = Math.max(0, goals.dailyCalories - totalCalories);
  const percentComplete = Math.min(100, Math.round((totalCalories / goals.dailyCalories) * 100));

  const breakfastItems = meals.filter((m) => m.mealType === 'breakfast');
  const lunchItems = meals.filter((m) => m.mealType === 'lunch');
  const dinnerItems = meals.filter((m) => m.mealType === 'dinner');
  const snackItems = meals.filter((m) => m.mealType === 'snack');

  const breakfastKcal = breakfastItems.reduce((s, i) => s + i.calories, 0);
  const lunchKcal = lunchItems.reduce((s, i) => s + i.calories, 0);
  const dinnerKcal = dinnerItems.reduce((s, i) => s + i.calories, 0);
  const snackKcal = snackItems.reduce((s, i) => s + i.calories, 0);

  const handleQuickAdd = (category: MealCategory) => {
    if (!newMealName.trim()) return;
    const calories = parseInt(newMealCal || '200', 10);
    addFoodItem({
      name: newMealName.trim(),
      subtitle: 'Manual log',
      mealType: category,
      calories: isNaN(calories) ? 200 : calories,
      carbs: Math.round(calories * 0.12),
      protein: Math.round(calories * 0.05),
      fat: Math.round(calories * 0.03),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setNewMealName('');
    setNewMealCal('');
    setShowAddModal(null);
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-20 pb-36 px-4 max-w-lg mx-auto bg-[#fcf9f1]">
      <div className="flex flex-col w-full pb-6 space-y-4 pt-1">
        {/* Title & Date Section */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-editorial text-2xl sm:text-3xl text-[#1c1c17] tracking-tight font-medium">Food Diary</h1>
              <p className="text-[13px] text-[#434841]">Mindful daily nourishment log</p>
            </div>
            <button
              type="button"
              onClick={() => showToast('Calendar: Oct 24 Selected')}
              aria-label="Open Calendar"
              className="w-10 h-10 rounded-full bg-[#f6f3eb] shadow-xs border border-[#e5e2da] text-[#4d6452] flex items-center justify-center active:scale-95 transition-transform hover:bg-[#ebe8e0] cursor-pointer"
            >
              <Calendar className="w-5 h-5" />
            </button>
          </div>

          {/* Date Dial */}
          <div className="flex items-center justify-between bg-[#f6f3eb] p-1.5 rounded-full shadow-inner border border-[#e5e2da]">
            <button
              type="button"
              onClick={() => setDateIndex((prev) => Math.max(0, prev - 1))}
              aria-label="Previous day"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#434841] hover:text-[#1c1c17] active:scale-90 transition-transform cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 px-2">
              <Sprout className="w-4 h-4 text-[#4a6549]" />
              <span className="text-[14px] font-semibold text-[#1c1c17]">{dates[dateIndex]}</span>
            </div>
            <button
              type="button"
              onClick={() => setDateIndex((prev) => Math.min(dates.length - 1, prev + 1))}
              aria-label="Next day"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#434841] hover:text-[#1c1c17] active:scale-90 transition-transform cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calorie Gauge Inset Well */}
        <div className="bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/70 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d88e72]" />
              <span className="text-[11px] uppercase tracking-wider text-[#434841] font-semibold">Daily Calorie Target</span>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#cfe9d3] text-[#536a58] font-semibold">
              {remainingKcal.toLocaleString()} {goals.energyUnit} left
            </span>
          </div>

          <div className="bg-[#f1eee6] rounded-xl p-3 debossed-well flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-[#1c1c17] tracking-tight tabular-nums">
                {totalCalories.toLocaleString()}
              </span>
              <span className="text-[13px] text-[#737970]">/ {goals.dailyCalories.toLocaleString()} {goals.energyUnit}</span>
            </div>
            <div className="flex items-center gap-1 text-[#4a6549]">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[12px] font-bold">{percentComplete}%</span>
            </div>
          </div>

          {/* Macro Ratio Split Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-[11px] text-[#737970]">
              <span className="text-[#1c1c17] font-semibold">Macronutrient Split</span>
              <span>Optimal balance</span>
            </div>
            <div className="h-3 w-full rounded-full bg-[#f1eee6] flex overflow-hidden p-0.5 shadow-inner">
              <div className="h-full bg-[#4a6549] rounded-l-full transition-all duration-500" style={{ width: '22%' }} />
              <div className="h-full bg-[#8ba888] mx-0.5 transition-all duration-500" style={{ width: '50%' }} />
              <div className="h-full bg-[#d88e72] rounded-r-full transition-all duration-500" style={{ width: '28%' }} />
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-[#737970]">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#4a6549] inline-block" />
                <span>Protein 22% <strong className="text-[#1c1c17]">({totalProtein}g)</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#8ba888] inline-block" />
                <span>Carbs 50% <strong className="text-[#1c1c17]">({totalCarbs}g)</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#d88e72] inline-block" />
                <span>Fat 28% <strong className="text-[#1c1c17]">({totalFat}g)</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Header for Meals */}
        <div className="flex items-center justify-between px-1 pt-1">
          <span className="text-[12px] uppercase text-[#737970] tracking-wider font-semibold">Daily Intake</span>
          <button
            type="button"
            onClick={() => navigate('scanner')}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#cfe9d3] text-[#243d24] text-[12px] font-semibold hover:bg-[#b0cfad] transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>AI Food Lens</span>
          </button>
        </div>

        {/* Meal Sections Container */}
        <div className="space-y-4">
          {/* Breakfast */}
          <section className="bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/70 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#cfe9d3] text-[#536a58] flex items-center justify-center">
                  <Sunrise className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium leading-tight">Breakfast</h2>
                  <span className="text-[11px] text-[#737970]">Morning ritual · 8:15 AM</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-[#4a6549] leading-none tabular-nums">{breakfastKcal}</span>
                <span className="text-[11px] text-[#737970] block">{goals.energyUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              {breakfastItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#f1eee6] rounded-xl p-2.5 flex items-center justify-between border border-[#e5e2da]/50 hover:bg-[#ebe8e0] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-xs" />
                    )}
                    <div className="min-w-0">
                      <h3 className="text-[13px] font-semibold text-[#1c1c17] truncate">{item.name}</h3>
                      <p className="text-[12px] text-[#737970]">{item.subtitle || `${item.calories} kcal`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => showToast(`Edit item: ${item.name}`)}
                      aria-label="Edit Item"
                      className="w-8 h-8 rounded-full text-[#737970] hover:text-[#1c1c17] hover:bg-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFoodItem(item.id)}
                      aria-label="Remove Item"
                      className="w-8 h-8 rounded-full text-[#737970] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal('breakfast')}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#f1eee6] text-[#4d6452] text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-xs border border-[#e5e2da] active:scale-[0.99] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Breakfast</span>
            </button>
          </section>

          {/* Lunch */}
          <section className="bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/70 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#cfe9d3] text-[#536a58] flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium leading-tight">Lunch</h2>
                  <span className="text-[11px] text-[#737970]">Midday recharge · 1:20 PM</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-[#4a6549] leading-none tabular-nums">{lunchKcal}</span>
                <span className="text-[11px] text-[#737970] block">{goals.energyUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              {lunchItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#f1eee6] rounded-xl p-2.5 flex items-center justify-between border border-[#e5e2da]/50 hover:bg-[#ebe8e0] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-xs" />
                    )}
                    <div className="min-w-0">
                      <h3 className="text-[13px] font-semibold text-[#1c1c17] truncate">{item.name}</h3>
                      <p className="text-[12px] text-[#737970]">{item.subtitle || `${item.calories} kcal`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => showToast(`Edit item: ${item.name}`)}
                      aria-label="Edit Item"
                      className="w-8 h-8 rounded-full text-[#737970] hover:text-[#1c1c17] hover:bg-white flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFoodItem(item.id)}
                      aria-label="Remove Item"
                      className="w-8 h-8 rounded-full text-[#737970] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal('lunch')}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#f1eee6] text-[#4d6452] text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-xs border border-[#e5e2da] active:scale-[0.99] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Lunch</span>
            </button>
          </section>

          {/* Dinner */}
          <section className="bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/70 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#e5e2da] text-[#434841] flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium leading-tight">Dinner</h2>
                  <span className="text-[11px] text-[#737970]">Evening · {dinnerItems.length > 0 ? 'Logged' : 'Unlogged'}</span>
                </div>
              </div>
              {dinnerItems.length > 0 ? (
                <div className="text-right">
                  <span className="text-xl font-bold text-[#4a6549] leading-none tabular-nums">{dinnerKcal}</span>
                  <span className="text-[11px] text-[#737970] block">{goals.energyUnit}</span>
                </div>
              ) : (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#ebe8e0] text-[#737970]">
                  Planned
                </span>
              )}
            </div>

            {dinnerItems.length > 0 ? (
              <div className="space-y-2">
                {dinnerItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#f1eee6] rounded-xl p-2.5 flex items-center justify-between border border-[#e5e2da]/50 hover:bg-[#ebe8e0] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-xs" />
                      )}
                      <div className="min-w-0">
                        <h3 className="text-[13px] font-semibold text-[#1c1c17] truncate">{item.name}</h3>
                        <p className="text-[12px] text-[#737970]">{item.subtitle || `${item.calories} kcal`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => removeFoodItem(item.id)}
                        aria-label="Remove Item"
                        className="w-8 h-8 rounded-full text-[#737970] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setShowAddModal('dinner')}
                  className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#f1eee6] text-[#4d6452] text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-xs border border-[#e5e2da] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Dinner</span>
                </button>
              </div>
            ) : (
              <div className="bg-[#f1eee6] rounded-xl p-5 flex flex-col items-center text-center space-y-3 debossed-light border border-[#e5e2da]/50">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#4a6549] shadow-xs">
                  <Soup className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <h3 className="font-editorial text-[17px] text-[#1c1c17] font-medium">Dinner not logged yet</h3>
                  <p className="text-[12px] text-[#434841]">
                    Log your dinner or snap a quick photo to complete today's nourishment diary.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowAddModal('dinner')}
                    className="flex-1 sm:flex-none py-2.5 px-5 rounded-full bg-[#4a6549] hover:bg-[#344a3a] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Log Dinner</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('scanner')}
                    aria-label="Snap dinner photo"
                    className="p-2.5 rounded-full bg-white text-[#4a6549] shadow-xs hover:bg-[#fcf9f1] active:scale-90 transition-transform border border-[#e5e2da] cursor-pointer"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Snacks & Bites */}
          <section className="bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/70 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#cfe9d3] text-[#536a58] flex items-center justify-center">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium leading-tight">Snacks &amp; Bites</h2>
                  <span className="text-[11px] text-[#737970]">Afternoon delight · 4:45 PM</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-[#4a6549] leading-none tabular-nums">{snackKcal}</span>
                <span className="text-[11px] text-[#737970] block">{goals.energyUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              {snackItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#f1eee6] rounded-xl p-2.5 flex items-center justify-between border border-[#e5e2da]/50 hover:bg-[#ebe8e0] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-xs" />
                    )}
                    <div className="min-w-0">
                      <h3 className="text-[13px] font-semibold text-[#1c1c17] truncate">{item.name}</h3>
                      <p className="text-[12px] text-[#737970]">{item.subtitle || `${item.calories} kcal`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => removeFoodItem(item.id)}
                      aria-label="Remove Item"
                      className="w-8 h-8 rounded-full text-[#737970] hover:text-[#ba1a1a] hover:bg-[#ffdad6]/40 flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal('snack')}
              className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#f1eee6] text-[#4d6452] text-[13px] font-semibold flex items-center justify-center gap-1.5 shadow-xs border border-[#e5e2da] active:scale-[0.99] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Snacks</span>
            </button>
          </section>
        </div>

        {/* Daily Micronutrients & Totals */}
        <div className="bg-[#f6f3eb] rounded-2xl p-4 shadow-sm border border-[#e5e2da]/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#4d6452]" />
              <h3 className="font-editorial text-[17px] text-[#1c1c17] font-medium">Daily Micronutrients &amp; Totals</h3>
            </div>
            <span className="text-[11px] text-[#737970] font-semibold">Summary</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#f1eee6] rounded-xl p-3 debossed-light flex flex-col">
              <span className="text-[10px] uppercase text-[#737970] font-semibold">Total Energy</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-[#1c1c17] tabular-nums">{totalCalories.toLocaleString()}</span>
                <span className="text-[12px] text-[#737970]">kcal</span>
              </div>
              <span className="text-[11px] text-[#4d6452] mt-0.5">Target: {goals.dailyCalories.toLocaleString()}</span>
            </div>

            <div className="bg-[#f1eee6] rounded-xl p-3 debossed-light flex flex-col">
              <span className="text-[10px] uppercase text-[#737970] font-semibold">Net Carbs</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-[#1c1c17] tabular-nums">{totalCarbs}</span>
                <span className="text-[12px] text-[#737970]">g</span>
              </div>
              <span className="text-[11px] text-[#737970] mt-0.5">Total: {totalCarbs + 24}g - Fiber</span>
            </div>

            <div className="bg-[#f1eee6] rounded-xl p-3 debossed-light flex flex-col">
              <span className="text-[10px] uppercase text-[#737970] font-semibold">Dietary Fiber</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-[#4a6549] tabular-nums">24</span>
                <span className="text-[12px] text-[#737970]">g</span>
              </div>
              <span className="text-[11px] text-[#4a6549] mt-0.5">86% of daily goal</span>
            </div>

            <div className="bg-[#f1eee6] rounded-xl p-3 debossed-light flex flex-col">
              <span className="text-[10px] uppercase text-[#737970] font-semibold">Sodium</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold text-[#1c1c17] tabular-nums">1,420</span>
                <span className="text-[12px] text-[#737970]">mg</span>
              </div>
              <span className="text-[11px] text-[#737970] mt-0.5">Safe intake &lt; 2,300</span>
            </div>
          </div>
        </div>

        {/* Modal for manual entry */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#fcf9f1] rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-[#e5e2da]">
              <h3 className="font-editorial text-lg text-[#1c1c17] font-semibold mb-1 capitalize">
                Add to {showAddModal}
              </h3>
              <p className="text-[12px] text-[#737970] mb-4">Enter meal name and estimated calories.</p>
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#737970] font-semibold block mb-1">
                    Meal Name
                  </label>
                  <input
                    type="text"
                    value={newMealName}
                    onChange={(e) => setNewMealName(e.target.value)}
                    placeholder="e.g. Steamed edamame & green tea"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e2da] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4a6549]"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-[#737970] font-semibold block mb-1">
                    Calories (kcal)
                  </label>
                  <input
                    type="number"
                    value={newMealCal}
                    onChange={(e) => setNewMealCal(e.target.value)}
                    placeholder="e.g. 180"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#e5e2da] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4a6549]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(null)}
                  className="flex-1 py-2.5 rounded-full bg-[#f1eee6] text-[#434841] text-[13px] font-medium hover:bg-[#ebe8e0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAdd(showAddModal)}
                  className="flex-1 py-2.5 rounded-full bg-[#4a6549] text-white text-[13px] font-semibold shadow-xs hover:bg-[#344a3a] cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
