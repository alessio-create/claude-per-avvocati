/**
 * ModuleIcon — pixel-art icons for the 10 course modules.
 *
 * Each icon is composed of axis-aligned rectangles (no curves), painted on
 * a 48x48 viewBox. `shapeRendering="crispEdges"` keeps the pixel corners
 * sharp at any size. Single-color fill (uses `color` prop) so the icon
 * inherits each module's accent palette automatically.
 *
 * Visual language matches the Claude mascot: blocky, chunky, hand-pixeled.
 */

type IconName = 'fondamenta' | 'surfaces' | 'setup' | 'legal' | 'skills' | 'privacy' | 'cowork' | 'code' | 'app-schedule' | 'kit';

export function ModuleIcon({
  name,
  size = 56,
  color = 'currentColor',
}: { name: IconName; size?: number; color?: string }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    'aria-hidden': true as const,
    shapeRendering: 'crispEdges' as const,
  };

  switch (name) {
    /* M1 · A chunky 4-pointed compass star (echoes the ClaudeStar brand mark
       but rendered as pixel blocks instead of smooth diamonds). */
    case 'fondamenta':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Vertical beam */}
            <rect x="21" y="6" width="6" height="36" />
            {/* Horizontal beam */}
            <rect x="6" y="21" width="36" height="6" />
            {/* Stepped widening toward center, the "diamond" feel */}
            <rect x="18" y="9" width="12" height="3" />
            <rect x="15" y="12" width="18" height="3" />
            <rect x="18" y="36" width="12" height="3" />
            <rect x="15" y="33" width="18" height="3" />
            <rect x="9" y="18" width="3" height="12" />
            <rect x="12" y="15" width="3" height="18" />
            <rect x="36" y="18" width="3" height="12" />
            <rect x="33" y="15" width="3" height="18" />
          </g>
        </svg>
      );

    /* M2 · Three stacked pixel "windows" — Chat / Projects / Code as
       overlapping browser-ish frames. */
    case 'surfaces':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Back window */}
            <rect x="6" y="6" width="24" height="3" />
            <rect x="6" y="6" width="3" height="18" />
            <rect x="27" y="6" width="3" height="18" />
            <rect x="6" y="21" width="24" height="3" />
            {/* title-bar dots */}
            <rect x="9" y="9" width="3" height="3" opacity="0.6" />
            {/* Middle window */}
            <rect x="15" y="15" width="24" height="3" />
            <rect x="15" y="15" width="3" height="18" />
            <rect x="36" y="15" width="3" height="18" />
            <rect x="15" y="30" width="24" height="3" />
            {/* Front window (filled accent) */}
            <rect x="21" y="24" width="21" height="3" />
            <rect x="21" y="24" width="3" height="18" />
            <rect x="39" y="24" width="3" height="18" />
            <rect x="21" y="39" width="21" height="3" />
            <rect x="24" y="27" width="15" height="12" opacity="0.25" />
          </g>
        </svg>
      );

    /* M3 · Pixel gear. Center hub + 4 cross arms + 4 corner teeth. */
    case 'setup':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Center hub */}
            <rect x="18" y="18" width="12" height="12" />
            <rect x="21" y="21" width="6" height="6" fill="#fff" opacity="0.85" />
            {/* Cross arms */}
            <rect x="21" y="6" width="6" height="9" />
            <rect x="21" y="33" width="6" height="9" />
            <rect x="6" y="21" width="9" height="6" />
            <rect x="33" y="21" width="9" height="6" />
            {/* Diagonal corner teeth */}
            <rect x="9" y="9" width="6" height="6" />
            <rect x="33" y="9" width="6" height="6" />
            <rect x="9" y="33" width="6" height="6" />
            <rect x="33" y="33" width="6" height="6" />
            {/* Tooth offsets to feel mechanical */}
            <rect x="12" y="6" width="3" height="3" />
            <rect x="33" y="6" width="3" height="3" />
            <rect x="12" y="39" width="3" height="3" />
            <rect x="33" y="39" width="3" height="3" />
            <rect x="6" y="12" width="3" height="3" />
            <rect x="39" y="12" width="3" height="3" />
            <rect x="6" y="33" width="3" height="3" />
            <rect x="39" y="33" width="3" height="3" />
          </g>
        </svg>
      );

    /* M4 · Pixel document with folded corner + lines of "text". */
    case 'legal':
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
            {/* Text lines */}
            <rect x="15" y="15" width="15" height="3" opacity="0.85" />
            <rect x="15" y="21" width="18" height="3" opacity="0.7" />
            <rect x="15" y="27" width="12" height="3" opacity="0.7" />
            <rect x="15" y="33" width="15" height="3" opacity="0.7" />
          </g>
        </svg>
      );

    /* M5 · Skills, 2x2 grid of pixel blocks (lego-like). */
    case 'skills':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Top-left filled block */}
            <rect x="6" y="6" width="15" height="15" />
            <rect x="9" y="3" width="3" height="3" />
            <rect x="15" y="3" width="3" height="3" />
            {/* Top-right outline block */}
            <rect x="27" y="6" width="15" height="3" />
            <rect x="27" y="6" width="3" height="15" />
            <rect x="39" y="6" width="3" height="15" />
            <rect x="27" y="18" width="15" height="3" />
            {/* Bottom-left outline block */}
            <rect x="6" y="27" width="15" height="3" />
            <rect x="6" y="27" width="3" height="15" />
            <rect x="18" y="27" width="3" height="15" />
            <rect x="6" y="39" width="15" height="3" />
            {/* Bottom-right filled block */}
            <rect x="27" y="27" width="15" height="15" />
            <rect x="30" y="42" width="3" height="3" opacity="0.5" />
          </g>
        </svg>
      );

    /* M6 · Pixel shield. Stacked rectangles forming a pentagonal silhouette. */
    case 'privacy':
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
            {/* Center accent stripe */}
            <rect x="21" y="15" width="6" height="15" fill="#fff" opacity="0.85" />
          </g>
        </svg>
      );

    /* M7 · Cowork, two chunky mascot-shaped figures side by side. */
    case 'cowork':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Left figure: body */}
            <rect x="6" y="15" width="15" height="18" />
            {/* eyes */}
            <rect x="9" y="18" width="3" height="3" fill="#fff" />
            <rect x="15" y="18" width="3" height="3" fill="#fff" />
            {/* mouth */}
            <rect x="12" y="24" width="3" height="3" fill="#fff" opacity="0.8" />
            {/* legs */}
            <rect x="6" y="33" width="6" height="6" />
            <rect x="15" y="33" width="6" height="6" />

            {/* Right figure: body */}
            <rect x="27" y="15" width="15" height="18" />
            <rect x="30" y="18" width="3" height="3" fill="#fff" />
            <rect x="36" y="18" width="3" height="3" fill="#fff" />
            <rect x="33" y="24" width="3" height="3" fill="#fff" opacity="0.8" />
            <rect x="27" y="33" width="6" height="6" />
            <rect x="36" y="33" width="6" height="6" />
          </g>
        </svg>
      );

    /* M8 · Pixel terminal window with traffic lights + brackets. */
    case 'code':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Window outline */}
            <rect x="6" y="9" width="36" height="3" />
            <rect x="6" y="9" width="3" height="30" />
            <rect x="39" y="9" width="3" height="30" />
            <rect x="6" y="36" width="36" height="3" />
            {/* Title-bar dots */}
            <rect x="9" y="12" width="3" height="3" opacity="0.7" />
            <rect x="15" y="12" width="3" height="3" opacity="0.5" />
            <rect x="21" y="12" width="3" height="3" opacity="0.3" />
            {/* Left bracket "<" */}
            <rect x="15" y="21" width="3" height="3" />
            <rect x="12" y="24" width="3" height="3" />
            <rect x="15" y="27" width="3" height="3" />
            {/* Right bracket ">" */}
            <rect x="30" y="21" width="3" height="3" />
            <rect x="33" y="24" width="3" height="3" />
            <rect x="30" y="27" width="3" height="3" />
            {/* Slash between */}
            <rect x="24" y="18" width="3" height="3" />
            <rect x="21" y="24" width="3" height="3" />
            <rect x="24" y="30" width="3" height="3" />
          </g>
        </svg>
      );

    /* M9 · App + Schedule, pixel phone with a clock face. */
    case 'app-schedule':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Phone outline */}
            <rect x="12" y="3" width="18" height="3" />
            <rect x="12" y="3" width="3" height="42" />
            <rect x="27" y="3" width="3" height="42" />
            <rect x="12" y="42" width="18" height="3" />
            {/* Home indicator */}
            <rect x="18" y="39" width="6" height="3" opacity="0.6" />
            {/* Clock face overlapping bottom-right */}
            <rect x="27" y="21" width="3" height="3" />
            <rect x="30" y="18" width="6" height="3" />
            <rect x="36" y="21" width="3" height="9" />
            <rect x="33" y="30" width="6" height="3" />
            <rect x="27" y="30" width="3" height="3" />
            <rect x="30" y="21" width="6" height="9" fill="#fff" />
            {/* Hands */}
            <rect x="33" y="21" width="2" height="6" />
            <rect x="33" y="27" width="4" height="2" />
          </g>
        </svg>
      );

    /* M10 · Pixel kit / briefcase. */
    case 'kit':
      return (
        <svg {...props}>
          <g fill={color}>
            {/* Handle */}
            <rect x="18" y="9" width="12" height="3" />
            <rect x="18" y="9" width="3" height="6" />
            <rect x="27" y="9" width="3" height="6" />
            {/* Body */}
            <rect x="6" y="15" width="36" height="6" />
            <rect x="6" y="15" width="3" height="24" />
            <rect x="39" y="15" width="3" height="24" />
            <rect x="6" y="36" width="36" height="3" />
            {/* Mid-band clasp */}
            <rect x="9" y="24" width="30" height="3" opacity="0.6" />
            {/* Center latch */}
            <rect x="21" y="21" width="6" height="6" />
            <rect x="22.5" y="22.5" width="3" height="3" fill="#fff" />
          </g>
        </svg>
      );
  }
}
