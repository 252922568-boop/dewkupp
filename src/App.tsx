import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Droplets,
  Calculator,
  BookOpen,
  Settings as SettingsIcon,
  Sun,
  Moon,
  Sparkles,
  Award,
  Bell,
  HeartHandshake
} from 'lucide-react';
import {
  DrinkRecord,
  DrinkType,
  ReminderSettings,
  UserProfile,
  DailyHydrationData,
} from './types/water';
import { getTodayKey, calculateRecommendedWater } from './utils/constants';
import { soundSynth } from './utils/audio';
import { sendWaterNotification } from './utils/notification';
import { WaterBottleVisual } from './components/WaterBottleVisual';
import { QuickDrinkButtons } from './components/QuickDrinkButtons';
import { ReminderCard } from './components/ReminderCard';
import { HydrationTimeline } from './components/HydrationTimeline';
import { WeeklyStats } from './components/WeeklyStats';
import { GoalCalculatorModal } from './components/GoalCalculatorModal';
import { HydrationTipsModal } from './components/HydrationTipsModal';
import { SettingsModal } from './components/SettingsModal';

const STORAGE_KEYS = {
  PROFILE: 'aquatrack_profile_v1',
  SETTINGS: 'aquatrack_settings_v1',
  HISTORY: 'aquatrack_history_v1',
  THEME: 'aquatrack_theme_v1',
};

const DEFAULT_PROFILE: UserProfile = {
  weightKg: 60,
  activityLevel: 'moderate',
  hotWeather: false,
  customGoalMl: 2000,
  glassSizeMl: 250,
};

const DEFAULT_SETTINGS: ReminderSettings = {
  enabled: true,
  intervalMinutes: 60,
  startTime: '07:30',
  endTime: '21:30',
  soundEnabled: true,
  soundType: 'drop',
  volume: 0.8,
  browserNotificationEnabled: false,
  nextReminderTimestamp: Date.now() + 60 * 60 * 1000,
  snoozeCount: 0,
};

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  // User Profile State
  const [profile, setProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_PROFILE;
  });

  // Reminder Settings State
  const [settings, setSettings] = useState<ReminderSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // ensure nextReminderTimestamp is valid
          if (!parsed.nextReminderTimestamp || parsed.nextReminderTimestamp < Date.now()) {
            parsed.nextReminderTimestamp = Date.now() + parsed.intervalMinutes * 60 * 1000;
          }
          return parsed;
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Hydration History State (keyed by YYYY-MM-DD)
  const [history, setHistory] = useState<DailyHydrationData>(() => {
    const today = getTodayKey();
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (!parsed[today]) {
            parsed[today] = { targetMl: 2000, records: [] };
          }
          return parsed;
        } catch {
          // fallback
        }
      }
    }
    return {
      [today]: {
        targetMl: 2000,
        records: [],
      },
    };
  });

  // Modals state
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Transient UI states
  const [lastAddedMl, setLastAddedMl] = useState<number | null>(null);
  const [lastDrinkRecord, setLastDrinkRecord] = useState<DrinkRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  const todayKey = getTodayKey();
  const currentTargetMl = profile.customGoalMl || 2000;
  const todayData = history[todayKey] || { targetMl: currentTargetMl, records: [] };

  // Calculate current today stats
  const currentTotalMl = todayData.records.reduce((sum, r) => sum + r.amount, 0);
  const glassCount = todayData.records.length;

  // Sync today's target with profile
  useEffect(() => {
    if (!history[todayKey] || history[todayKey].targetMl !== currentTargetMl) {
      setHistory((prev) => ({
        ...prev,
        [todayKey]: {
          targetMl: currentTargetMl,
          records: prev[todayKey]?.records || [],
        },
      }));
    }
  }, [todayKey, currentTargetMl, history]);

  // Check if daily goal has just been achieved
  const prevTotalRef = useRef(currentTotalMl);
  useEffect(() => {
    if (prevTotalRef.current < currentTargetMl && currentTotalMl >= currentTargetMl && currentTargetMl > 0) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#38bdf8', '#34d399', '#10b981', '#60a5fa'],
      });
      soundSynth.playGoalCelebration(settings.volume);
      showToast('🎉 ยินดีด้วยครับ! คุณดื่มน้ำครบตามเป้าหมายของวันนี้แล้ว');
    }
    prevTotalRef.current = currentTotalMl;
  }, [currentTotalMl, currentTargetMl, settings.volume, showToast]);

  // Reminder interval schedule ticker
  useEffect(() => {
    const checkReminder = () => {
      if (!settings.enabled || !settings.nextReminderTimestamp) return;

      const now = Date.now();
      const currentHours = new Date().getHours();
      const currentMins = new Date().getMinutes();
      const currentMinutesOfDay = currentHours * 60 + currentMins;

      const [startH, startM] = settings.startTime.split(':').map(Number);
      const [endH, endM] = settings.endTime.split(':').map(Number);
      const startMinutesOfDay = startH * 60 + startM;
      const endMinutesOfDay = endH * 60 + endM;

      // Don't disturb if outside active hours
      const isWithinActiveHours =
        currentMinutesOfDay >= startMinutesOfDay && currentMinutesOfDay <= endMinutesOfDay;

      if (now >= settings.nextReminderTimestamp) {
        if (isWithinActiveHours) {
          // Play sound
          if (settings.soundEnabled) {
            soundSynth.playSound(settings.soundType, settings.volume);
          }
          // Push notification
          if (settings.browserNotificationEnabled) {
            sendWaterNotification(
              '💧 ถึงเวลาจิบน้ำแล้ว!',
              `ตอนนี้คุณดื่มไปแล้ว ${currentTotalMl.toLocaleString()} มล. เติมความสดชื่นอีกสักแก้วนะครับ`
            );
          }
          showToast('💧 ถึงเวลาดื่มน้ำแล้ว! จิบน้ำสักแก้วเพื่อความสดชื่น');
        }

        // Schedule next reminder timestamp
        const nextTime = now + settings.intervalMinutes * 60 * 1000;
        setSettings((prev) => ({
          ...prev,
          nextReminderTimestamp: nextTime,
          snoozeCount: 0,
        }));
      }
    };

    const timer = setInterval(checkReminder, 5000);
    return () => clearInterval(timer);
  }, [settings, currentTotalMl, showToast]);

  // Drink handlers
  const handleAddDrink = (amount: number, type: DrinkType, note?: string) => {
    const record: DrinkRecord = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      amount,
      effectiveHydration: amount,
      drinkType: type,
      note,
    };

    setHistory((prev) => {
      const day = prev[todayKey] || { targetMl: currentTargetMl, records: [] };
      return {
        ...prev,
        [todayKey]: {
          ...day,
          records: [record, ...day.records],
        },
      };
    });

    setLastAddedMl(amount);
    setLastDrinkRecord(record);

    // Audio feedback
    soundSynth.playSound(settings.soundType, settings.volume);

    // Automatically reschedule next reminder if enabled
    if (settings.enabled) {
      setSettings((prev) => ({
        ...prev,
        nextReminderTimestamp: Date.now() + prev.intervalMinutes * 60 * 1000,
        snoozeCount: 0,
      }));
    }

    showToast(`บันทึกการดื่ม ${amount} มล. เรียบร้อยแล้ว`);

    setTimeout(() => {
      setLastAddedMl(null);
    }, 1500);
  };

  const handleUndo = () => {
    if (!lastDrinkRecord) return;
    setHistory((prev) => {
      const day = prev[todayKey];
      if (!day) return prev;
      return {
        ...prev,
        [todayKey]: {
          ...day,
          records: day.records.filter((r) => r.id !== lastDrinkRecord.id),
        },
      };
    });
    showToast(`ยกเลิกรายการ ${lastDrinkRecord.amount} มล. แล้ว`);
    setLastDrinkRecord(null);
  };

  const handleDeleteRecord = (id: string) => {
    setHistory((prev) => {
      const day = prev[todayKey];
      if (!day) return prev;
      return {
        ...prev,
        [todayKey]: {
          ...day,
          records: day.records.filter((r) => r.id !== id),
        },
      };
    });
    showToast('ลบรายการบันทึกแล้ว');
  };

  const handleSnooze = (minutes: number) => {
    const nextTime = Date.now() + minutes * 60 * 1000;
    setSettings((prev) => ({
      ...prev,
      nextReminderTimestamp: nextTime,
      snoozeCount: (prev.snoozeCount || 0) + 1,
    }));
    showToast(`เลื่อนการแจ้งเตือนออกไปอีก ${minutes} นาที`);
  };

  // Reset actions
  const handleResetToday = () => {
    if (window.confirm('คุณต้องการล้างประวัติการดื่มน้ำของวันนี้ทั้งหมดใช่หรือไม่?')) {
      setHistory((prev) => ({
        ...prev,
        [todayKey]: {
          targetMl: currentTargetMl,
          records: [],
        },
      }));
      setLastDrinkRecord(null);
      showToast('ล้างข้อมูลวันนี้เรียบร้อย');
    }
  };

  const handleResetAll = () => {
    if (window.confirm('คำเตือน: คุณต้องการลบข้อมูลสถิติและการตั้งค่าทั้งหมดใช่หรือไม่?')) {
      localStorage.clear();
      setProfile(DEFAULT_PROFILE);
      setSettings(DEFAULT_SETTINGS);
      setHistory({
        [todayKey]: { targetMl: 2000, records: [] },
      });
      showToast('รีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้น');
      setIsSettingsOpen(false);
    }
  };

  const handleExportData = () => {
    const data = {
      profile,
      settings,
      history,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquatrack_backup_${todayKey}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('ดาวน์โหลดไฟล์สำรองข้อมูลเรียบร้อย');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.history) setHistory(parsed.history);
        showToast('นำเข้าข้อมูลสำเร็จ');
        setIsSettingsOpen(false);
      } catch {
        alert('รูปแบบไฟล์ไม่ถูกต้อง โปรดเลือกไฟล์ JSON สำรองของ AquaTrack');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors">
      {/* 1. Top Bar Contract: 3 zones (Brand wordmark, Nav buttons, Primary action) */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Droplets className="w-5 h-5 fill-white/90" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                AquaTrack
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 dark:text-slate-400 font-normal">
                เตือนดื่มน้ำเพื่อสุขภาพ
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation / Functional Action Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="flex items-center gap-1.5 hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>คำนวณเป้าหมายส่วนตัว</span>
            </button>

            <button
              onClick={() => setIsTipsOpen(true)}
              className="flex items-center gap-1.5 hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>เกร็ดสุขภาพ & สีปัสสาวะ</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 hover:text-sky-600 dark:hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>ตั้งค่าระบบ</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary contextual action & theme switch */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={isDarkMode ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => handleAddDrink(250, 'water')}
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 active:scale-95 rounded-xl shadow-sm shadow-sky-600/20 transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>+ ดื่ม 250 มล.</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-3 fade-in duration-200">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-xl text-xs font-medium border border-slate-700 dark:border-slate-200">
            <Sparkles className="w-4 h-4 text-sky-400 dark:text-sky-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Container - Full 1440px desktop baseline, 2-column balanced layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Mobile Quick Action Strip (visible on mobile only) */}
        <div className="flex md:hidden items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setIsCalculatorOpen(true)}
            className="flex-1 py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap flex items-center justify-center gap-1.5"
          >
            <Calculator className="w-3.5 h-3.5 text-sky-500" />
            <span>คำนวณเป้าหมาย</span>
          </button>
          <button
            onClick={() => setIsTipsOpen(true)}
            className="flex-1 py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
            <span>เกร็ดความรู้</span>
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex-1 py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap flex items-center justify-center gap-1.5"
          >
            <SettingsIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>ตั้งค่า</span>
          </button>
        </div>

        {/* 2-Column Responsive Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (5 Cols on LG): Bottle Visual & Quick Logging Actions */}
          <div className="lg:col-span-5 space-y-6">
            <WaterBottleVisual
              currentMl={currentTotalMl}
              targetMl={currentTargetMl}
              glassCount={glassCount}
              lastAddedMl={lastAddedMl}
              onQuickAddDefault={() => handleAddDrink(250, 'water')}
            />

            <QuickDrinkButtons
              onAddDrink={handleAddDrink}
              canUndo={!!lastDrinkRecord}
              onUndo={handleUndo}
              lastAddedAmount={lastDrinkRecord?.amount || null}
            />
          </div>

          {/* Right Column (7 Cols on LG): Active Reminder, Stats & Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <ReminderCard
              settings={settings}
              onUpdateSettings={(newVals) => setSettings((s) => ({ ...s, ...newVals }))}
              onSnooze={handleSnooze}
            />

            <WeeklyStats
              history={history}
              targetMl={currentTargetMl}
            />

            <HydrationTimeline
              records={todayData.records}
              onDeleteRecord={handleDeleteRecord}
              currentMl={currentTotalMl}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <GoalCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        profile={profile}
        onSaveProfile={(newProf) => {
          setProfile(newProf);
          showToast(`ปรับปรุงเป้าหมายเป็น ${newProf.customGoalMl.toLocaleString()} มล. เรียบร้อย`);
        }}
      />

      <HydrationTipsModal
        isOpen={isTipsOpen}
        onClose={() => setIsTipsOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings((s) => ({ ...s, ...newVals }))}
        profile={profile}
        onUpdateProfile={(newProf) => setProfile((p) => ({ ...p, ...newProf }))}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onResetToday={handleResetToday}
        onResetAll={handleResetAll}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 py-6 px-4 bg-white/50 dark:bg-slate-900/50 mt-12 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-sky-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">AquaTrack</span>
            <span>·</span>
            <span>โปรแกรมเตือนดื่มน้ำเพื่อสุขภาพและสร้างสุขนิสัยที่ดี</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>ข้อมูลถูกบันทึกในอุปกรณ์ของคุณ (Local Storage) ปลอดภัย 100%</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
