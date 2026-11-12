import React, { useState, useEffect } from 'react';
import { Bell, BellRing, BellOff, Volume2, VolumeX, Play, Clock, Sparkles } from 'lucide-react';
import { ReminderSettings, SoundType } from '../types/water';
import { soundSynth } from '../utils/audio';
import { isNotificationSupported, getNotificationPermission, requestNotificationPermission, sendWaterNotification } from '../utils/notification';

interface ReminderCardProps {
  settings: ReminderSettings;
  onUpdateSettings: (newSettings: Partial<ReminderSettings>) => void;
  onSnooze: (minutes: number) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  settings,
  onUpdateSettings,
  onSnooze,
}) => {
  const [timeLeftStr, setTimeLeftStr] = useState<string>('--:--');
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>('default');
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  useEffect(() => {
    if (isNotificationSupported()) {
      setNotificationStatus(getNotificationPermission());
    }
  }, []);

  // Real-time countdown calculation
  useEffect(() => {
    if (!settings.enabled || !settings.nextReminderTimestamp) {
      setTimeLeftStr('--:--');
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = settings.nextReminderTimestamp! - now;

      if (diff <= 0) {
        setTimeLeftStr('ถึงเวลาดื่มน้ำแล้ว!');
        return;
      }

      const totalSecs = Math.floor(diff / 1000);
      const hours = Math.floor(totalSecs / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;

      if (hours > 0) {
        setTimeLeftStr(`${hours} ชม. ${mins} นาที`);
      } else {
        setTimeLeftStr(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} นาที`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [settings.enabled, settings.nextReminderTimestamp]);

  const handleToggleNotifications = async () => {
    if (!settings.browserNotificationEnabled) {
      const granted = await requestNotificationPermission();
      setNotificationStatus(getNotificationPermission());
      onUpdateSettings({ browserNotificationEnabled: granted });
      if (granted) {
        sendWaterNotification('💧 เปิดการแจ้งเตือนสำเร็จ', 'AquaTrack จะคอยเตือนให้คุณดื่มน้ำตรงเวลาตลอดวันครับ');
      }
    } else {
      onUpdateSettings({ browserNotificationEnabled: false });
    }
  };

  const handleTestAlert = () => {
    setIsPlayingPreview(true);
    if (settings.soundEnabled) {
      soundSynth.playSound(settings.soundType, settings.volume);
    }
    if (settings.browserNotificationEnabled) {
      sendWaterNotification(
        '💧 ทดสอบการเตือนดื่มน้ำ',
        'ระบบทำงานสมบูรณ์! เตรียมแก้วน้ำของคุณให้พร้อมสำหรับแก้วถัดไป'
      );
    }
    setTimeout(() => setIsPlayingPreview(false), 800);
  };

  const soundOptions: { id: SoundType; label: string }[] = [
    { id: 'drop', label: 'หยดน้ำธรรมชาติ' },
    { id: 'chime', label: 'กระดิ่งแก้วคริสตัล' },
    { id: 'bubble', label: 'ฟองน้ำสดชื่น' },
    { id: 'gentle', label: 'ทำนองนุ่มนวล' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      {/* Top Header & Master Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/40">
            {settings.enabled ? (
              <BellRing className="w-5 h-5 animate-pulse text-sky-600 dark:text-sky-400" />
            ) : (
              <BellOff className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              ระบบแจ้งเตือนดื่มน้ำ
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {settings.enabled ? 'เปิดใช้งานอยู่ตามกำหนดการ' : 'ปิดการแจ้งเตือนชั่วคราว'}
            </p>
          </div>
        </div>

        {/* Master Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => onUpdateSettings({ enabled: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
        </label>
      </div>

      {/* Countdown Display Card */}
      {settings.enabled && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-teal-500/10 dark:from-sky-950/40 dark:via-cyan-950/30 dark:to-teal-950/40 border border-sky-200/50 dark:border-sky-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
            <div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                เตือนครั้งถัดไปในอีก:
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-sky-700 dark:text-sky-300 tabular-nums">
                {timeLeftStr}
              </div>
            </div>
          </div>

          {/* Quick Snooze & Test */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onSnooze(10)}
              className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              เลื่อน 10 นาที
            </button>
            <button
              onClick={handleTestAlert}
              disabled={isPlayingPreview}
              className="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ทดสอบเตือน</span>
            </button>
          </div>
        </div>
      )}

      {/* Interval Selector */}
      <div>
        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
          ความถี่ในการแจ้งเตือน
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {[30, 45, 60, 90, 120].map((mins) => {
            const isSelected = settings.intervalMinutes === mins;
            return (
              <button
                key={mins}
                onClick={() => onUpdateSettings({ intervalMinutes: mins })}
                className={`py-2 px-1 text-center rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="tabular-nums font-bold text-sm">{mins}</div>
                <div className="text-[10px] opacity-80">นาที</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Hours Window & Sound Config */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Active Hours */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400 block">
            ช่วงเวลาที่ให้เตือน (ไม่รบกวนเวลานอน)
          </span>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={settings.startTime}
              onChange={(e) => onUpdateSettings({ startTime: e.target.value })}
              className="w-full px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-center"
            />
            <span className="text-xs text-slate-400">ถึง</span>
            <input
              type="time"
              value={settings.endTime}
              onChange={(e) => onUpdateSettings({ endTime: e.target.value })}
              className="w-full px-2 py-1.5 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-center"
            />
          </div>
        </div>

        {/* Sound Selection */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/70 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              เสียงเตือน
            </span>
            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              {settings.soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-sky-500" />
                  <span className="text-[11px] text-sky-600 dark:text-sky-400">เปิดเสียง</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px] text-slate-400">ปิดเสียง</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={settings.soundType}
              disabled={!settings.soundEnabled}
              onChange={(e) => {
                const newSound = e.target.value as SoundType;
                onUpdateSettings({ soundType: newSound });
                soundSynth.playSound(newSound, settings.volume);
              }}
              className="w-full px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg disabled:opacity-50"
            >
              {soundOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={!settings.soundEnabled}
              onClick={() => soundSynth.playSound(settings.soundType, settings.volume)}
              className="p-1.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
              title="ลองฟังเสียง"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Browser Notification Switch */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-slate-500" />
          <div>
            <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
              แจ้งเตือนผ่านหน้าต่างเบราว์เซอร์
            </div>
            <div className="text-[10px] text-slate-400">
              {notificationStatus === 'granted'
                ? 'อนุญาตการแจ้งเตือนแล้ว'
                : notificationStatus === 'denied'
                ? 'ถูกบล็อกในเบราว์เซอร์ (โปรดเปิดสิทธิ์ในการตั้งค่าเบราว์เซอร์)'
                : 'คลิกเปิดเพื่อรับการแจ้งเตือนขณะใช้แท็บอื่น'}
            </div>
          </div>
        </div>

        <button
          onClick={handleToggleNotifications}
          className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
            settings.browserNotificationEnabled
              ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          {settings.browserNotificationEnabled ? 'เปิดอยู่' : 'เปิดรับการเตือน'}
        </button>
      </div>
    </div>
  );
};
