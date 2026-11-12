import React from 'react';
import { X, Settings, RotateCcw, Download, Upload, Volume2, Moon, Sun, Trash2 } from 'lucide-react';
import { ReminderSettings, UserProfile } from '../types/water';
import { soundSynth } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReminderSettings;
  onUpdateSettings: (newSettings: Partial<ReminderSettings>) => void;
  profile: UserProfile;
  onUpdateProfile: (newProfile: Partial<UserProfile>) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onResetToday: () => void;
  onResetAll: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  profile,
  onUpdateProfile,
  isDarkMode,
  onToggleDarkMode,
  onResetToday,
  onResetAll,
  onExportData,
  onImportData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ตั้งค่าระบบ & ปรับแต่ง
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ปรับแต่งเสียง ธีม และการจัดการข้อมูล
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Groups */}
        <div className="space-y-4">
          {/* Theme Switch */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              {isDarkMode ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  โหมดแสดงผล (Theme)
                </span>
                <span className="text-[10px] text-slate-400">
                  {isDarkMode ? 'โหมดมืด (Dark Mode)' : 'โหมดสว่าง (Light Mode)'}
                </span>
              </div>
            </div>
            <button
              onClick={onToggleDarkMode}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 cursor-pointer"
            >
              สลับเป็น {isDarkMode ? 'โหมดสว่าง' : 'โหมดมืด'}
            </button>
          </div>

          {/* Sound Volume Slider */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                <Volume2 className="w-4 h-4 text-sky-500" />
                ระดับความดังเสียงเตือน
              </span>
              <span className="font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                {Math.round(settings.volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={settings.volume}
              onChange={(e) => {
                const vol = Number(e.target.value);
                onUpdateSettings({ volume: vol });
              }}
              onMouseUp={() => soundSynth.playSound(settings.soundType, settings.volume)}
              onTouchEnd={() => soundSynth.playSound(settings.soundType, settings.volume)}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Daily Goal Quick Set */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                เป้าหมายดื่มน้ำต่อวัน
              </span>
              <span className="font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                {profile.customGoalMl || 2000} มล.
              </span>
            </div>
            <input
              type="range"
              min="1200"
              max="4000"
              step="100"
              value={profile.customGoalMl || 2000}
              onChange={(e) => onUpdateProfile({ customGoalMl: Number(e.target.value) })}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 tabular-nums">
              <span>1,200 มล.</span>
              <span>2,000 มล.</span>
              <span>3,000 มล.</span>
              <span>4,000 มล.</span>
            </div>
          </div>

          {/* Data Backup & Restore */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
              สำรองและกู้คืนข้อมูล
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onExportData}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ส่งออกข้อมูล (JSON)</span>
              </button>

              <label className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-medium transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>นำเข้าข้อมูล</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportData}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Danger Zone: Resets */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 block">
              การรีเซ็ตข้อมูล
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onResetToday}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200/80 dark:border-rose-900/60 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>ล้างข้อมูลวันนี้</span>
              </button>

              <button
                onClick={onResetAll}
                className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200/80 dark:border-rose-900/60 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ล้างประวัติทั้งหมด</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 rounded-xl transition-colors cursor-pointer"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </div>
  );
};
