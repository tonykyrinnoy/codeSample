import { useEffect, useState } from 'react';

/**
 * Hook to use current date/time. Updated on an interval of 1s.
 *
 * Can be used by things such as a timer or clock.
 */
export function useTime() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  });

  return {
    currentTime,
    startTime
  };
}
