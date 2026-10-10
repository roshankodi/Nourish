/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { ChatBot } from './components/ChatBot';

import { LandingScreen } from './screens/LandingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { OnboardingStep1 } from './screens/OnboardingStep1';
import { OnboardingStep2 } from './screens/OnboardingStep2';
import { OnboardingStep3 } from './screens/OnboardingStep3';
import { DashboardScreen } from './screens/DashboardScreen';
import { DiaryScreen } from './screens/DiaryScreen';
import { ScannerScreen } from './screens/ScannerScreen';
import { HydrationScreen } from './screens/HydrationScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const MainRouter: React.FC = () => {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingScreen />;
      case 'auth':
        return <AuthScreen />;
      case 'onboarding-1':
        return <OnboardingStep1 />;
      case 'onboarding-2':
        return <OnboardingStep2 />;
      case 'onboarding-3':
        return <OnboardingStep3 />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'diary':
        return <DiaryScreen />;
      case 'scanner':
        return <ScannerScreen />;
      case 'hydration':
        return <HydrationScreen />;
      case 'insights':
        return <InsightsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f1] text-[#1c1c17] flex flex-col items-center justify-start antialiased selection:bg-[#cfe9d3] selection:text-[#536a58] w-full">
      {/* Global Toast */}
      <Toast />

      {/* Unified Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-start max-w-2xl mx-auto">
        {renderScreen()}
      </main>

      {/* Bottom Sticky Navigation Bar */}
      <BottomNav />

      {/* Floating Gemini AI Chatbot */}
      <ChatBot />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
