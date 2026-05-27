'use client';
import { useEffect, useState } from 'react';
import { getGems } from '../../lib/gems';
import { computeCourseStats, type CourseStats } from '../../lib/progress';
import type { CorsoIndex } from '../../lib/content';

/**
 * Compact progress chip: percentage pill + "X/Y lezioni" counter, with an
 * optional Pioneer badge when the user has finished everything. Shared by
 * the sidebar and the lesson-page breadcrumb row so the two surfaces stay
 * in sync without duplicating logic.
 */
export function CourseStatsChip({
  index,
  className = '',
}: { index: CorsoIndex; className?: string }) {
  const [stats, setStats] = useState<CourseStats | null>(null);

  useEffect(() => {
    const refresh = () => setStats(computeCourseStats(index, getGems()));
    refresh();
    window.addEventListener('cpa-gems-changed', refresh);
    return () => window.removeEventListener('cpa-gems-changed', refresh);
  }, [index]);

  if (!stats) return null;

  const { corePercent, coreLessonsRead, coreLessonsTotal, isPioneer } = stats;

  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="inline-flex items-center gap-1 bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight tabular-nums">
        {corePercent}%
      </span>
      <span className="text-muted text-[10px] uppercase tracking-widest tabular-nums">
        {coreLessonsRead}<span className="text-muted/50">/</span>{coreLessonsTotal} lezioni
      </span>
      {isPioneer && (
        <span className="inline-flex items-center gap-1 bg-terracotta text-white px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold shadow-sm">
          <span aria-hidden>★</span> Pioneer
        </span>
      )}
    </span>
  );
}
