/**
  * LockIcon, custom outline padlock matching the design system.
  * Used to mark locked lessons in the sidebar and the lesson gate screen.
  */
export function LockIcon({
  size = 14,
  className,
  color = 'currentColor',
}: { size?: number; className?: string; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      {/* Shackle */}
      <path
        d="M7 11 V8 a5 5 0 0 1 10 0 V11"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Body */}
      <rect
        x="4.5"
        y="11"
        width="15"
        height="10.5"
        rx="2"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      {/* Keyhole */}
      <circle cx="12" cy="15.5" r="1.3" fill={color} />
      <path
        d="M12 16.4 V18.3"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
