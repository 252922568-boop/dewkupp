import React from 'react';
import { X, Heart, Brain, Sparkles, AlertCircle, Droplets } from 'lucide-react';

interface HydrationTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HydrationTipsModal: React.FC<HydrationTipsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const urineChart = [
    {
      level: 'ดีเยี่ยม',
      color: '#fef08a',
      colorClass: 'bg-yellow-100 border-yellow-200 text-yellow-800',
      title: 'สีเหลืองใส / อ่อนมาก',
      status: 'ร่างกายชุ่มชื้นดีมาก ดื่มน้ำอย่างเพียงพอ',
    },
    {
      level: 'ปกติ',
      color: '#fde047',
      colorClass: 'bg-yellow-200 border-yellow-300 text-yellow-900',
      title: 'สีเหลืองฟางข้าว',
      status: 'ระดับน้ำในร่างกายสมดุล สุขภาพปกติ',
    },
    {
      level: 'ควรระวัง',
      color: '#eab308',
      colorClass: 'bg-amber-300 border-amber-400 text-amber-950',
      title: 'สีเหลืองเข้ม',
      status: 'เริ่มมีภาวะขาดน้ำ ควรดื่มน้ำ 1-2 แก้วในทันที',
    },
    {
      level: 'ขาดน้ำ',
      color: '#b45309',
      colorClass: 'bg-amber-600 border-amber-700 text-white',
      title: 'สีอำพัน หรือสีน้ำชาเข้ม',
      status: 'ร่างกายขาดน้ำรุนแรง อาจมีอาการวิงเวียน อ่อนเพลีย',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-50 dark:bg-sky-950/50 rounded-xl text-sky-600 dark:text-sky-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                เกร็ดความรู้ & ประโยชน์การดื่มน้ำ
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                วิธีดูแลร่างกายให้อิ่มน้ำและสุขภาพดีในทุกวัน
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

        {/* 4 Key Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-sky-50/60 dark:bg-sky-950/30 rounded-2xl border border-sky-100 dark:border-sky-900/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-800 dark:text-sky-300">
              <Brain className="w-4 h-4 text-sky-600" />
              <span>สมองปลอดโปร่ง ไม่ล้าง่าย</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              น้ำเป็นส่วนประกอบ 75% ของสมอง การดื่มน้ำสม่ำเสมอช่วยเพิ่มสมาธิ ลดอาการปวดหัวไมเกรน และบรรเทาความเครียด
            </p>
          </div>

          <div className="p-3 bg-pink-50/60 dark:bg-pink-950/30 rounded-2xl border border-pink-100 dark:border-pink-900/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-800 dark:text-pink-300">
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span>ผิวพรรณชุ่มชื้น กระจ่างใส</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              ช่วยผลัดเซลล์ผิว ขับสารพิษผ่านต่อมเหงื่อ ป้องกันผิวแห้งกร้าน และชะลอการเกิดริ้วรอยก่อนวัย
            </p>
          </div>

          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <Heart className="w-4 h-4 text-emerald-600" />
              <span>ระบบย่อยและไตทำงานคล่อง</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              ป้องกันอาการท้องผูก ละลายแร่ธาตุส่วนเกินในไต ลดโอกาสเกิดโรคนิ่วในทางเดินปัสสาวะ
            </p>
          </div>

          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/30 rounded-2xl border border-amber-100 dark:border-amber-900/40 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>ลดความอยากอาหารจุกจิก</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              บ่อยครั้งที่สมองสับสนระหว่าง "หิวน้ำ" กับ "หิวข้าว" การจิบน้ำ 1 แก้วก่อนมื้ออาหาร 30 นาทีช่วยคุมน้ำหนักได้ดี
            </p>
          </div>
        </div>

        {/* Urine Color Hydration Scale */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
              ชาร์ตสังเกตสีปัสสาวะ (ประเมินระดับน้ำในร่างกาย)
            </h4>
            <span className="text-[10px] text-slate-400">เช็กได้ทุกวัน</span>
          </div>

          <div className="space-y-1.5">
            {urineChart.map((u) => (
              <div
                key={u.level}
                className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
              >
                <div
                  className="w-5 h-5 rounded-full shrink-0 shadow-inner border border-black/10"
                  style={{ backgroundColor: u.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {u.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white dark:bg-slate-700 text-slate-500 font-medium">
                      {u.level}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {u.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Tips */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
            💡 คำแนะนำการดื่มน้ำที่ถูกต้อง:
          </span>
          <p className="text-[11px] leading-relaxed">
            • ควร <strong>จิบทีละน้อยตลอดทั้งวัน</strong> มากกว่าการดื่มรวดเดียวปริมาณมากๆ
          </p>
          <p className="text-[11px] leading-relaxed">
            • น้ำอุณหภูมิห้องเป็นมิตรต่อระบบทางเดินอาหารและการดูดซึมมากที่สุด
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition-colors cursor-pointer"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
};
