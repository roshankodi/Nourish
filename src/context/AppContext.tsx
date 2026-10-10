import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  FoodItem,
  MealCategory,
  ScreenType,
  UserGoals,
  UserProfile,
  WaterLog,
  DayInsight,
  GoogleAuthStatus,
  GoogleHealthTelemetry,
  ConfigStatus,
} from '../types';

interface AppContextType {
  currentScreen: ScreenType;
  navigate: (screen: ScreenType) => void;
  previousScreen: ScreenType | null;
  goBack: () => void;
  user: UserProfile;
  goals: UserGoals;
  updateGoals: (partial: Partial<UserGoals>) => void;
  meals: FoodItem[];
  addFoodItem: (item: Omit<FoodItem, 'id'>) => void;
  removeFoodItem: (id: string) => void;
  waterLogs: WaterLog[];
  totalWater: number;
  addWaterLog: (ml: number, label: string) => void;
  removeWaterLog: (id: string) => void;
  updateHydrationGoal: (newGoal: number) => void;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  loginWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  weeklyInsights: DayInsight[];
  selectedDayInsight: DayInsight;
  setSelectedDayInsight: (day: DayInsight) => void;

  // Google OAuth & Google Health additions
  authStatus: GoogleAuthStatus;
  healthTelemetry: GoogleHealthTelemetry | null;
  isHealthSyncing: boolean;
  healthError: string | null;
  syncGoogleHealth: () => Promise<void>;
  configStatus: ConfigStatus | null;
  refreshAuthAndHealth: () => Promise<void>;
}

const initialGoals: UserGoals = {
  dailyCalories: 2000,
  dailyHydration: 2000,
  macroCarbs: 50,
  macroProtein: 25,
  macroFats: 25,
  massUnit: 'metric',
  energyUnit: 'kcal',
  loggingMode: 'ai',
  hydrationReminders: true,
  eveningReflection: true,
  weeklySynthesis: true,
  hapticFeedback: true,
  circadianTimes: {
    firstLight: '8:00',
    zenith: '1:00',
    dusk: '7:30',
  },
};

const initialMeals: FoodItem[] = [
  {
    id: 'meal-1',
    name: 'Organic rolled oats with banana & almond butter',
    subtitle: '1 bowl (260g)',
    mealType: 'breakfast',
    calories: 280,
    carbs: 45,
    protein: 9,
    fat: 11,
    weightGrams: 260,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIDCB1_c4WCNdtwt6SCVQRedPHibH8AT3r3wNLxe8Msngt-zCMG8xo5g_2BtjFD6DiiOQxhfyUNe46tQHADupZP8Pq46KHFbU3dS11VwjZB5SR5OglZaT3v6TQtr_XqFDXSrf7Oc8PRk9uGgKwwlvDAwP4FvgO7OLzUKZertS61fJQxbrxSdB93DjM4D0b_sCnH_K535ALEZMOjrHhqeF_ezQ4U86vNil_oKOUnCpoJokYhbSNcbhS',
    time: '8:15 AM',
  },
  {
    id: 'meal-2',
    name: 'Two soft-boiled pasture eggs with sea salt',
    subtitle: '2 items',
    mealType: 'breakfast',
    calories: 140,
    carbs: 0,
    protein: 12,
    fat: 10,
    weightGrams: 100,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG5TWIAS8QicB-QjuuYTzXWnDexZE40gxtr8ikfQMsUM99syZ91PijWPL6AF0EEjKeF2TkP1bPdKYpHQaFpnDMWYays-3tkwVH4ormAoFPK665ujjrCTZBh244BmYH-yXlzh2k7im2hQ5kovTYyp8UuABNhXXoA-tJL5wLqmjxCys2efyD08IthaFr1o8qUHAG5UfKDdLbMNg8UmpihQnwDx9K1qEPiWlnGaAO6QoH4TywHf549Eyj',
    time: '8:25 AM',
  },
  {
    id: 'meal-3',
    name: 'Mediterranean chicken & brown rice bowl',
    subtitle: '220g portion',
    mealType: 'lunch',
    calories: 410,
    carbs: 38,
    protein: 32,
    fat: 12,
    weightGrams: 220,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5RUNcUQJICF5qYEbzGpSZIN4u6YJ5eZJYllYbJBFeB8nv4piMWZogivYlTO91HjLvubwGTyMDfhY4wh0lDslwhVAdfUt66wQF7yGB4sRbv7bLfawFLAuJVjetKROnIjuhp0FjUT8sH7gSO53Hakp73qhzK3hOkV-3YZfepLiel14Hq5uDCVIMaWlAPPuyvR0IQecg5HEK5LntZ1zbistIJcugWE11Gn88JT71ybOJdZshiT9CIcR7',
    time: '1:10 PM',
  },
  {
    id: 'meal-4',
    name: 'Garden greens with lemon tahini vinaigrette',
    subtitle: '1 serving (150g)',
    mealType: 'lunch',
    calories: 170,
    carbs: 14,
    protein: 10,
    fat: 6,
    weightGrams: 150,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsrEB3tOqOH6yhCT9WltlhvKLXLr14FImgpkQY2GjNN_aK-Gf_YLnlNBRKlTKdCzzWYKTqC1i6le7Eord209FOAuYRQTh1czT5Dr8PHMe60DD1XMWnT8jK1b0UN0lxH_NXXTiDbHDkSQnqdbhpQmLqDoPKe9OU1HqG6PUuZmKIwsBbikb9ySbcG9HGjmJa2rn7mhQYYwTmkyzwv4JqpAWefZ63sNPzR7Mx5dZWcHlcW5iWmGxwwJhO',
    time: '1:15 PM',
  },
  {
    id: 'meal-5',
    name: 'Whole milk Greek yogurt with honey & berries',
    subtitle: '1 cup (200g)',
    mealType: 'snack',
    calories: 240,
    carbs: 22,
    protein: 15,
    fat: 5,
    weightGrams: 200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC35Sj22uVx1iKx410soM7lal8vO64TYTm3UsB9JJZCNsoZ-F335y_iBnL8lG-z8CR6qvqeg6aXniB4LQLMCmMU4J8NmsORzBbnriERmrEs0fewlC-GcgB9HGPiAPMqLaDpXY-Lf2ecIC2adn61LeZZyXnfSUUCHAqrGPoGLZz7cTL3a1-ybCiVdcRzX_NSK-rCcGD0j-6MCvmfsWE7_V_Sy8f4Z1VKdqxKo403cSdoE0Xjn_4IClu4',
    time: '4:30 PM',
  },
];

const initialWaterLogs: WaterLog[] = [
  { id: 'water-4', ml: 250, label: 'Afternoon hydration', time: '03:45 PM', period: 'afternoon' },
  { id: 'water-3', ml: 500, label: 'Lunch bottle', time: '01:10 PM', period: 'lunch' },
  { id: 'water-2', ml: 250, label: 'Post-walk glass', time: '10:30 AM', period: 'morning' },
  { id: 'water-1', ml: 250, label: 'Morning water', time: '08:15 AM', period: 'morning' },
];

const weeklyData: DayInsight[] = [
  { day: 'Monday', shortDay: 'Mon', calories: 1940, hydrationMl: 2150, notes: 'Balanced day', breakdown: 'B: 420 · L: 680 · D: 690 · S: 150' },
  { day: 'Tuesday', shortDay: 'Tue', calories: 2020, hydrationMl: 2300, notes: 'Gentle surplus (+20 kcal)', breakdown: 'B: 510 · L: 720 · D: 640 · S: 150' },
  { day: 'Wednesday', shortDay: 'Wed', calories: 1860, hydrationMl: 1850, notes: 'Light evening', breakdown: 'B: 390 · L: 620 · D: 650 · S: 200' },
  { day: 'Thursday', shortDay: 'Thu', calories: 1910, hydrationMl: 2050, notes: 'High sustained energy', breakdown: 'B: 440 · L: 710 · D: 610 · S: 150' },
  { day: 'Friday', shortDay: 'Fri', calories: 2150, hydrationMl: 2400, notes: 'Celebratory dinner', breakdown: 'B: 430 · L: 580 · D: 940 · S: 200' },
  { day: 'Saturday', shortDay: 'Sat', calories: 1780, hydrationMl: 2100, notes: 'Active recovery', breakdown: 'B: 480 · L: 610 · D: 540 · S: 150' },
  { day: 'Sunday (Today)', shortDay: 'Sun', calories: 1240, hydrationMl: 1250, notes: 'Day in progress · Dinner remaining', breakdown: 'B: 420 · L: 580 · Snack: 240', isToday: true },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('landing');
  const [history, setHistory] = useState<ScreenType[]>([]);
  const [goals, setGoals] = useState<UserGoals>(initialGoals);
  const [meals, setMeals] = useState<FoodItem[]>(initialMeals);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>(initialWaterLogs);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedDayInsight, setSelectedDayInsight] = useState<DayInsight>(weeklyData[6]);

  const [user, setUser] = useState<UserProfile>({
    name: 'Alex Morgan',
    email: 'alex.morgan@minimalwellness.co',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfTHwFPoxtF56U_Wy29i6KWbjlaDzwg2oHGzBjbATpxGpeCBKyYsx2XPDwPrX_uyQhAlFuKlunU2ivvNtO4fb8jWx1bTTxCjuQksq1QEiEr4VD3bknJnBVYreBM87LmiObY_vCUxdZdsa1d7C_xyuuJcUgqYpYYoO0pfgLIM-j6WR6VVuxBDY9ijPbMXPEU-XrrUd1a-E5f2Lbj2_6naKYnlDNwcPI7GN6eGRHdRZzj5zuxD8Witen',
    tier: 'Sanctuary Member',
    memberSince: 'Nov 2023',
    isAuthenticated: false, // Default to false until real session confirms
  });

  // Google OAuth & Health state
  const [authStatus, setAuthStatus] = useState<GoogleAuthStatus>({
    isAuthenticated: false,
    isConfigured: false,
    missingCredentials: [],
    user: null,
    healthScopeGranted: false,
  });

  const [healthTelemetry, setHealthTelemetry] = useState<GoogleHealthTelemetry | null>(null);
  const [isHealthSyncing, setIsHealthSyncing] = useState<boolean>(false);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);

  const navigate = (screen: ScreenType) => {
    setHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((h) => h.slice(0, -1));
      setCurrentScreen(prev);
    } else {
      if (['onboarding-1', 'onboarding-2', 'onboarding-3'].includes(currentScreen)) {
        setCurrentScreen('landing');
      } else {
        setCurrentScreen('dashboard');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const updateGoals = (partial: Partial<UserGoals>) => {
    setGoals((prev) => ({ ...prev, ...partial }));
    showToast('Goals calibrated successfully');
  };

  const addFoodItem = (item: Omit<FoodItem, 'id'>) => {
    const newItem: FoodItem = {
      ...item,
      id: `meal-${Date.now()}`,
    };
    setMeals((prev) => [newItem, ...prev]);
    showToast(`Added ${item.name} to ${item.mealType}`);
  };

  const removeFoodItem = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    showToast('Item removed from diary');
  };

  const addWaterLog = (ml: number, label: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog: WaterLog = {
      id: `water-${Date.now()}`,
      ml,
      label,
      time: timeStr,
    };
    setWaterLogs((prev) => [newLog, ...prev]);
    showToast(`+${ml} ml logged`);
  };

  const removeWaterLog = (id: string) => {
    setWaterLogs((prev) => prev.filter((w) => w.id !== id));
    showToast('Water log removed');
  };

  const updateHydrationGoal = (newGoal: number) => {
    setGoals((g) => ({ ...g, dailyHydration: newGoal }));
    showToast(`Hydration goal set to ${newGoal.toLocaleString()} ml`);
  };

  // Synchronize Google Health Data
  const syncGoogleHealth = useCallback(async () => {
    setIsHealthSyncing(true);
    setHealthError(null);
    try {
      const res = await fetch('/api/health-data/sync', {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.success && data.telemetry) {
        setHealthTelemetry(data.telemetry);
        showToast(`Synced ${data.telemetry.stepsToday.toLocaleString()} steps & ${data.telemetry.activeCaloriesBurned} kcal active burn`);
      } else {
        const errMsg = data.error || 'Failed to sync Google Health data.';
        setHealthError(errMsg);
        showToast(errMsg);
      }
    } catch (err: any) {
      const msg = err?.message || 'Network error syncing Google Health.';
      setHealthError(msg);
      showToast(msg);
    } finally {
      setIsHealthSyncing(false);
    }
  }, []);

  // Fetch Auth Status and Google Health Telemetry
  const refreshAuthAndHealth = useCallback(async () => {
    try {
      // 1. Fetch system config diagnostics
      const cfgRes = await fetch('/api/config/status');
      if (cfgRes.ok) {
        const cfgData: ConfigStatus = await cfgRes.json();
        setConfigStatus(cfgData);
      }

      // 2. Fetch current auth status
      const authRes = await fetch('/api/auth/status');
      if (authRes.ok) {
        const authData: GoogleAuthStatus = await authRes.json();
        setAuthStatus(authData);

        if (authData.isAuthenticated && authData.user) {
          setUser((u) => ({
            ...u,
            name: authData.user?.name || u.name,
            email: authData.user?.email || u.email,
            avatar: authData.user?.picture || u.avatar,
            isAuthenticated: true,
          }));

          // 3. If authenticated, fetch Google Health telemetry
          const healthRes = await fetch('/api/health-data');
          if (healthRes.ok) {
            const healthData = await healthRes.json();
            if (healthData.connected && healthData.telemetry) {
              setHealthTelemetry(healthData.telemetry);
              setHealthError(null);
            } else if (healthData.error) {
              setHealthError(healthData.error);
            }
          }
        } else {
          setUser((u) => ({ ...u, isAuthenticated: false }));
          setHealthTelemetry(null);
        }
      }
    } catch (err) {
      console.warn('Failed to load auth or health status:', err);
    }
  }, []);

  // Initiate real Google OAuth 2.0 Login
  const loginWithGoogle = async () => {
    try {
      const res = await fetch('/api/auth/google/url');
      const data = await res.json();

      if (!res.ok || !data.url) {
        const errorMsg = data.error || 'Google OAuth is not configured yet.';
        showToast(errorMsg);
        return;
      }

      // Redirect to Google OAuth Consent screen
      window.location.href = data.url;
    } catch (err: any) {
      showToast(`Unable to reach Google OAuth: ${err?.message || err}`);
    }
  };

  // Sign out and clear server session
  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout API error:', e);
    }
    setUser((u) => ({ ...u, isAuthenticated: false }));
    setAuthStatus((prev) => ({ ...prev, isAuthenticated: false, user: null, healthScopeGranted: false }));
    setHealthTelemetry(null);
    setHealthError(null);
    showToast('Signed out of sanctuary');
    navigate('landing');
  };

  // Listen for OAuth redirect return in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authSuccess = params.get('auth_success');
    const authError = params.get('auth_error');

    if (authSuccess === 'true') {
      window.history.replaceState({}, document.title, window.location.pathname);
      showToast('Successfully signed in with Google and linked Health API!');
      navigate('dashboard');
    } else if (authError) {
      window.history.replaceState({}, document.title, window.location.pathname);
      showToast(`Google Authorization note: ${decodeURIComponent(authError)}`);
    }

    refreshAuthAndHealth();
  }, [navigate, refreshAuthAndHealth]);

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.fat, 0);
  const totalWater = waterLogs.reduce((sum, w) => sum + w.ml, 0);

  const previousScreen = history.length > 0 ? history[history.length - 1] : null;

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigate,
        previousScreen,
        goBack,
        user,
        goals,
        updateGoals,
        meals,
        addFoodItem,
        removeFoodItem,
        waterLogs,
        totalWater,
        addWaterLog,
        removeWaterLog,
        updateHydrationGoal,
        totalCalories,
        totalCarbs,
        totalProtein,
        totalFat,
        toastMessage,
        showToast,
        loginWithGoogle,
        signOut,
        weeklyInsights: weeklyData,
        selectedDayInsight,
        setSelectedDayInsight,

        authStatus,
        healthTelemetry,
        isHealthSyncing,
        healthError,
        syncGoogleHealth,
        configStatus,
        refreshAuthAndHealth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
