import React from 'react';
import { useApp } from '../context/AppContext';
import { ScreenType } from '../types';
import { Home, BookOpen, Camera, Droplets, BarChart3 } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigate } = useApp();

  // Show bottom nav on main application screens
  const showOnScreens: ScreenType[] = ['dashboard', 'diary', 'scanner', 'hydration', 'insights', 'settings'];
  if (!showOnScreens.includes(currentScreen)) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#fcf9f1]/95 backdrop-blur-xl border-t border-[#e5e2da] shadow-[0_-4px_20px_rgba(48,53,47,0.06)]">
      <div className="flex items-center justify-around h-16 px-3 max-w-lg mx-auto relative">
        {/* Today Tab */}
        <button
          type="button"
          onClick={() => navigate('dashboard')}
          aria-label="Dashboard Today"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-xl transition-all duration-200 cursor-pointer ${
            currentScreen === 'dashboard'
              ? 'text-[#243d24] bg-[#cfe9d3] font-semibold shadow-xs'
              : 'text-[#536a58] hover:text-[#1c1c17] hover:bg-[#f1eee6]/80'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-none font-medium">Today</span>
        </button>

        {/* Diary Tab */}
        <button
          type="button"
          onClick={() => navigate('diary')}
          aria-label="Food Diary"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-xl transition-all duration-200 cursor-pointer ${
            currentScreen === 'diary'
              ? 'text-[#243d24] bg-[#cfe9d3] font-semibold shadow-xs'
              : 'text-[#536a58] hover:text-[#1c1c17] hover:bg-[#f1eee6]/80'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-none font-medium">Diary</span>
        </button>

        {/* Center Raised Scanner Button */}
        <div className="relative -top-3 flex items-center justify-center">
          <button
            type="button"
            onClick={() => navigate('scanner')}
            aria-label="Scan food with AI Lens"
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-[0_6px_16px_rgba(36,61,36,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] cursor-pointer ${
              currentScreen === 'scanner'
                ? 'bg-[#243d24] text-white ring-4 ring-[#cfe9d3]'
                : 'bg-[#243d24] text-white hover:bg-[#344a3a]'
            }`}
          >
            <Camera className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Water Tab */}
        <button
          type="button"
          onClick={() => navigate('hydration')}
          aria-label="Water Hydration"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-xl transition-all duration-200 cursor-pointer ${
            currentScreen === 'hydration'
              ? 'text-[#243d24] bg-[#cfe9d3] font-semibold shadow-xs'
              : 'text-[#536a58] hover:text-[#1c1c17] hover:bg-[#f1eee6]/80'
          }`}
        >
          <Droplets className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-none font-medium">Water</span>
        </button>

        {/* Insights Tab */}
        <button
          type="button"
          onClick={() => navigate('insights')}
          aria-label="Weekly Insights"
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] rounded-xl transition-all duration-200 cursor-pointer ${
            currentScreen === 'insights'
              ? 'text-[#243d24] bg-[#cfe9d3] font-semibold shadow-xs'
              : 'text-[#536a58] hover:text-[#1c1c17] hover:bg-[#f1eee6]/80'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] leading-none font-medium">Insights</span>
        </button>
      </div>
    </nav>
  );
};
