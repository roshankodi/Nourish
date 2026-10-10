import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ChevronLeft, Sprout, User, HelpCircle, Camera } from 'lucide-react';

export const Header: React.FC = () => {
  const { currentScreen, navigate, goBack, user, showToast } = useApp();

  if (currentScreen === 'landing') {
    return null; // Landing renders its own top brand row
  }

  // Onboarding Headers
  if (currentScreen === 'onboarding-1' || currentScreen === 'onboarding-2' || currentScreen === 'onboarding-3') {
    const stepConfigs = {
      'onboarding-1': {
        title: 'Step 1 · Wellness Intentions',
        activeStep: 1,
      },
      'onboarding-2': {
        title: 'Step 2 · Dietary Rhythms',
        activeStep: 2,
      },
      'onboarding-3': {
        title: 'Step 3 · Sanctuary Ready',
        activeStep: 3,
      },
    };

    const config = stepConfigs[currentScreen];

    return (
      <header className="fixed top-0 inset-x-0 z-50 bg-[#fcf9f1]/95 backdrop-blur-xl border-b border-[#e5e2da]/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-safe">
        <div className="h-16 px-4 max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              aria-label="Return to previous step"
              type="button"
              onClick={goBack}
              className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-[#434841] hover:text-[#1c1c17] hover:bg-[#f1eee6] active:bg-[#ebe8e0] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 pl-1">
              <div className="w-7 h-7 rounded-full bg-[#cfe9d3] flex items-center justify-center text-[#4a6549] shadow-inner">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="font-editorial text-lg text-[#1c1c17] tracking-tight hidden sm:inline font-medium">Nourish</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="text-[11px] uppercase text-[#737970] tracking-wider font-semibold">
              {config.title}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-6 h-1.5 rounded-full transition-all ${config.activeStep >= 1 ? 'bg-[#4a6549]' : 'bg-[#e5e2da]'}`} />
              <span className={`w-6 h-1.5 rounded-full transition-all ${config.activeStep >= 2 ? 'bg-[#4a6549]' : 'bg-[#e5e2da]'}`} />
              <span className={`w-6 h-1.5 rounded-full transition-all ${config.activeStep >= 3 ? 'bg-[#4a6549]' : 'bg-[#e5e2da]'}`} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => navigate('dashboard')}
              className="min-h-[44px] px-3 py-1 flex items-center justify-center text-[13px] text-[#737970] hover:text-[#1c1c17] transition-colors font-medium rounded-full hover:bg-[#f1eee6] cursor-pointer"
            >
              Skip
            </button>
            <button
              type="button"
              onClick={() => navigate('settings')}
              aria-label="Profile settings"
              className="w-9 h-9 min-w-[44px] min-h-[44px] rounded-full bg-[#4a6549] flex items-center justify-center text-white shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Settings Sanctuary Header
  if (currentScreen === 'settings') {
    return (
      <header className="fixed top-0 inset-x-0 z-50 bg-[#fcf9f1]/95 backdrop-blur-xl border-b border-[#e5e2da]/80 shadow-[0_1px_8px_rgba(48,53,47,0.04)] pt-safe">
        <div className="h-16 px-4 max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              aria-label="Go back"
              type="button"
              onClick={goBack}
              className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-[#1c1c17] hover:bg-[#ebe8e0] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-editorial text-[20px] text-[#1c1c17] tracking-tight font-medium">Settings Sanctuary</h1>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              aria-label="Help and Sanctuary Guides"
              type="button"
              onClick={() => showToast('Sanctuary Guide: Customize your targets, reminders, and data sovereignty.')}
              className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-[#434841] hover:text-[#1c1c17] hover:bg-[#ebe8e0] transition-colors cursor-pointer"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <div className="w-9 h-9 min-w-[44px] min-h-[44px] rounded-full bg-[#4a6549] flex items-center justify-center text-white shadow-sm">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Scanner Header
  if (currentScreen === 'scanner') {
    return (
      <header className="fixed top-0 inset-x-0 z-50 bg-[#fcf9f1]/95 backdrop-blur-xl border-b border-[#e5e2da]/80 shadow-[0_1px_12px_rgba(48,53,47,0.04)] pt-safe">
        <div className="h-16 px-4 max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goBack}
              aria-label="Back"
              className="w-10 h-10 min-w-[44px] min-h-[44px] -ml-1 rounded-full flex items-center justify-center text-[#1c1c17] active:bg-[#ebe8e0] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-[#4a6549]" />
              <h1 className="font-editorial text-[20px] text-[#1c1c17] leading-tight font-medium">Food Lens Scanner</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('settings')}
            aria-label="Open settings"
            className="p-0.5 rounded-full bg-[#f6f3eb] shadow-[0_2px_6px_rgba(48,53,47,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] border border-[#e5e2da] cursor-pointer"
          >
            <img alt={user.name} src={user.avatar} className="w-8 h-8 rounded-full object-cover" />
          </button>
        </div>
      </header>
    );
  }

  // App Tabs Header (Dashboard, Diary, Hydration, Insights)
  const tabTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    diary: 'Food Diary',
    hydration: 'Fluid Tracking',
    insights: 'Weekly Rhythm',
  };

  const currentTab = tabTitles[currentScreen] || 'Dashboard';

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[#fcf9f1]/95 backdrop-blur-xl border-b border-[#e5e2da]/80 shadow-[0_1px_12px_rgba(48,53,47,0.04)] pt-safe">
      <div className="h-16 px-4 max-w-lg mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#cfe9d3] flex items-center justify-center text-[#4a6549] shadow-inner">
            <Sprout className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-[19px] text-[#1c1c17] leading-none tracking-tight font-medium">Nourish</span>
            <span className="text-[11px] uppercase text-[#4d6452] tracking-wider mt-0.5 font-semibold">
              Sanctuary · {currentTab}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('settings')}
          aria-label="Open settings profile"
          className="p-0.5 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center bg-[#f6f3eb] shadow-[0_2px_6px_rgba(48,53,47,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] hover:scale-105 transition-transform border border-[#e5e2da] cursor-pointer"
        >
          <img alt={user.name} src={user.avatar} className="w-8 h-8 rounded-full object-cover" />
        </button>
      </div>
    </header>
  );
};
