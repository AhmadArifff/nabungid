'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CircularProgressProps {
  currentWeek: number;
  totalWeeks: number;
  size?: number;
  strokeWidth?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  currentWeek,
  totalWeeks = 50,
  size = 180,
  strokeWidth = 14,
}) => {
  const percentage = Math.min(100, Math.round((currentWeek / totalWeeks) * 100));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-800/80 fill-transparent"
        />
        {/* Animated Emerald/Gold Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          strokeLinecap="round"
          className="fill-transparent drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
        />

        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="60%" stopColor="#059669" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black font-mono text-white tracking-tight">
          {percentage}%
        </span>
        <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
          {currentWeek} / {totalWeeks} Minggu
        </span>
      </div>
    </div>
  );
};
