import React, { useState } from 'react';
import { UserProfile } from '../types/water';
import { calculateRecommendedWater } from '../utils/constants';
import { Scale, Activity, Sun, Check, X, Info } from 'lucide-react';

interface GoalCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const GoalCalculatorModal: React.FC<GoalCalculatorModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [weightKg, setWeightKg] = useState<number>(profile.weightKg || 60);
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active'>(
    profile.activityLevel || 'moderate'
  );
  const [hotWeather, setHotWeather] = useState<boolean>(profile.hotWeather || false);
  const [useCustom, setUseCustom] = useState<boolean>(false);
  const [customGoal, setCustomGoal] = useState<number>(profile.customGoalMl || 2000);

  if (!isOpen) return null;

  const calculatedMl = calculateRecommendedWater(weightKg, activityLevel, hotWeather);
  const finalGoal = useCustom ? customGoal : calculatedMl;

  const handleSave = () => {
    onSaveProfile({
      weightKg,
      activityLevel,
      hotWeather,
      customGoalMl: finalGoal,
      glassSizeMl: profile.glassSizeMl || 250,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-50 dark:bg-sky-950/50 rounded-xl text-sky-600 dark:text-sky-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                คำนวณเป้าหมายดื่มน้ำส่วนตัว
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ตามเกณฑ์มาตรฐานกรมอนามัย (น้ำหนักตัว × 33 มล.)
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

        {/* Calculation Inputs */}
        <div className="space-y-4">
          {/* Weight Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-sky-500" />
                น้ำหนักตัวของคุณ
              </span>
              <span className="text-sm font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                {weightKg} กก.
              </span>
            </div>
            <input
              type="range"
              min="35"
              max="140"
              step="1"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 tabular-nums">
              <span>35 กก.</span>
              <span>60 กก.</span>
              <span>90 กก.</span>
              <span>140 กก.</span>
            </div>
          </div>

          {/* Activity Level */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Activity className="w-4 h-4 text-emerald-500" />
              ระดับการออกกำลังกาย / กิจกรรม
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sedentary', label: 'นั่งโต๊ะ / น้อย', add: '+0 มล.' },
                { id: 'moderate', label: 'ปานกลาง / เดินบ่อย', add: '+350 มล.' },
                { id: 'active', label: 'ออกกำลังกายหนัก', add: '+600 มล.' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setActivityLevel(lvl.id as 'sedentary' | 'moderate' | 'active')}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    activityLevel === lvl.id
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 text-sky-700 dark:text-sky-300 font-semibold'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[11px] leading-tight">{lvl.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{lvl.add}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Weather checkbox */}
          <label className="flex items-center gap-3 p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={hotWeather}
              onChange={(e) => setHotWeather(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 accent-amber-500 w-4 h-4 cursor-pointer"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1 text-xs font-semibold text-amber-800 dark:text-amber-300">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>วันอากาศร้อนจัด / อยู่กลางแจ้ง (+300 มล.)</span>
              </div>
              <div className="text-[10px] text-amber-700/70 dark:text-amber-400/80">
                ช่วยชดเชยการสูญเสียเหงื่อในสภาพอากาศเมืองไทย
              </div>
            </div>
          </label>

          {/* Or Direct Custom Override */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500 accent-sky-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span>กำหนดเป้าหมายเองตามใจชอบ</span>
              </label>
            </div>

            {useCustom && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1000"
                  max="4500"
                  step="50"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl tabular-nums"
                />
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">มล. / วัน</span>
              </div>
            )}
          </div>
        </div>

        {/* Calculated Result Banner */}
        <div className="p-4 bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-emerald-500/10 rounded-2xl border border-sky-200/60 dark:border-sky-800/40 text-center">
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            เป้าหมายที่แนะนำสำหรับคุณ
          </div>
          <div className="text-3xl font-extrabold text-sky-700 dark:text-sky-300 tabular-nums my-1">
            {finalGoal.toLocaleString()}{' '}
            <span className="text-base font-medium text-slate-500">มล. / วัน</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            เทียบเท่าประมาณ <strong className="text-slate-700 dark:text-slate-200">{Math.round(finalGoal / 250)}</strong> แก้วมาตรฐาน (250 มล.)
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-md shadow-sky-500/20 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>ใช้เป้าหมาย {finalGoal.toLocaleString()} มล.</span>
          </button>
        </div>
      </div>
    </div>
  );
};
