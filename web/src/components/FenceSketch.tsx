import { useId } from "react";
import type { Color } from "../types";

const MAX_PANELS_IN_SKETCH = 12;

const PALETTES: Record<
  Color,
  { post: string; panelBorder: string; mesh: string }
> = {
  "Sem pintura": { post: "#5b6470", panelBorder: "#8a94a1", mesh: "#a5aeb9" },
  Branca: { post: "#dbe2ea", panelBorder: "#94a3b8", mesh: "#a8b4c2" },
  Preta: { post: "#1f2937", panelBorder: "#374151", mesh: "#4b5563" },
  Verde: { post: "#2f6b45", panelBorder: "#3f7d57", mesh: "#5f9a74" },
};

interface FenceSketchProps {
  panels: number;
  height: number;
  color: Color;
}

export function FenceSketch({ panels, height, color }: FenceSketchProps) {
  const rawId = useId();
  const meshId = `mesh-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const palette = PALETTES[color];
  const shownPanels = Math.min(panels, MAX_PANELS_IN_SKETCH);

  const margin = 14;
  const postWidth = 11;
  const panelWidth = 52;
  const groundY = 142;
  const maxFenceHeight = 100;
  const fenceHeight = Math.round(maxFenceHeight * (height / 2.03));
  const topY = groundY - fenceHeight;
  const width = margin * 2 + shownPanels * panelWidth + (shownPanels + 1) * postWidth;
  const posts = Array.from({ length: shownPanels + 1 }, (_, index) => ({
    key: index,
    x: margin + index * (panelWidth + postWidth),
  }));

  return (
    <figure className="sketch">
      <svg viewBox={`0 0 ${width} 160`} role="img" aria-label="Esboço da cerca Gradil">
        <defs>
          <pattern id={meshId} width="7" height="7" patternUnits="userSpaceOnUse">
            <path
              d="M0 0H7M0 0V7"
              fill="none"
              stroke={palette.mesh}
              strokeWidth="0.8"
            />
          </pattern>
        </defs>

        <line
          x1="4"
          y1={groundY}
          x2={width - 4}
          y2={groundY}
          stroke="#cbd5d1"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {Array.from({ length: shownPanels }, (_, index) => {
          const x = margin + index * (panelWidth + postWidth) + postWidth;

          return (
            <rect
              key={`panel-${index}`}
              x={x}
              y={topY + 7}
              width={panelWidth}
              height={Math.max(fenceHeight - 14, 10)}
              fill={`url(#${meshId})`}
              stroke={palette.panelBorder}
              strokeWidth="1.5"
              rx="1"
            />
          );
        })}

        {posts.map((post) => (
          <rect
            key={`post-${post.key}`}
            x={post.x}
            y={topY}
            width={postWidth}
            height={fenceHeight}
            fill={palette.post}
            stroke={palette.panelBorder}
            strokeWidth="0.8"
            rx="2"
          />
        ))}
      </svg>

      <figcaption>
        Esboço simplificado com {shownPanels} {shownPanels === 1 ? "tela" : "telas"}
        {panels > shownPanels ? ` (de ${panels} no total)` : ""}.
      </figcaption>
    </figure>
  );
}
