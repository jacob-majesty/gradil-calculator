export type Height = 1.03 | 1.53 | 2.03;
export type Color = "Sem pintura" | "Branca" | "Preta" | "Verde";

export interface HeightOption {
  height: Height;
  fasteners: number;
}

export interface Options {
  heights: HeightOption[];
  colors: Color[];
  panelLength: number;
  screwsPerPost: number;
}

export interface FenceResult {
  length: number;
  height: Height;
  color: Color;
  panelLength: number;
  panels: number;
  soldLength: number;
  difference: number;
  posts: number;
  fasteners: number;
  screws: number;
}

export interface Order {
  id: number;
  length: number;
  height: Height;
  color: Color;
  confirmedAt: string;
}

export interface CalculateResponse {
  result: FenceResult;
  order: Order | null;
}
