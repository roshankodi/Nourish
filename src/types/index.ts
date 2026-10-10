export type ScreenType =
  | 'landing'
  | 'auth'
  | 'onboarding-1'
  | 'onboarding-2'
  | 'onboarding-3'
  | 'dashboard'
  | 'diary'
  | 'scanner'
  | 'hydration'
  | 'insights'
  | 'settings';

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: string;
  name: string;
  subtitle?: string;
  mealType: MealCategory;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  weightGrams?: number;
  image?: string;
  time?: string;
}

export interface WaterLog {
  id: string;
  ml: number;
  label: string;
  time: string;
  period?: 'morning' | 'lunch' | 'afternoon' | 'evening';
}

export interface DayInsight {
  day: string;
  shortDay: string;
  calories: number;
  hydrationMl: number;
  notes: string;
  breakdown: string;
  isToday?: boolean;
}

export interface UserGoals {
  dailyCalories: number;
  dailyHydration: number;
  macroCarbs: number;
  macroProtein: number;
  macroFats: number;
  massUnit: 'metric' | 'imperial';
  energyUnit: 'kcal' | 'kj';
  loggingMode: 'ai' | 'manual';
  hydrationReminders: boolean;
  eveningReflection: boolean;
  weeklySynthesis: boolean;
  hapticFeedback: boolean;
  circadianTimes: {
    firstLight: string;
    zenith: string;
    dusk: string;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  tier: string;
  memberSince: string;
  isAuthenticated: boolean;
}

export interface GoogleHealthTelemetry {
  stepsToday: number;
  activeCaloriesBurned: number;
  activeMinutesToday: number;
  lastSyncTime: string;
  source: string;
  notes?: string;
}

export interface GoogleAuthStatus {
  isAuthenticated: boolean;
  isConfigured: boolean;
  missingCredentials: string[];
  user: {
    id?: string;
    email?: string;
    name?: string;
    picture?: string;
  } | null;
  healthScopeGranted: boolean;
  expiresAt?: number;
}

export interface ConfigStatus {
  googleOAuth: {
    configured: boolean;
    missing: string[];
    redirectUri: string | null;
    healthScope: string;
  };
  googleHealthApi?: {
    configured: boolean;
    apiKeyPreview?: string | null;
    keyVerified?: boolean;
    scope: string;
  };
  geminiApi: {
    configured: boolean;
    keyLength: number;
  };
  environment: string;
}

export interface RecognizedItem {
  id: string;
  name: string;
  baseCal: number;
  weightG: number;
  iconType: 'fish' | 'grain' | 'leaf' | 'egg' | 'apple';
  desc: string;
}

export interface FoodRecognitionResult {
  plateName: string;
  confidence: number;
  totalCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  items: RecognizedItem[];
  mindfulNotes: string;
}
