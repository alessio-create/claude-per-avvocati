export function Lampadina({ size = 38, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden>
      <path
        d="M20 4 Q10 4 10 14 Q10 20 14 24 L14 28 L26 28 L26 24 Q30 20 30 14 Q30 4 20 4 Z"
        fill="#ffd166"
        stroke="#d97757"
        strokeWidth="1.5"
      />
      <rect x="15" y="29" width="10" height="3" fill="#1a1714" rx="1" />
      <rect x="16" y="33" width="8" height="2" fill="#1a1714" rx="1" />
      <line x1="20" y1="36" x2="20" y2="38" stroke="#1a1714" strokeWidth="2" strokeLinecap="round" />
      <g stroke="#ffd166" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
        <line x1="20" y1="0" x2="20" y2="2" />
        <line x1="4" y1="14" x2="6" y2="14" />
        <line x1="34" y1="14" x2="36" y2="14" />
        <line x1="8" y1="4" x2="9.5" y2="5.5" />
        <line x1="30.5" y1="5.5" x2="32" y2="4" />
      </g>
    </svg>
  );
}
