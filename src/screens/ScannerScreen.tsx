import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MealCategory, RecognizedItem } from '../types';
import {
  Camera,
  Search,
  FileText,
  Sparkles,
  ShieldCheck,
  Info,
  Minus,
  Plus,
  PlusCircle,
  Clock,
  Check,
  RotateCw,
  Upload,
  Fish,
  Wheat,
  Leaf,
  Apple,
  Egg,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const samplePlates = [
  {
    name: 'Wild Salmon & Quinoa Nourishment Bowl',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDF6i4rtlxTCt8oNoknLJGp0_e0zddjXLFcWtHMAD73fa4jobiAFbGvNjheJQI-us6KCX4HbbuUCNJDaHzNi38MDoqd0T3GG_hNPQv9wx5JxbeftC0BPYNELMvbbYQyIVkks1wuP6Z3SQzmN9lY30lqnan7WTtQOBT70jYYAfhl3cHSvUMqzEIMGqRYd0Mgy1mo9Z1wWUu-Eec7DsXskLwakLSxC1KJr0WkHMdluFvpzsxweqQ2A-2v',
    items: [
      { id: '1', name: 'Grilled Salmon Fillet', baseCal: 310, weightG: 160, iconType: 'fish' as const, desc: 'Wild caught' },
      { id: '2', name: 'Herbed Quinoa Bowl', baseCal: 185, weightG: 140, iconType: 'grain' as const, desc: 'Steamed parsley' },
      { id: '3', name: 'Sliced Hass Avocado', baseCal: 80, weightG: 50, iconType: 'leaf' as const, desc: 'Fresh ripe' },
      { id: '4', name: 'Asparagus & Olive Oil', baseCal: 45, weightG: 80, iconType: 'apple' as const, desc: 'Lightly charred' },
    ],
  },
  {
    name: 'Artisanal Seeded Sourdough Avocado Toast',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD4sXiChb3-GMFUyfb2Ojz4ISXNyUFaCq6CbKXPvAwjqhHFD6tEbnjsCW3gTK7KivjejASO8muu695M1GsIdL4dgFL4mGYKnl2tyrMM-1bwggxJbD8ccOnSlUafy9gC20D8li4zgdZ3Hv8YICJOjNSFEdGhQxwEaGdM1zR8wC2znOcKdJU-PWZ2IWdlJm0U99A3npCn11n-psuax8pOhv7s3Rb3Qa7cqK85rtlfF-0GXZ7VYnbvVJXR',
    items: [
      { id: '1', name: 'Organic Sourdough Slice', baseCal: 180, weightG: 70, iconType: 'grain' as const, desc: 'Naturally fermented' },
      { id: '2', name: 'Mashed Hass Avocado', baseCal: 140, weightG: 80, iconType: 'leaf' as const, desc: 'Cold pressed lemon' },
      { id: '3', name: 'Poached Pasture Egg', baseCal: 70, weightG: 50, iconType: 'egg' as const, desc: 'Soft yolk' },
      { id: '4', name: 'Olive Oil & Flaky Salt', baseCal: 50, weightG: 10, iconType: 'leaf' as const, desc: 'EVOO finish' },
    ],
  },
];

export const ScannerScreen: React.FC = () => {
  const { addFoodItem, navigate, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'scan' | 'database' | 'manual'>('scan');
  const [plateIndex, setPlateIndex] = useState(0);
  const [items, setItems] = useState<RecognizedItem[]>(samplePlates[0].items);
  const [plateName, setPlateName] = useState<string>(samplePlates[0].name);
  const [targetMeal, setTargetMeal] = useState<MealCategory>('dinner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  // Gemini AI recognition states
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);
  const [aiConfidence, setAiConfidence] = useState<number>(0.94);
  const [mindfulNotes, setMindfulNotes] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const currentPlate = samplePlates[plateIndex];
  const activeImage = uploadedImage || currentPlate.image;

  // Calculate dynamic calories and macros from current items
  const totalCalories = items.reduce((sum, item) => sum + Math.round(item.baseCal), 0);
  const estimatedProtein = Math.round(totalCalories * 0.068);
  const estimatedCarbs = Math.round(totalCalories * 0.077);
  const estimatedFats = Math.round(totalCalories * 0.042);

  const handleStepper = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newWeight = Math.max(20, item.weightG + delta);
          const ratio = newWeight / item.weightG;
          const newCal = Math.round(item.baseCal * ratio);
          return {
            ...item,
            weightG: newWeight,
            baseCal: newCal,
          };
        }
        return item;
      })
    );
  };

  const handleAddIngredient = () => {
    const name = window.prompt('Ingredient name (e.g., Tahini dressing, Lemon slice, Chia):');
    if (!name) return;
    const caloriesStr = window.prompt('Estimated calories:', '60');
    const calories = parseInt(caloriesStr || '60', 10);
    const newItem: RecognizedItem = {
      id: `custom-${Date.now()}`,
      name,
      baseCal: isNaN(calories) ? 60 : calories,
      weightG: 30,
      iconType: 'leaf',
      desc: 'Custom addition',
    };
    setItems((prev) => [...prev, newItem]);
    showToast(`Added ${name}`);
  };

  const handleRetake = () => {
    setUploadedImage(null);
    setAiError(null);
    setMindfulNotes(null);
    const nextIdx = (plateIndex + 1) % samplePlates.length;
    setPlateIndex(nextIdx);
    setPlateName(samplePlates[nextIdx].name);
    setItems(samplePlates[nextIdx].items);
    setAiConfidence(0.94);
    showToast(`Switched sample plate to ${samplePlates[nextIdx].name}`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAiError(null);
    setIsAiAnalyzing(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setUploadedImage(dataUrl);

      try {
        const response = await fetch('/api/ai/recognize-food', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: dataUrl,
            mimeType: file.type || 'image/jpeg',
          }),
        });

        const data = await response.json();

        if (response.ok && data.success && data.result) {
          const res = data.result;
          setPlateName(res.plateName || 'Artisanal Mindful Plate');
          setItems(res.items);
          setAiConfidence(res.confidence || 0.92);
          setMindfulNotes(res.mindfulNotes || null);
          showToast(`Gemini recognized: ${res.plateName}`);
        } else {
          const errMsg = data.error || 'Gemini Vision could not parse image.';
          setAiError(errMsg);
          showToast(errMsg);
        }
      } catch (err: any) {
        const msg = err?.message || 'Error connecting to Gemini Vision API.';
        setAiError(msg);
        showToast(msg);
      } finally {
        setIsAiAnalyzing(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const compositeItem = {
        name: plateName,
        subtitle: `${items.length} ingredients (${items.map((i) => i.name).join(', ')})`,
        mealType: targetMeal,
        calories: totalCalories,
        carbs: estimatedCarbs,
        protein: estimatedProtein,
        fat: estimatedFats,
        weightGrams: items.reduce((s, i) => s + i.weightG, 0),
        image: activeImage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      addFoodItem(compositeItem);
      setIsSubmitting(false);
      navigate('diary');
    }, 600);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'fish':
        return <Fish className="w-5 h-5 text-[#4a6549]" />;
      case 'grain':
        return <Wheat className="w-5 h-5 text-[#8b4e36]" />;
      case 'leaf':
        return <Leaf className="w-5 h-5 text-[#4d6452]" />;
      case 'egg':
        return <Egg className="w-5 h-5 text-[#8b4e36]" />;
      case 'apple':
      default:
        return <Apple className="w-5 h-5 text-[#4a6549]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full pt-20 pb-36 px-4 max-w-lg mx-auto bg-[#fcf9f1]">
      <div className="flex flex-col w-full pb-6">
        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-between p-1 bg-[#ebe8e0] rounded-full shadow-inner mb-4 border border-[#e5e2da]">
          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-2 px-3 rounded-full text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'scan' ? 'bg-[#4a6549] text-white shadow-xs' : 'text-[#434841] hover:text-[#1c1c17]'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Scan Photo</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('database');
              navigate('diary');
            }}
            className={`flex-1 py-2 px-3 rounded-full text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'database' ? 'bg-[#4a6549] text-white shadow-xs' : 'text-[#434841] hover:text-[#1c1c17]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Database</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('manual');
              navigate('diary');
            }}
            className={`flex-1 py-2 px-3 rounded-full text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'manual' ? 'bg-[#4a6549] text-white shadow-xs' : 'text-[#434841] hover:text-[#1c1c17]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Manual</span>
          </button>
        </div>

        {/* Viewfinder Box */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-[#f1eee6] mb-3.5 border border-[#e5e2da]">
          <img src={activeImage} alt="Scanned meal plate" className="w-full h-full object-cover" />

          {/* Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c17]/60 via-transparent to-[#1c1c17]/20 pointer-events-none" />

          {/* Caliper Corner Brackets */}
          <div className="absolute inset-4 pointer-events-none flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-sm shadow-sm" />
              <div className="w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-sm shadow-sm" />
            </div>
            <div className="flex justify-between items-end">
              <div className="w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-sm shadow-sm" />
              <div className="w-6 h-6 border-b-2 border-r-2 border-white rounded-br-sm shadow-sm" />
            </div>
          </div>

          {/* Analyzing State Overlay */}
          {isAiAnalyzing && (
            <div className="absolute inset-0 bg-[#1c1c17]/70 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-3 z-10">
              <Loader2 className="w-8 h-8 animate-spin text-[#cfe9d3]" />
              <div className="text-center px-4">
                <p className="font-editorial text-lg font-medium">Gemini Vision Analyzing Plate...</p>
                <p className="text-[12px] text-[#e5e2da] mt-1">Recognizing culinary elements, portion weight &amp; macros</p>
              </div>
            </div>
          )}

          {/* Laser Scanning Line */}
          {!isAiAnalyzing && (
            <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#cfe9d3] to-transparent opacity-90 shadow-[0_0_12px_#cfe9d3] pointer-events-none animate-pulse" />
          )}

          {/* Top Engine Badge */}
          <div className="absolute top-3 left-3 bg-[#ffffff]/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-[#e5e2da]/50">
            <span className="w-2 h-2 rounded-full bg-[#4a6549] animate-ping" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1c1c17]">Gemini 2.5 Vision Engine</span>
          </div>

          {/* Auto-Framed Indicator */}
          <div className="absolute bottom-3 right-3 bg-[#ffffff]/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[#1c1c17] shadow-sm border border-[#e5e2da]/50">
            <Sparkles className="w-3.5 h-3.5 text-[#4a6549]" />
            <span className="text-[12px] font-medium">Auto-Framed</span>
          </div>

          {/* Upload Button */}
          <label className="absolute bottom-3 left-3 cursor-pointer bg-[#ffffff]/90 hover:bg-white backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[#1c1c17] shadow-sm text-[12px] font-medium transition-colors">
            <Upload className="w-3.5 h-3.5 text-[#4a6549]" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* AI Error Alert if Gemini fails or key is missing */}
        {aiError && (
          <div className="bg-[#fff8f2] border border-[#f5d0b5] rounded-xl p-3.5 text-[12px] flex items-start gap-2.5 mb-3.5 text-[#7a4128]">
            <AlertCircle className="w-4 h-4 text-[#ba1a1a] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Gemini API Notice</span>
              <p className="mt-0.5 leading-snug">{aiError}</p>
            </div>
          </div>
        )}

        {/* Analysis Status Callout */}
        <div className="bg-[#f6f3eb] p-3.5 rounded-2xl shadow-sm border border-[#e5e2da]/70 mb-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#cfe9d3] text-[#536a58] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-[#4a6549]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-[#1c1c17] truncate">{plateName}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#ccebc7] text-[#07200b] text-[11px] font-semibold uppercase shrink-0">
                {Math.round(aiConfidence * 100)}% Confidence
              </span>
            </div>
            <p className="text-[12px] text-[#434841] mt-0.5 leading-snug">
              {mindfulNotes || 'Calculated from visible ingredient density. You can fine-tune portion weights directly below.'}
            </p>
          </div>
        </div>

        {/* Estimated Energy Card */}
        <div className="bg-[#f1eee6] p-4 rounded-2xl shadow-sm border border-[#e5e2da] mb-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-[#737970] font-semibold">Estimated Energy</span>
            <span className="text-[12px] text-[#4a6549] flex items-center gap-1 font-medium">
              <Info className="w-3.5 h-3.5" />
              Mindful Precision
            </span>
          </div>

          <div className="bg-[#ebe8e0] rounded-xl p-3.5 debossed-well flex items-baseline justify-center gap-2">
            <span className="font-editorial text-2xl text-[#1c1c17] italic">≈</span>
            <span className="text-4xl text-[#1c1c17] font-semibold tracking-tight tabular-nums">{totalCalories}</span>
            <span className="font-editorial text-lg text-[#737970] italic">kcal</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-[#f6f3eb] p-2.5 rounded-xl flex flex-col items-center shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#737970] font-semibold">Protein</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-bold text-[#4a6549] tabular-nums">{estimatedProtein}</span>
                <span className="text-[12px] text-[#737970] italic">g</span>
              </div>
              <div className="w-full bg-[#e5e2da] h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#4a6549] h-full w-[65%] rounded-full" />
              </div>
            </div>

            <div className="bg-[#f6f3eb] p-2.5 rounded-xl flex flex-col items-center shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#737970] font-semibold">Carbs</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-bold text-[#8b4e36] tabular-nums">{estimatedCarbs}</span>
                <span className="text-[12px] text-[#737970] italic">g</span>
              </div>
              <div className="w-full bg-[#e5e2da] h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#d88e72] h-full w-[45%] rounded-full" />
              </div>
            </div>

            <div className="bg-[#f6f3eb] p-2.5 rounded-xl flex flex-col items-center shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-[#737970] font-semibold">Fats</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-lg font-bold text-[#4d6452] tabular-nums">{estimatedFats}</span>
                <span className="text-[12px] text-[#737970] italic">g</span>
              </div>
              <div className="w-full bg-[#e5e2da] h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#b4cdb8] h-full w-[38%] rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Recognized Elements */}
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="font-editorial text-[18px] text-[#1c1c17] font-medium">Recognized Elements</h2>
          <span className="text-[12px] text-[#737970]">{items.length} components</span>
        </div>

        <div className="flex flex-col gap-2 mb-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#ffffff] p-3 rounded-2xl shadow-xs border border-[#e5e2da]/70 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl bg-[#f1eee6] flex items-center justify-center shrink-0">
                  {getItemIcon(item.iconType)}
                </div>
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[#1c1c17] truncate">{item.name}</p>
                  <p className="text-[12px] text-[#737970]">
                    <span className="font-semibold text-[#1c1c17]">{item.baseCal}</span> kcal · {item.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 bg-[#f6f3eb] px-2 py-1 rounded-full border border-[#e5e2da]">
                <button
                  type="button"
                  onClick={() => handleStepper(item.id, -10)}
                  aria-label="Decrease weight"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#434841] hover:bg-[#e5e2da] transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-[12px] font-semibold w-10 text-center tabular-nums">{item.weightG}g</span>
                <button
                  type="button"
                  onClick={() => handleStepper(item.id, 10)}
                  aria-label="Increase weight"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#434841] hover:bg-[#e5e2da] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Missing Ingredient Button */}
        <button
          type="button"
          onClick={handleAddIngredient}
          className="w-full py-3 rounded-xl bg-[#f6f3eb] hover:bg-[#ebe8e0] transition-colors text-[#4a6549] text-[13px] font-semibold flex items-center justify-center gap-2 border border-[#e5e2da] mb-5 shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Missing Ingredient or Dressing</span>
        </button>

        {/* Log to Meal Selector */}
        <div className="bg-[#f6f3eb] p-4 rounded-2xl shadow-xs border border-[#e5e2da] mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-[11px] uppercase tracking-wider text-[#737970] font-semibold">Log To Meal</label>
            <span className="text-[12px] text-[#737970] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              12:45 PM Today
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as MealCategory[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setTargetMeal(m)}
                className={`py-2 px-1 rounded-xl text-[12px] font-semibold capitalize text-center transition-all cursor-pointer ${
                  targetMeal === m
                    ? 'bg-[#4a6549] text-white shadow-xs'
                    : 'bg-[#ebe8e0] text-[#434841] hover:bg-[#e5e2da]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Confirmation Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            type="button"
            disabled={isSubmitting || isAiAnalyzing}
            onClick={handleConfirm}
            className="w-full py-3.5 px-6 rounded-full bg-[#4a6549] hover:bg-[#344a3a] text-white text-[15px] font-medium shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? 'Logging to Diary...' : 'Confirm & Add to Diary'}</span>
          </button>

          <button
            type="button"
            onClick={handleRetake}
            className="w-full py-3 px-6 rounded-full bg-[#f1eee6] hover:bg-[#ebe8e0] text-[#1c1c17] text-[14px] font-medium border border-[#e5e2da] active:scale-[0.98] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCw className="w-4 h-4" />
            <span>Switch / Retake Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
