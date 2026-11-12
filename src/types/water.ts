export type DrinkType = 'water' | 'tea' | 'mineral' | 'juice' | 'coffee' | 'electrolyte';

export interface DrinkTypeConfig {
  id: DrinkType;
  label: string;
  sublabel: string;
  iconName: string;
  hydrationRate: number; // e.g. 1.0 for 100%, 0.8 for coffee
  color: string;
  bgColor: string;
}

export interface DrinkRecord {
  id: string;
  timestamp: number;
  amount: number; // in ml
  effectiveHydration: number; // amount * hydrationRate
  drinkType: DrinkType;
  note?: string;
}

export type SoundType = 'drop' | 'chime' | 'bubble' | 'gentle';

export interface ReminderSettings {
  enabled: boolean;
  intervalMinutes: number; // e.g. 45, 60
  startTime: string; // e.g. "08:00"
  endTime: string; // e.g. "21:00"
  soundEnabled: boolean;
  soundType: SoundType;
  volume: number; // 0 to 1
  browserNotificationEnabled: boolean;
  nextReminderTimestamp: number | null;
  snoozeCount: number;
}

export interface UserProfile {
  weightKg: number;
  activityLevel: 'sedentary' | 'moderate' | 'active';
  hotWeather: boolean;
  customGoalMl: number;
  glassSizeMl: number;
}

export interface DailyHydrationData {
  [dateKey: string]: {
    targetMl: number;
    records: DrinkRecord[];
  };
}
