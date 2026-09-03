'use client';

import { useEffect, useRef } from 'react';

/**
 * Smart visibility-aware auto-sync hook.
 * Polls every `intervalMs` (default: 60,000ms / 1 min) only when tab is active.
 * Immediately triggers a sync when user switches back to the tab.
 */
export function useAutoSync(
  syncFn: () => Promise<any> | void,
  intervalMs: number = 60000,
  enabled: boolean = true
) {
  const savedFn = useRef(syncFn);

  useEffect(() => {
    savedFn.current = syncFn;
  }, [syncFn]);

  useEffect(() => {
    if (!enabled) return;

    // Immediately trigger silent refresh when user switches back to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        savedFn.current();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        savedFn.current();
      }
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [intervalMs, enabled]);
}
