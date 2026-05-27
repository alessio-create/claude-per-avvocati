type Variant = 'astro' | 'happy' | 'mid';

export function ClaudeMascot({
  variant = 'happy',
  size = 32,
  className,
}: { variant?: Variant; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden
      shapeRendering="crispEdges"
    >
      {variant === 'astro' && <Helmet />}
      <Body />
      <Face />
      <Legs />
      {variant === 'astro' && <Arms />}
    </svg>
  );
}

function Helmet() {
  return (
    <g fill="#fff">
      <rect x="9" y="3" width="14" height="1" />
      <rect x="7" y="4" width="2" height="1" />
      <rect x="23" y="4" width="2" height="1" />
      <rect x="6" y="5" width="1" height="2" />
      <rect x="25" y="5" width="1" height="2" />
      <rect x="5" y="7" width="1" height="6" />
      <rect x="26" y="7" width="1" height="6" />
      <rect x="6" y="13" width="1" height="1" />
      <rect x="25" y="13" width="1" height="1" />
      <rect x="7" y="14" width="2" height="1" />
      <rect x="23" y="14" width="2" height="1" />
      <rect x="9" y="15" width="14" height="1" />
      <rect x="9" y="5" width="3" height="1" opacity="0.6" />
      <rect x="9" y="6" width="1" height="2" opacity="0.6" />
    </g>
  );
}

function Body() {
  return <rect x="9" y="8" width="14" height="10" fill="#d97757" />;
}

function Face() {
  return (
    <g>
      {/* eyes, 2x2 dot squares */}
      <rect x="13" y="11" width="2" height="2" fill="#1a1714" />
      <rect x="17" y="11" width="2" height="2" fill="#1a1714" />
      {/* big grin */}
      <rect x="11" y="14" width="1" height="1" fill="#1a1714" />
      <rect x="20" y="14" width="1" height="1" fill="#1a1714" />
      <rect x="12" y="15" width="2" height="1" fill="#1a1714" />
      <rect x="18" y="15" width="2" height="1" fill="#1a1714" />
      <rect x="14" y="16" width="4" height="1" fill="#1a1714" />
      {/* cheek blush */}
      <rect x="10" y="14" width="1" height="2" fill="#ef9b7e" />
      <rect x="21" y="14" width="1" height="2" fill="#ef9b7e" />
    </g>
  );
}

function Legs() {
  return (
    <g>
      <rect x="10" y="18" width="4" height="3" fill="#d97757" />
      <rect x="18" y="18" width="4" height="3" fill="#d97757" />
      <rect x="10" y="21" width="4" height="1" fill="#c4623f" />
      <rect x="18" y="21" width="4" height="1" fill="#c4623f" />
    </g>
  );
}

function Arms() {
  return (
    <g fill="#d97757">
      <rect x="8" y="13" width="2" height="2" />
      <rect x="22" y="13" width="2" height="2" />
    </g>
  );
}
