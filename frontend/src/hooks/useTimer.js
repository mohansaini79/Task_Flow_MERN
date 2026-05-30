import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook to maintain a live-updating elapsed time counter.
 * @param {Date|string|null} startTime - When the timer started
 * @param {boolean} isRunning - Whether the timer is currently running
 * @returns {{ elapsed: number, formatted: string }} - Seconds elapsed + HH:MM:SS string
 */
export const useTimer = (startTime, isRunning) => {
  const getElapsed = useCallback(() => {
    if (!startTime || !isRunning) return 0;
    return Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
  }, [startTime, isRunning]);

  const [elapsed, setElapsed] = useState(getElapsed);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && startTime) {
      setElapsed(getElapsed());
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - new Date(startTime).getTime()) / 1000));
      }, 1000);
    } else {
      setElapsed(0);
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, startTime, getElapsed]);

  const formatted = formatDuration(elapsed);

  return { elapsed, formatted };
};

export const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '00:00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const formatDurationShort = (seconds) => {
  if (!seconds || seconds < 60) return `${seconds || 0}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};
