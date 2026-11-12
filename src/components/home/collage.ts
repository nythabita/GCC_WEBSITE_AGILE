import type { CSSProperties } from "react";

// The Figma collages are free-form. Each piece is described by its centre point and width in
// design pixels, then converted to percentages so the whole composition scales with its container.
export type Box = { w: number; h: number };
export type Pin = { cx: number; cy: number; w?: number; rotate?: number; skewX?: number };

const pct = (value: number, total: number) => `${((value / total) * 100).toFixed(3)}%`;

export function pinStyle({ cx, cy, w, rotate, skewX }: Pin, box: Box): CSSProperties {
  const transform = ["translate(-50%, -50%)", rotate ? `rotate(${rotate}deg)` : "", skewX ? `skewX(${skewX}deg)` : ""]
    .filter(Boolean)
    .join(" ");
  return {
    position: "absolute",
    left: pct(cx, box.w),
    top: pct(cy, box.h),
    width: w === undefined ? undefined : pct(w, box.w),
    transform,
  };
}

// Font size that scales with the collage width (design size ÷ design width × 100cqw).
export const cqw = (designPx: number, boxWidth: number) => `${((designPx / boxWidth) * 100).toFixed(3)}cqw`;
