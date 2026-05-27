'use client';
import { useEffect, useState } from 'react';
import { useInView } from '../../lib/use-in-view';

/**
  * Counts up from 0 to `value` over `duration` ms when scrolled into view.
  * EU-formatted (thousands separator = `.`). Renders prefix + number + suffix.
  */
export function CountUp({
  value,
  prefix = '',
  suffix = '',
  duration = 1400,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3); // easeOutCubic
      setDisplay(Math.round(value * eased));
      if (elapsed < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  // Italian thousand separator, Intl is unreliable for 4-digit values, so format manually
  const formatted = String(display).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (
    <span ref={ref}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
