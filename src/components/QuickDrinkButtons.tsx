import React, { useState } from 'react';
import { Plus, RotateCcw, Droplets, Leaf, Coffee, Citrus, Sparkles, Zap, SlidersHorizontal } from 'lucide-react';
import { DrinkType } from '../types/water';
import { DRINK_TYPES, PRESET_CUPS } from '../utils/constants';

interface QuickDrinkButtonsProps {
  onAddDrink: (amount: number, type: DrinkType, note?: string) => void;
  canUndo: boolean;
  onUndo: () => void;
  lastAddedAmount: number | null;
}

export const QuickDrinkButtons: React.FC<QuickDrinkButtonsProps> = ({
  onAddDrink,
  canUndo,
  onUndo,
  lastAddedAmount,
}) => {
  const [selectedDrinkType, setSelectedDrinkType] = useState<DrinkType>('water');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState<number>(300);
  const [customNote, setCustomNote] = useState<string>('');

  const currentTypeConfig = DRINK_TYPES.find((d) => d.id === selectedDrinkType) || DRINK_TYPES[0];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAmount > 0) {
      onAddDrink(customAmount, selectedDrinkType, customNote.trim() || undefined);
      setIsCustomModalOpen(false);
      setCustomNote('');
    }
  };

  const getDrinkIcon = (id: DrinkType) => {
    switch (id) {
      case 'water':
        return <Droplets className="w-4 h-4" />;
      case 'mineral':
        return <Sparkles className="w-4 h-4" />;
      case 'tea':
        return <Leaf className="w-4 h-4" />;
      case 'juice':
        return <Citrus className="w-4 h-4" />;
      case 'coffee':
        return <Coffee className="w-4 h-4" />;
      case 'electrolyte':
        return <Zap className="w-4 h-4" />;
      default:
        return <Droplets className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      {/* Top Header with Undo if available */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            บันทึกการดื่มน้ำ
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            แตะเพื่อเพิ่มปริมาณน้ำที่ดื่มทันที
          </p>
        </div>

        {canUndo && (
          <button
            onClick={onUndo}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl transition-colors cursor-pointer border border-rose-200/60 dark:border-rose-900/60"
            title="ยกเลิกการบันทึกล่าสุด"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ยกเลิกล่าสุด ({lastAddedAmount} มล.)</span>
          </button>
        )}
      </div>

      {/* Drink Type Selector Bar */}
      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          เลือกประเภทเครื่องดื่ม
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {DRINK_TYPES.map((dt) => {
            const isSelected = selectedDrinkType === dt.id;
            return (
              <button
                key={dt.id}
                onClick={() => setSelectedDrinkType(dt.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all cursor-pointer min-h-[58px] ${
                  isSelected
                    ? `${dt.bgColor} ring-2 ring-sky-500/50 shadow-sm`
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="mb-1">{getDrinkIcon(dt.id)}</div>
                <span className="text-[11px] font-medium leading-tight whitespace-nowrap">
                  {dt.label.split(' ')[0]}
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 tabular-nums">
                  {Math.round(dt.hydrationRate * 100)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Amount Grid */}
      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          ขนาดแก้ว / ปริมาณ
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESET_CUPS.map((cup) => (
            <button
              key={cup.amount}
              onClick={() => onAddDrink(cup.amount, selectedDrinkType)}
              className="flex flex-col items-center justify-center p-3.5 bg-gradient-to-b from-sky-50/70 to-slate-50 dark:from-slate-800/80 dark:to-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-600 rounded-2xl text-slate-800 dark:text-slate-200 active:scale-95 transition-all shadow-xs cursor-pointer group"
            >
              <div className="flex items-center gap-1 text-sky-600 dark:text-sky-400 mb-1 group-hover:scale-110 transition-transform">
                <Plus className="w-3.5 h-3.5" />
                <span className="text-lg font-bold tabular-nums">{cup.amount}</span>
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">มล.</span>
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {cup.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Amount Button */}
      <button
        onClick={() => setIsCustomModalOpen(true)}
        className="w-full py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer border border-dashed border-slate-300 dark:border-slate-700"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>กำหนดปริมาณเอง (มิลลิลิตร)</span>
      </button>

      {/* Custom Amount Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              กำหนดปริมาณน้ำเอง
            </h3>
            
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  ปริมาณ (มิลลิลิตร)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="10"
                    max="2000"
                    step="10"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-lg font-bold tabular-nums text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <span className="text-sm text-slate-500 font-medium">มล.</span>
                </div>
              </div>

              {/* Slider for quick adjustments */}
              <div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 tabular-nums">
                  <span>50 มล.</span>
                  <span>500 มล.</span>
                  <span>1,000 มล.</span>
                  <span>1,500 มล.</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  บันทึกโน้ตสั้นๆ (ไม่บังคับ)
                </label>
                <input
                  type="text"
                  placeholder="เช่น หลังวิ่ง, ดื่มคู่กับยา"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  maxLength={40}
                  className="w-full px-3 py-2 text-xs text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  บันทึก {customAmount} มล.
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
