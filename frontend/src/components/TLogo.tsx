import { type SVGProps } from "react";

interface TLogoProps extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number;
}

/**
 * TLogo — minimalist brand mark.
 * A bold capital "T" whose vertical stem morphs into a winding traceable path.
 * Pure SVG, no background, infinitely scalable.
 */
export function TLogo({ size = 56, className, ...rest }: TLogoProps) {
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
      {/* Horizontal crossbar of the T */}
      <path
        d="M14 14 H50"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Vertical stem morphing into a winding road downward */}
      <path
        d="M32 14 V26 C 32 32, 22 34, 22 40 C 22 46, 42 48, 42 54"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default TLogo;