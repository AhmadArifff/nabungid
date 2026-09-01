'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useToastStore, ToastType } from '../../stores/useToastStore';

const toastConfig: Record<
  ToastType,
  {
    icon: React.ComponentType<{ className?: string }>;
    bgColor: string;
    borderColor: string;
    iconColor: string;
    textColor: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    bgColor: 'bg-emerald-950/90',
    borderColor: 'border-emerald-500/40',
    iconColor: 'text-emerald-400',
    textColor: 'text-emerald-200',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-rose-950/90',
    borderColor: 'border-rose-500/40',
    iconColor: 'text-rose-400',
    textColor: 'text-rose-200',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-950/90',
    borderColor: 'border-amber-500/40',
    iconColor: 'text-amber-400',
    textColor: 'text-amber-200',
  },
  info: {
    icon: Info,
    bgColor: 'bg-slate-900/90',
    borderColor: 'border-cyan-500/40',
    iconColor: 'text-cyan-400',
    textColor: 'text-cyan-200',
  },
};

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToastStore();

  return (
    <div
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-[100] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${config.bgColor} ${config.borderColor} flex items-start space-x-3`}
            >
              <div className={`p-1 rounded-xl bg-white/5 shrink-0 ${config.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0 pr-1">
                {toast.title && (
                  <h4 className="text-xs font-bold text-white tracking-tight leading-tight">
                    {toast.title}
                  </h4>
                )}
                <p className={`text-xs mt-0.5 leading-snug font-normal ${config.textColor}`}>
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => dismissToast(toast.id)}
                aria-label="Tutup notifikasi"
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
