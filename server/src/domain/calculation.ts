export const PANEL_LENGTH = 2.5;
export const SCREWS_PER_POST = 4;

export const HEIGHTS = [1.03, 1.53, 2.03] as const;
export type Height = (typeof HEIGHTS)[number];

export const COLORS = ["Sem pintura", "Branca", "Preta", "Verde"] as const;
export type Color = (typeof COLORS)[number];

export const FASTENERS_PER_PANEL: Record<Height, number> = {
  1.03: 3,
  1.53: 4,
  2.03: 6,
};

export interface FenceInput {
  length: number;
  height: Height;
  color: Color;
}

export interface FenceResult extends FenceInput {
  panelLength: number;
  panels: number;
  soldLength: number;
  difference: number;
  posts: number;
  fasteners: number;
  screws: number;
}

function roundToCentimeters(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateFence(input: FenceInput): FenceResult {
  const panels = Math.ceil(input.length / PANEL_LENGTH);
  const soldLength = roundToCentimeters(panels * PANEL_LENGTH);
  const posts = panels + 1;

  return {
    ...input,
    panelLength: PANEL_LENGTH,
    panels,
    soldLength,
    difference: Math.max(0, roundToCentimeters(soldLength - input.length)),
    posts,
    fasteners: panels * FASTENERS_PER_PANEL[input.height],
    screws: posts * SCREWS_PER_POST,
  };
}

export function heightOptions() {
  return HEIGHTS.map((height) => ({
    height,
    fasteners: FASTENERS_PER_PANEL[height],
  }));
}
