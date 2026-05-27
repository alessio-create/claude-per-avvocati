/**
  * EsameBadge, small ribbon/seal used in the sidebar to mark end-of-module exam lessons.
  */
export function EsameBadge({ size = 12, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M9 15 L7 22 L12 19 L17 22 L15 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.2" fill="currentColor" />
    </svg>
  );
}
