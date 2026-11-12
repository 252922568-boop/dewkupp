import { DrinkTypeConfig, DrinkType } from '../types/water';

export const DRINK_TYPES: DrinkTypeConfig[] = [
  {
    id: 'water',
    label: 'น้ำเปล่า',
    sublabel: 'บริสุทธิ์ 100%',
    iconName: 'Droplet',
    hydrationRate: 1.0,
    color: '#0284c7', // sky-600
    bgColor: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800',
  },
  {
    id: 'mineral',
    label: 'น้ำแร่',
    sublabel: 'แร่ธาตุ 100%',
    iconName: 'Sparkles',
    hydrationRate: 1.0,
    color: '#0d9488', // teal-600
    bgColor: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  },
  {
    id: 'tea',
    label: 'ชาสมุนไพร / ชาเขียว',
    sublabel: 'ให้ความชุ่มชื้น 90%',
    iconName: 'Leaf',
    hydrationRate: 0.9,
    color: '#16a34a', // green-600
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  },
  {
    id: 'juice',
    label: 'น้ำผลไม้สด',
    sublabel: 'วิตามิน 85%',
    iconName: 'Citrus',
    hydrationRate: 0.85,
    color: '#ea580c', // orange-600
    bgColor: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  },
  {
    id: 'coffee',
    label: 'กาแฟ / ชาดำ',
    sublabel: 'ให้ความชุ่มชื้น 80%',
    iconName: 'Coffee',
    hydrationRate: 0.8,
    color: '#b45309', // amber-700
    bgColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  },
  {
    id: 'electrolyte',
    label: 'เกลือแร่ / ไอโซโทนิก',
    sublabel: 'ดูดซึมเร็ว 95%',
    iconName: 'Zap',
    hydrationRate: 0.95,
    color: '#6366f1', // indigo-500
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  },
];

export const PRESET_CUPS = [
  { amount: 150, label: 'แก้วเล็ก', icon: 'CupSoda' },
  { amount: 250, label: 'แก้วมาตรฐาน', icon: 'Coffee' },
  { amount: 350, label: 'แก้วใหญ่', icon: 'Milk' },
  { amount: 500, label: 'ขวดพกพา', icon: 'Wine' },
];

export interface HydrationScheduleSlot {
  time: string;
  title: string;
  description: string;
  targetMl: number;
}

export const GOLDEN_SCHEDULE: HydrationScheduleSlot[] = [
  {
    time: '07:00 - 07:30',
    title: 'แก้วที่ 1: ตื่นนอนตอนเช้า',
    description: 'ปลุกอวัยวะภายใน กระตุ้นการขับถ่าย และเติมน้ำหลังหลับ 6-8 ชม.',
    targetMl: 250,
  },
  {
    time: '08:30 - 09:00',
    title: 'แก้วที่ 2: เริ่มต้นเช้าวันใหม่',
    description: 'หลังอาหารเช้า 30 นาที ช่วยระบบย่อยและเพิ่มออกซิเจนให้สมอง',
    targetMl: 250,
  },
  {
    time: '10:30 - 11:00',
    title: 'แก้วที่ 3: ช่วงสายผ่อนคลาย',
    description: 'พักสายตา ลดความตึงเครียด เติมความสดชื่นแก้อ่อนเพลีย',
    targetMl: 250,
  },
  {
    time: '12:30 - 13:00',
    title: 'แก้วที่ 4: หลังอาหารกลางวัน',
    description: 'ช่วยให้สารอาหารดูดซึมได้ดี ป้องกันอาการเลือดข้นเหนียว',
    targetMl: 250,
  },
  {
    time: '14:30 - 15:00',
    title: 'แก้วที่ 5: บ่ายสดชื่น',
    description: 'ไล่อาการง่วงช่วงบ่าย เติมพลังงานให้เซลล์ในร่างกาย',
    targetMl: 250,
  },
  {
    time: '16:30 - 17:00',
    title: 'แก้วที่ 6: เลิกงาน / ก่อนกลับบ้าน',
    description: 'เตรียมพร้อมสำหรับช่วงเย็นหรือการออกกำลังกายเบาๆ',
    targetMl: 250,
  },
  {
    time: '19:00 - 19:30',
    title: 'แก้วที่ 7: มื้อค่ำผ่อนคลาย',
    description: 'หลังอาหารเย็น ช่วยให้ระบบไหลเวียนโลหิตทำงานราบรื่น',
    targetMl: 250,
  },
  {
    time: '21:00 - 21:30',
    title: 'แก้วที่ 8: ก่อนนอน 1 ชม.',
    description: 'จิบเบาๆ ป้องกันภาวะขาดน้ำขณะหลับ หลีกเลี่ยงดื่มเยอะก่อนนอน',
    targetMl: 200,
  },
];

export function getTodayKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateThai(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  const thaiDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
  return `${thaiDays[date.getDay()]} ${d} ${thaiMonths[date.getMonth()]}`;
}

export function calculateRecommendedWater(weightKg: number, activityLevel: 'sedentary' | 'moderate' | 'active', hotWeather: boolean): number {
  // กรมอนามัย: น้ำหนัก (กก.) × 33 มล.
  let base = Math.round(weightKg * 33);
  if (base < 1200) base = 1200;

  if (activityLevel === 'moderate') {
    base += 350;
  } else if (activityLevel === 'active') {
    base += 600;
  }

  if (hotWeather) {
    base += 300;
  }

  // Round to nearest 50 ml
  return Math.round(base / 50) * 50;
}
