import type { SVGProps } from "react";

export function EllipsisIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 512 512"
      fill="currentColor"
      {...props}
    >
      <rect x="64" y="208" width="96" height="96" rx="10" />
      <rect x="208" y="208" width="96" height="96" rx="10" />
      <rect x="352" y="208" width="96" height="96" rx="10" />
    </svg>
  );
}

