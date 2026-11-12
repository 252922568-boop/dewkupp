import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Droplet, Sparkles, CheckCircle2 } from 'lucide-react';

interface WaterBottleVisualProps {
  currentMl: number;
  targetMl: number;
  glassCount: number;
  lastAddedMl: number | null;
  onQuickAddDefault: () => void;
}

export const WaterBottleVisual: React.FC<WaterBottleVisualProps> = ({
  currentMl,
  targetMl,
  glassCount,
  lastAddedMl,
  onQuickAddDefault,
}) => {
  const percentage = Math.min(100, Math.round((currentMl / (targetMl || 2000)) * 100));
  const remainingMl = Math.max(0, targetMl - currentMl);
  const isGoalReached = currentMl >= targetMl && targetMl > 0;

  // Wave height calculation: 0% is bottom (y=100), 100% is top (y=0)
  const fillHeightPercent = Math.max(4, Math.min(100, percentage));

  // Visual status message
  const statusMessage = useMemo(() => {
    if (percentage === 0) return 'ยังไม่ได้เริ่มดื่มน้ำวันนี้';
    if (percentage < 30) return 'เริ่มต้นวันสดใส ดื่มน้ำแก้วแรกกัน';
    if (percentage < 60) return 'กำลังไปได้สวย ดื่มน้ำสม่ำเสมอนะครับ';
    if (percentage < 100) return `อีกเพียง ${remainingMl.toLocaleString()} มล. จะครบเป้าหมาย`;
    return 'ยินดีด้วย! ดื่มน้ำครบตามเป้าหมายของวันนี้แล้ว 🎉';
  }, [percentage, remainingMl]);

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Background ambient radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-25 transition-all duration-700"
        style={{
          background: isGoalReached
            ? 'radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.25) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 40%, rgba(14, 165, 233, 0.25) 0%, transparent 70%)',
        }}
      />

      {/* Floating droplet animation feedback */}
      <AnimatePresence>
        {lastAddedMl && (
          <motion.div
            key={Date.now()}
            initial={{ opacity: 0, y: -20, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 1.2 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute top-4 right-6 z-20 flex items-center gap-1.5 px-3 py-1 bg-sky-500 text-white text-xs font-semibold rounded-full shadow-md shadow-sky-500/20"
          >
            <Droplet className="w-3.5 h-3.5 fill-white" />
            <span>+{lastAddedMl} มล.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Hydration Bottle / Tumbler Visualization */}
      <div className="relative w-48 sm:w-56 h-64 sm:h-72 my-2 flex items-center justify-center">
        {/* SVG Bottle Silhouette with Clipping Mask */}
        <svg
          viewBox="0 0 200 260"
          className="w-full h-full drop-shadow-xl select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Bottle Clip Path */}
            <clipPath id="bottleClip">
              {/* Bottle Cap */}
              <rect x="70" y="8" width="60" height="14" rx="4" />
              {/* Bottle Neck */}
              <path d="M78 22 H122 V38 C122 46 142 56 150 72 V230 C150 244 140 252 126 252 H74 C60 252 50 244 50 230 V72 C58 56 78 46 78 38 Z" />
            </clipPath>

            {/* Linear gradient for water body */}
            <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <linearGradient id="goalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="60%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Wave Pattern 1 */}
            <pattern id="wavePattern1" width="160" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 0 10 Q 40 0 80 10 T 160 10 V 20 H 0 Z"
                fill={isGoalReached ? 'url(#goalGradient)' : 'url(#waterGradient)'}
                opacity="0.9"
              />
            </pattern>
          </defs>

          {/* Bottle Outer Glass Outline (Background layer) */}
          <path
            d="M78 22 H122 V38 C122 46 142 56 150 72 V230 C150 244 140 252 126 252 H74 C60 252 50 244 50 230 V72 C58 56 78 46 78 38 Z"
            className="fill-slate-100/70 dark:fill-slate-800/60 stroke-slate-300 dark:stroke-slate-700"
            strokeWidth="2.5"
          />

          {/* Bottle Cap */}
          <rect
            x="70"
            y="8"
            width="60"
            height="14"
            rx="4"
            className="fill-slate-300 dark:fill-slate-600 stroke-slate-400 dark:stroke-slate-500"
            strokeWidth="1.5"
          />
          {/* Cap grip ribs */}
          <line x1="85" y1="11" x2="85" y2="19" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
          <line x1="100" y1="11" x2="100" y2="19" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />
          <line x1="115" y1="11" x2="115" y2="19" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="1.5" />

          {/* Liquid content group with clipping */}
          <g clipPath="url(#bottleClip)">
            {/* Water base rectangle with dynamic height */}
            <motion.rect
              x="40"
              width="120"
              initial={false}
              animate={{
                y: 252 - (fillHeightPercent * 2.15),
                height: fillHeightPercent * 2.15 + 20,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              fill={isGoalReached ? 'url(#goalGradient)' : 'url(#waterGradient)'}
            />

            {/* Animated Front Waves */}
            <motion.g
              initial={false}
              animate={{
                y: 252 - (fillHeightPercent * 2.15) - 8,
              }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <g className="animate-wave-fast">
                <path
                  d="M -100 8 C -50 0 0 16 50 8 C 100 0 150 16 200 8 C 250 0 300 16 350 8 V 40 H -100 Z"
                  fill={isGoalReached ? '#6ee7b7' : '#7dd3fc'}
                  opacity="0.45"
                />
              </g>
              <g className="animate-wave-slow">
                <path
                  d="M -100 6 C -50 14 0 0 50 6 C 100 14 150 0 200 6 C 250 14 300 0 350 6 V 40 H -100 Z"
                  fill={isGoalReached ? '#34d399' : '#38bdf8'}
                  opacity="0.6"
                />
              </g>
            </motion.g>

            {/* Rising Bubbles inside water */}
            {percentage > 5 && (
              <>
                <circle cx="85" cy="190" r="2.5" fill="#ffffff" opacity="0.6" className="animate-bounce" />
                <circle cx="115" cy="160" r="3" fill="#ffffff" opacity="0.5" className="animate-pulse" />
                <circle cx="95" cy="130" r="2" fill="#ffffff" opacity="0.7" />
                <circle cx="125" cy="210" r="2.5" fill="#ffffff" opacity="0.4" />
              </>
            )}

            {/* Measurement Gauge lines on glass */}
            <line x1="56" y1="90" x2="68" y2="90" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            <line x1="56" y1="130" x2="64" y2="130" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
            <line x1="56" y1="170" x2="68" y2="170" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            <line x1="56" y1="210" x2="64" y2="210" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          </g>

          {/* Glass specular highlight shine */}
          <path
            d="M 62 76 C 60 90 60 215 62 230"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>

        {/* Central percentage readout with badge */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-6">
          <div className="text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/60 dark:border-slate-700/60 shadow-lg">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {percentage}%
            </span>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {currentMl.toLocaleString()} / {targetMl.toLocaleString()} มล.
            </div>
          </div>
        </div>
      </div>

      {/* Status indicator row */}
      <div className="text-center mt-2 space-y-1">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5">
          {isGoalReached ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
          )}
          <span>{statusMessage}</span>
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          ดื่มไปแล้ว <span className="font-semibold text-slate-700 dark:text-slate-200 tabular-nums">{glassCount}</span> แก้ว
          {' · '}
          {isGoalReached ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">สำเร็จ 100%</span>
          ) : (
            <span>ต้องการอีก <strong className="tabular-nums font-semibold text-sky-600 dark:text-sky-400">{remainingMl.toLocaleString()}</strong> มล.</span>
          )}
        </p>
      </div>

      {/* Quick Add Button underneath bottle */}
      <button
        onClick={onQuickAddDefault}
        className="mt-4 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-xl text-sm font-medium shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
      >
        <Droplet className="w-4 h-4 fill-white" />
        <span>+ ดื่ม 1 แก้ว (250 มล.)</span>
      </button>
    </div>
  );
};
