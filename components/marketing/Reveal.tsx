'use client';
import { useInView } from '../../lib/use-in-view';

/**
  * Wrap a section to fade-up on scroll-into-view.
  * Animates once, then stays put. Lightweight, no animation library.
  */
export function Reveal({
  children,
  delay = 0,
  duration = 700,
  y = 24,
  as: Component = 'div',
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  as?: 'div' | 'section';
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <Component
      ref={ref as never}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Component>
  );
}
