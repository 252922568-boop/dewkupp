import React from 'react';
import { DrinkRecord } from '../types/water';
import { DRINK_TYPES, GOLDEN_SCHEDULE } from '../utils/constants';
import { Trash2, Clock, Check, Droplets } from 'lucide-react';

interface HydrationTimelineProps {
  records: DrinkRecord[];
  onDeleteRecord: (id: string) => void;
  currentMl: number;
}

export const HydrationTimeline: React.FC<HydrationTimelineProps> = ({
  records,
  onDeleteRecord,
  currentMl,
}) => {
  const sortedRecords = [...records].sort((a, b) => b.timestamp - a.timestamp);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} น.`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
      {/* Tab Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            บันทึกประจำวัน
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ประวัติการดื่มน้ำวันนี้ทั้งหมด ({records.length} ครั้ง)
          </p>
        </div>
        <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/50 px-2.5 py-1 rounded-full border border-sky-200/50 dark:border-sky-800/40 tabular-nums">
          รวม {currentMl.toLocaleString()} มล.
        </span>
      </div>

      {/* Today's Drink Logs */}
      {sortedRecords.length === 0 ? (
        <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <Droplets className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            ยังไม่มีบันทึกการดื่มน้ำสำหรับวันนี้
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            กดปุ่มขนาดแก้วด้านบนเพื่อเริ่มบันทึกแก้วแรก
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {sortedRecords.map((item) => {
            const typeConfig = DRINK_TYPES.find((d) => d.id === item.drinkType) || DRINK_TYPES[0];
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: `${typeConfig.color}15`, color: typeConfig.color }}
                  >
                    {item.amount >= 500 ? 'ขวด' : 'แก้ว'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {typeConfig.label}
                      </span>
                      <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 tabular-nums">
                        +{item.amount} มล.
                      </span>
                      {item.effectiveHydration !== item.amount && (
                        <span className="text-[10px] text-slate-400 tabular-nums">
                          (ชุ่มชื้น ~{Math.round(item.effectiveHydration)} มล.)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(item.timestamp)}
                      </span>
                      {item.note && (
                        <>
                          <span>·</span>
                          <span className="truncate max-w-[140px] text-slate-500 dark:text-slate-400">
                            {item.note}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteRecord(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                  title="ลบรายการนี้"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Golden Drinking Schedule Guide */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
          <span>ช่วงเวลาทองของการดื่มน้ำ (8 แก้วต่อวัน)</span>
          <span className="text-[11px] text-slate-400 font-normal">แนวทางกรมอนามัย</span>
        </h4>

        <div className="space-y-1.5">
          {GOLDEN_SCHEDULE.map((slot, index) => {
            // Check if user has drunk at least (index + 1) * 250 ml today
            const isCovered = currentMl >= (index + 1) * 240;
            return (
              <div
                key={slot.time}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                  isCovered
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-200'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      isCovered
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px]'
                    }`}
                  >
                    {isCovered ? <Check className="w-3 h-3 stroke-[3]" /> : index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-[11px]">
                      {slot.title}{' '}
                      <span className="text-[10px] font-normal opacity-75">({slot.time})</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {slot.description}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tabular-nums shrink-0 ml-2">
                  {slot.targetMl} มล.
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
