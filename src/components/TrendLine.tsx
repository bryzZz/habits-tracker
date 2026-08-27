import type { FC } from "react";

interface TrendLineProps {
  points: { date: string; score: number }[];
}

const WIDTH = 640;
const HEIGHT = 180;

export const TrendLine: FC<TrendLineProps> = ({ points }) => {
  if (points.length === 0) {
    return (
      <div className="flex h-45 items-center justify-center text-sm text-ink-muted">
        Нет данных за этот период
      </div>
    );
  }

  const coords = points.map((p, i) => ({
    x: points.length === 1 ? 0 : (i / (points.length - 1)) * WIDTH,
    y: HEIGHT - p.score * HEIGHT,
  }));
  const last = coords[coords.length - 1];
  const lastScore = Math.round(points[points.length - 1].score * 10);

  return (
    <svg
      viewBox={`0 0 ${WIDTH + 40} ${HEIGHT + 30}`}
      className="h-auto w-full overflow-visible"
    >
      <line x1={0} y1={0} x2={WIDTH} y2={0} stroke="#2c2c2a" strokeWidth={1} />

      <line
        x1={0}
        y1={HEIGHT / 2}
        x2={WIDTH}
        y2={HEIGHT / 2}
        stroke="#2c2c2a"
        strokeWidth={1}
      />

      <line
        x1={0}
        y1={HEIGHT}
        x2={WIDTH}
        y2={HEIGHT}
        stroke="#383835"
        strokeWidth={1}
      />

      <text x={WIDTH + 8} y={4} fill="#898781" fontSize={11}>
        10
      </text>

      <text x={WIDTH + 8} y={HEIGHT / 2 + 4} fill="#898781" fontSize={11}>
        5
      </text>

      <text x={WIDTH + 8} y={HEIGHT + 4} fill="#898781" fontSize={11}>
        0
      </text>

      <polyline
        points={coords.map((c) => `${c.x},${c.y}`).join(" ")}
        fill="none"
        stroke="#3987e5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx={last.x}
        cy={last.y}
        r={4}
        fill="#3987e5"
        stroke="#1a1a19"
        strokeWidth={2}
      />

      <text
        x={last.x}
        y={last.y - 14}
        fill="#ffffff"
        fontSize={13}
        fontWeight={700}
        textAnchor="middle"
      >
        {lastScore}
      </text>
    </svg>
  );
};
