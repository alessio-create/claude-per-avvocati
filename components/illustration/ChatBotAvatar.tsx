/**
 * ChatBotAvatar — friendly Claude avatar designed for the chatbot launcher
 * and conversation surfaces. Smoother shapes than the pixel-art mascot, so
 * it reads well at small sizes (24-40px) and looks premium next to glossy
 * UI chrome. Self-contained, no external assets.
 *
 * Intended backdrop: solid cream-colored circle. The avatar itself is the
 * character only, no background fill, so it composes cleanly on any wrap.
 */
export function ChatBotAvatar({
  size = 36,
  className,
}: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-hidden
    >
      {/* Terracotta head — rounded square silhouette, slightly taller than wide */}
      <rect x="8" y="10" width="32" height="30" rx="13" fill="#d97757" />

      {/* Subtle highlight along the top, gives a soft 3D feel */}
      <path
        d="M 12 16 Q 24 8 36 16"
        stroke="#ef9b7e"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* Cheeks, warm blush */}
      <ellipse cx="14" cy="29" rx="2.4" ry="1.6" fill="#c4623f" opacity="0.55" />
      <ellipse cx="34" cy="29" rx="2.4" ry="1.6" fill="#c4623f" opacity="0.55" />

      {/* Eyes — oval pupils with catchlights, gives life */}
      <ellipse cx="19" cy="25" rx="2.2" ry="2.8" fill="#1a1714" />
      <ellipse cx="29" cy="25" rx="2.2" ry="2.8" fill="#1a1714" />
      <circle cx="19.7" cy="23.8" r="0.85" fill="#fff" />
      <circle cx="29.7" cy="23.8" r="0.85" fill="#fff" />

      {/* Friendly closed-mouth smile */}
      <path
        d="M 18.5 32 Q 24 35.5 29.5 32"
        stroke="#1a1714"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Floating four-pointed sparkle, signals "Claude / AI" identity */}
      <g transform="translate(38 9)">
        <path
          d="M 0 -4 L 1 -1 L 4 0 L 1 1 L 0 4 L -1 1 L -4 0 L -1 -1 Z"
          fill="#fff7ee"
          stroke="#1a1714"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      </g>
      {/* Smaller secondary sparkle, breath of motion */}
      <g transform="translate(10 14)">
        <path
          d="M 0 -2 L 0.5 -0.5 L 2 0 L 0.5 0.5 L 0 2 L -0.5 0.5 L -2 0 L -0.5 -0.5 Z"
          fill="#fff7ee"
          opacity="0.85"
        />
      </g>
    </svg>
  );
}
