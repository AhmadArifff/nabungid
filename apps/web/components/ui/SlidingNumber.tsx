'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlidingNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const SlidingNumber: React.FC<SlidingNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const formatted = displayValue.toLocaleString('id-ID');

  return (
    <span className={`inline-flex items-center font-mono font-bold ${className}`}>
      {prefix && <span className="mr-0.5">{prefix}</span>}
      <span className="inline-flex overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={formatted}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="inline-block"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </span>
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
};
