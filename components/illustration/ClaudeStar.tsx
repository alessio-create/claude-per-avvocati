/**
  * ClaudeStar, homage to the Anthropic Claude brand mark.
  * 8-pointed asymmetric star: 4 long cardinal spikes + 4 shorter diagonal spikes.
  * Color: Anthropic terracotta #d97757.
  */
export function ClaudeStar({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden>
      <g fill="#d97757">
        {/* 4 LONG cardinal spikes, reach from edge (4 or 96) to inner radius 42-58 */}
        <path d="M50 4 L57 46 L50 50 L43 46 Z" />
        <path d="M96 50 L54 57 L50 50 L54 43 Z" />
        <path d="M50 96 L43 54 L50 50 L57 54 Z" />
        <path d="M4 50 L46 43 L50 50 L46 57 Z" />
        {/* 4 SHORT diagonal spikes, reach only from 18 to 50 */}
        <g transform="rotate(45 50 50)">
          <path d="M50 18 L55 46 L50 50 L45 46 Z" />
          <path d="M82 50 L54 55 L50 50 L54 45 Z" />
          <path d="M50 82 L45 54 L50 50 L55 54 Z" />
          <path d="M18 50 L46 45 L50 50 L46 55 Z" />
        </g>
      </g>
    </svg>
  );
}
