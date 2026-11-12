import React, { useMemo } from 'react';
import { DailyHydrationData } from '../types/water';
import { formatDateThai } from '../utils/constants';
import { Award, Flame, TrendingUp, CheckCircle } from 'lucide-react';

interface WeeklyStatsProps {
  history: DailyHydrationData;
  targetMl: number;
}

export const WeeklyStats: React.FC<WeeklyStatsProps> = ({ history, targetMl }) => {
  // Generate last 7 days array
  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const key = `${y}-${m}-${day}`;
      const dayData = history[key];
      const totalMl = dayData ? dayData.records.reduce((sum, r) => sum + r.amount, 0) : 0;
      const dayTarget = dayData?.targetMl || targetMl || 2000;
      const percent = Math.min(100, Math.round((totalMl / dayTarget) * 100));

      days.push({
        key,
        date: d,
        formattedDate: formatDateThai(key),
        totalMl,
        dayTarget,
        percent,
        isToday: i === 0,
      });
    }
    return days;
  }, [history, targetMl]);

  // Streak calculation: count backward from today or yesterday
  const streak = useMemo(() => {
    let count = 0;
    const sortedDates = Object.keys(history).sort().reverse();
    for (const k of sortedDates) {
      const data = history[k];
      const total = data.records.reduce((s, r) => s + r.amount, 0);
      if (total >= (data.targetMl || 2000)) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }, [history]);

  // Average intake in last 7 days
  const averageMl = useMemo(() => {
    const nonZero = last7Days.filter((d) => d.totalMl > 0);
    if (nonZero.length === 0) return 0;
    const sum = nonZero.reduce((acc, d) => acc + d.totalMl, 0);
    return Math.round(sum / nonZero.length);
  }, [last7Days]);

  const maxDay = useMemo(() => {
    return Math.max(...last7Days.map((d) => d.totalMl), 2000);
  }, [last7Days]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            สถิติการดื่ม 7 วันย้อนหลัง
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            แนวโน้มและความสม่ำเสมอในการดื่มน้ำ
          </p>
        </div>

        {streak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded-full border border-amber-200/70 dark:border-amber-800/70 text-xs font-semibold">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>ติดต่อกัน {streak} วัน</span>
          </div>
        )}
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">เฉลี่ยต่อวัน</div>
          <div className="text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums mt-0.5">
            {averageMl.toLocaleString()} <span className="text-xs font-normal text-slate-400">มล.</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">เป้าหมายปัจจุบัน</div>
          <div className="text-base font-bold text-sky-600 dark:text-sky-400 tabular-nums mt-0.5">
            {targetMl.toLocaleString()} <span className="text-xs font-normal text-slate-400">มล.</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">ความต่อเนื่อง</div>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5 flex items-center justify-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>{streak} วัน</span>
          </div>
        </div>
      </div>

      {/* 7-Day Bar Chart */}
      <div className="pt-2">
        <div className="h-40 flex items-end justify-between gap-2 px-1">
          {last7Days.map((day) => {
            const heightPercent = maxDay > 0 ? Math.min(100, Math.round((day.totalMl / maxDay) * 100)) : 0;
            const isMet = day.totalMl >= day.dayTarget && day.totalMl > 0;

            return (
              <div key={day.key} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip on hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap z-20 shadow-md">
                  {day.formattedDate}: {day.totalMl.toLocaleString()} มล. ({day.percent}%)
                </div>

                {/* Bar Value Indicator */}
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mb-1 tabular-nums">
                  {day.totalMl > 0 ? `${Math.round(day.totalMl / 100) / 10}L` : '0'}
                </span>

                {/* Animated Pillar Container */}
                <div className="w-full max-w-[28px] bg-slate-100 dark:bg-slate-800 rounded-t-lg h-28 relative overflow-hidden flex items-end">
                  {/* Goal threshold indicator line */}
                  <div
                    className="absolute left-0 right-0 border-b border-dashed border-slate-400/50 dark:border-slate-500/50 z-10"
                    style={{
                      bottom: `${Math.min(100, (day.dayTarget / maxDay) * 100)}%`,
                    }}
                    title="เป้าหมาย"
                  />

                  {/* Fill bar */}
                  <div
                    className={`w-full rounded-t-md transition-all duration-700 ${
                      isMet
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                        : day.isToday
                        ? 'bg-gradient-to-t from-sky-600 to-cyan-400'
                        : 'bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-600 dark:to-slate-500'
                    }`}
                    style={{ height: `${Math.max(4, heightPercent)}%` }}
                  />
                </div>

                {/* Day of Week Label */}
                <span
                  className={`text-[10px] font-medium mt-2 whitespace-nowrap ${
                    day.isToday
                      ? 'text-sky-600 dark:text-sky-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {day.formattedDate.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-2 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />
            <span>บรรลุเป้าหมาย</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" />
            <span>วันนี้</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 border-b border-dashed border-slate-400 inline-block" />
            <span>เส้นเป้าหมาย</span>
          </div>
        </div>
      </div>
    </div>
  );
};
