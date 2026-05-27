/**
 * BlogCover, pixel-art illustration for a blog card.
 *
 * Each cover is a tinted background + a centered pixel-art icon composed
 * of axis-aligned rectangles. Same visual language as ModuleIcon: blocky,
 * hand-pixeled, no curves, `shapeRendering="crispEdges"` for sharp corners.
 */

export type BlogCoverIcon =
  | 'clock'
  | 'shield'
  | 'parere'
  | 'folder-stack'
  | 'gear'
  | 'kit'
  | 'vs'
  | 'quill'
  | 'shield-check'
  | 'horizon'
  | 'folder-grid'
  | 'scales';

const BG: Record<string, string> = {
  lilac: 'bg-[#e8defe]',
  sage: 'bg-[#d8e6dc]',
  peach: 'bg-[#fde2cc]',
  lavender: 'bg-[#dad4f0]',
  terracotta: 'bg-[#f4d4c4]',
  mint: 'bg-[#d4ecdf]',
};
const FG: Record<string, string> = {
  lilac: '#7a5fb0',
  sage: '#4f7a5f',
  peach: '#b86b3f',
  lavender: '#5e51a0',
  terracotta: '#a8512e',
  mint: '#3c8a66',
};

export function BlogCover({
  icon,
  coverColor,
  height = 'h-28',
}: {
  icon: BlogCoverIcon;
  coverColor: string;
  height?: string;
}) {
  const bg = BG[coverColor] ?? 'bg-cream-panel';
  const fg = FG[coverColor] ?? '#1a1714';
  const size = height === 'h-40' ? 80 : 56;
  return (
    <div className={`${bg} ${height} flex items-center justify-center relative`}>
      <CoverIcon icon={icon} color={fg} size={size} />
    </div>
  );
}

function CoverIcon({ icon, color, size }: { icon: BlogCoverIcon; color: string; size: number }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    'aria-hidden': true as const,
    shapeRendering: 'crispEdges' as const,
  };

  switch (icon) {
    /* Pixel clock — square face + 12/3/6/9 ticks + two hands. */
    case 'clock':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Face outer ring */}
            <rect x="12" y="9" width="24" height="3" />
            <rect x="12" y="36" width="24" height="3" />
            <rect x="9" y="12" width="3" height="24" />
            <rect x="36" y="12" width="3" height="24" />
            {/* Stepped corners for a chunky-round feel */}
            <rect x="12" y="6" width="6" height="3" />
            <rect x="30" y="6" width="6" height="3" />
            <rect x="12" y="39" width="6" height="3" />
            <rect x="30" y="39" width="6" height="3" />
            <rect x="6" y="12" width="3" height="6" />
            <rect x="6" y="30" width="3" height="6" />
            <rect x="39" y="12" width="3" height="6" />
            <rect x="39" y="30" width="3" height="6" />
            {/* Tick marks */}
            <rect x="22.5" y="12" width="3" height="3" />
            <rect x="33" y="22.5" width="3" height="3" />
            <rect x="22.5" y="33" width="3" height="3" />
            <rect x="12" y="22.5" width="3" height="3" />
            {/* Hands */}
            <rect x="22.5" y="18" width="3" height="9" />
            <rect x="22.5" y="22.5" width="9" height="3" />
            <rect x="22.5" y="22.5" width="3" height="3" fill="#fff" />
          </g>
        </svg>
      );

    /* Pixel shield. Reused silhouette from privacy. */
    case 'shield':
      return (
        <svg {...props}>
          <g fill={color}>
            <rect x="15" y="6" width="18" height="3" />
            <rect x="9" y="9" width="30" height="3" />
            <rect x="9" y="12" width="30" height="9" />
            <rect x="12" y="21" width="24" height="6" />
            <rect x="15" y="27" width="18" height="6" />
            <rect x="18" y="33" width="12" height="3" />
            <rect x="21" y="36" width="6" height="3" />
            <rect x="21" y="15" width="6" height="12" fill="#fff" opacity="0.85" />
          </g>
        </svg>
      );

    /* Pixel document with folded corner + text lines + braces hint. */
    case 'parere':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Outline */}
            <rect x="9" y="6" width="24" height="3" />
            <rect x="9" y="9" width="3" height="33" />
            <rect x="9" y="39" width="30" height="3" />
            <rect x="36" y="12" width="3" height="30" />
            {/* Folded corner */}
            <rect x="30" y="6" width="3" height="3" />
            <rect x="30" y="9" width="6" height="3" />
            <rect x="33" y="9" width="3" height="3" />
            {/* Curly braces (prompt-engineering hint) */}
            <rect x="15" y="18" width="3" height="3" />
            <rect x="15" y="21" width="3" height="6" />
            <rect x="12" y="24" width="3" height="3" />
            <rect x="15" y="27" width="3" height="3" />
            <rect x="27" y="18" width="3" height="3" />
            <rect x="27" y="21" width="3" height="6" />
            <rect x="30" y="24" width="3" height="3" />
            <rect x="27" y="27" width="3" height="3" />
            {/* Bottom text line */}
            <rect x="15" y="33" width="15" height="3" opacity="0.7" />
          </g>
        </svg>
      );

    /* Pixel folder stack, two folders one in front of the other. */
    case 'folder-stack':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Back folder */}
            <rect x="6" y="9" width="9" height="3" />
            <rect x="6" y="12" width="3" height="21" />
            <rect x="6" y="33" width="27" height="3" />
            <rect x="30" y="12" width="3" height="21" />
            <rect x="9" y="12" width="24" height="3" />
            {/* Front folder, offset down/right */}
            <rect x="12" y="18" width="9" height="3" />
            <rect x="12" y="21" width="3" height="18" />
            <rect x="12" y="39" width="30" height="3" />
            <rect x="39" y="21" width="3" height="18" />
            <rect x="15" y="21" width="27" height="3" />
            {/* Stripe inside front folder */}
            <rect x="18" y="27" width="18" height="3" opacity="0.5" />
            <rect x="18" y="33" width="12" height="3" opacity="0.5" />
          </g>
        </svg>
      );

    /* Pixel gear — same as ModuleIcon 'setup'. */
    case 'gear':
      return (
        <svg {...props}>
          <g fill={color}>
            <rect x="18" y="18" width="12" height="12" />
            <rect x="21" y="21" width="6" height="6" fill="#fff" opacity="0.85" />
            <rect x="21" y="6" width="6" height="9" />
            <rect x="21" y="33" width="6" height="9" />
            <rect x="6" y="21" width="9" height="6" />
            <rect x="33" y="21" width="9" height="6" />
            <rect x="9" y="9" width="6" height="6" />
            <rect x="33" y="9" width="6" height="6" />
            <rect x="9" y="33" width="6" height="6" />
            <rect x="33" y="33" width="6" height="6" />
          </g>
        </svg>
      );

    /* Pixel kit / briefcase — same as ModuleIcon 'kit'. */
    case 'kit':
      return (
        <svg {...props}>
          <g fill={color}>
            <rect x="18" y="9" width="12" height="3" />
            <rect x="18" y="9" width="3" height="6" />
            <rect x="27" y="9" width="3" height="6" />
            <rect x="6" y="15" width="36" height="6" />
            <rect x="6" y="15" width="3" height="24" />
            <rect x="39" y="15" width="3" height="24" />
            <rect x="6" y="36" width="36" height="3" />
            <rect x="9" y="24" width="30" height="3" opacity="0.6" />
            <rect x="21" y="21" width="6" height="6" />
            <rect x="22.5" y="22.5" width="3" height="3" fill="#fff" />
          </g>
        </svg>
      );

    /* VS — two blocks split by a vertical lightning. */
    case 'vs':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Left block (outline) */}
            <rect x="6" y="9" width="15" height="3" />
            <rect x="6" y="9" width="3" height="30" />
            <rect x="18" y="9" width="3" height="30" />
            <rect x="6" y="36" width="15" height="3" />
            {/* Right block (filled accent) */}
            <rect x="27" y="9" width="15" height="30" opacity="0.3" />
            <rect x="27" y="9" width="15" height="3" />
            <rect x="27" y="9" width="3" height="30" />
            <rect x="39" y="9" width="3" height="30" />
            <rect x="27" y="36" width="15" height="3" />
            {/* Central spark / lightning */}
            <rect x="22.5" y="12" width="3" height="9" />
            <rect x="22.5" y="27" width="3" height="9" />
            <rect x="22.5" y="22.5" width="3" height="3" />
          </g>
        </svg>
      );

    /* Pixel quill / feather + inkpot. */
    case 'quill':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Feather body, stepped diagonal */}
            <rect x="33" y="6" width="9" height="3" />
            <rect x="30" y="9" width="9" height="3" />
            <rect x="27" y="12" width="9" height="3" />
            <rect x="24" y="15" width="9" height="3" />
            <rect x="21" y="18" width="9" height="3" />
            <rect x="18" y="21" width="9" height="3" />
            <rect x="15" y="24" width="9" height="3" />
            <rect x="12" y="27" width="9" height="3" />
            {/* Tip */}
            <rect x="9" y="30" width="6" height="3" />
            {/* Quill detail lines */}
            <rect x="30" y="12" width="3" height="3" fill="#fff" opacity="0.5" />
            <rect x="27" y="15" width="3" height="3" fill="#fff" opacity="0.5" />
            <rect x="24" y="18" width="3" height="3" fill="#fff" opacity="0.5" />
            {/* Inkpot */}
            <rect x="6" y="36" width="15" height="3" />
            <rect x="9" y="33" width="9" height="3" />
            <rect x="6" y="39" width="15" height="3" />
          </g>
        </svg>
      );

    /* Pixel shield + checkmark inside. */
    case 'shield-check':
      return (
        <svg {...props}>
          <g fill={color}>
            <rect x="15" y="6" width="18" height="3" />
            <rect x="9" y="9" width="30" height="3" />
            <rect x="9" y="12" width="30" height="9" />
            <rect x="12" y="21" width="24" height="6" />
            <rect x="15" y="27" width="18" height="6" />
            <rect x="18" y="33" width="12" height="3" />
            <rect x="21" y="36" width="6" height="3" />
            {/* Checkmark in white */}
            <rect x="27" y="15" width="3" height="3" fill="#fff" />
            <rect x="24" y="18" width="3" height="3" fill="#fff" />
            <rect x="21" y="21" width="3" height="3" fill="#fff" />
            <rect x="18" y="24" width="3" height="3" fill="#fff" />
            <rect x="15" y="21" width="3" height="3" fill="#fff" />
          </g>
        </svg>
      );

    /* Pixel sunrise + horizon line + small arrow forward. */
    case 'horizon':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Sun body */}
            <rect x="18" y="18" width="12" height="3" />
            <rect x="15" y="21" width="18" height="6" />
            <rect x="18" y="27" width="12" height="3" />
            {/* Sun rays */}
            <rect x="22.5" y="9" width="3" height="3" />
            <rect x="22.5" y="12" width="3" height="3" opacity="0.6" />
            <rect x="9" y="22.5" width="3" height="3" />
            <rect x="12" y="22.5" width="3" height="3" opacity="0.6" />
            <rect x="33" y="22.5" width="3" height="3" />
            <rect x="36" y="22.5" width="3" height="3" opacity="0.6" />
            <rect x="12" y="12" width="3" height="3" opacity="0.7" />
            <rect x="33" y="12" width="3" height="3" opacity="0.7" />
            {/* Horizon line */}
            <rect x="3" y="33" width="42" height="3" />
            {/* Arrow forward */}
            <rect x="33" y="39" width="9" height="3" />
            <rect x="36" y="36" width="3" height="3" />
            <rect x="36" y="42" width="3" height="3" />
          </g>
        </svg>
      );

    /* Four pixel folders in a 2x2 grid, two filled. */
    case 'folder-grid':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Top-left folder, filled */}
            <rect x="6" y="9" width="6" height="3" />
            <rect x="6" y="12" width="15" height="9" />
            {/* Top-right folder, outline */}
            <rect x="27" y="9" width="6" height="3" />
            <rect x="27" y="12" width="15" height="3" />
            <rect x="27" y="12" width="3" height="9" />
            <rect x="39" y="12" width="3" height="9" />
            <rect x="27" y="18" width="15" height="3" />
            {/* Bottom-left folder, outline */}
            <rect x="6" y="27" width="6" height="3" />
            <rect x="6" y="30" width="15" height="3" />
            <rect x="6" y="30" width="3" height="9" />
            <rect x="18" y="30" width="3" height="9" />
            <rect x="6" y="36" width="15" height="3" />
            {/* Bottom-right folder, filled */}
            <rect x="27" y="27" width="6" height="3" />
            <rect x="27" y="30" width="15" height="9" />
          </g>
        </svg>
      );

    /* Pixel scales of justice. */
    case 'scales':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Vertical post */}
            <rect x="22.5" y="6" width="3" height="33" />
            {/* Base */}
            <rect x="15" y="39" width="18" height="3" />
            {/* Crossbar */}
            <rect x="6" y="12" width="36" height="3" />
            {/* Left pan (stepped triangle) */}
            <rect x="6" y="15" width="3" height="3" />
            <rect x="3" y="18" width="9" height="3" />
            <rect x="6" y="21" width="3" height="3" />
            {/* Pan rope */}
            <rect x="6" y="15" width="3" height="3" />
            {/* Right pan */}
            <rect x="39" y="15" width="3" height="3" />
            <rect x="36" y="18" width="9" height="3" />
            <rect x="39" y="21" width="3" height="3" />
            {/* Connections between bar and pans */}
            <rect x="6" y="15" width="3" height="3" />
            <rect x="39" y="15" width="3" height="3" />
          </g>
        </svg>
      );
  }
}
