import { type SVGProps } from "react";

interface TraceIconProps {
  size?: number;
  className?: string;
  rounded?: "xl" | "2xl";
}

/**
 * TraceIcon — primary brand mark.
 * A softly rounded pastel-gradient tile (blush pink → mint green) with a
 * minimalist winding trace path and verification nodes rendered in deep slate.
 * Pure SVG, infinitely scalable.
 */
export function TraceIcon({
  size = 48,
  className,
  rounded = "2xl",
  ...rest
}: TraceIconProps & Omit<SVGProps<SVGSVGElement>, "width" | "height">) {
  const radius = rounded === "2xl" ? 16 : 12;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="trace"
      className={className}
      {...rest}
    >
      <defs>
        <linearGradient id="traceIconBg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FCE4EC" />
          <stop offset="55%" stopColor="#F1F4E8" />
          <stop offset="100%" stopColor="#CDEEDC" />
        </linearGradient>
      </defs>

      {/* Soft pastel rounded tile */}
      <rect x="0" y="0" width="64" height="64" rx={radius} ry={radius} fill="url(#traceIconBg)" />

      {/* Winding trace path */}
      <path
        d="M14 46 C 22 46, 22 32, 30 32 S 42 18, 50 18"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Verification nodes */}
      <circle cx="14" cy="46" r="3.25" fill="#FFFFFF" stroke="#334155" strokeWidth="2.25" />
      <circle cx="30" cy="32" r="3.25" fill="#FFFFFF" stroke="#334155" strokeWidth="2.25" />
      <circle cx="50" cy="18" r="3.25" fill="#334155" stroke="#334155" strokeWidth="2.25" />
    </svg>
  );
}

export default TraceIcon;