import { UKRAINE_OUTLINE, UKRAINE_POINTS, UKRAINE_VIEW_BOX } from './ukraine-outline';

import type { UkraineCity } from './ukraine-outline';

/** White outline under the names, so a name stays readable where a route crosses it. */
const HALO = {
  stroke: 'white',
  strokeWidth: 4,
  strokeLinejoin: 'round',
  paintOrder: 'stroke',
} as const;

/** Where a city name sits next to its dot, so the names do not cross the routes or the border. */
const LABEL_SIDE: Record<UkraineCity, 'start' | 'end'> = {
  kyiv: 'end',
  kharkiv: 'start',
  dnipro: 'start',
  odesa: 'end',
  lviv: 'start',
  zaporizhzhia: 'start',
};

/**
 * Stylised map of Ukraine: the country in the brand's light colour, stitched routes from Poltava (the
 * production, a large orange point) to the cities, and the city names. A picture with one label for screen
 * readers; the text next to it says the same in words.
 */
export function UkraineMap({
  label,
  production,
  productionNote,
  cities,
}: {
  label: string;
  /** City of the production, above its point, with a short note under it. */
  production: string;
  productionNote: string;
  cities: Record<UkraineCity, string>;
}) {
  const origin = UKRAINE_POINTS.poltava;
  const keys = Object.keys(LABEL_SIDE) as UkraineCity[];

  return (
    <svg viewBox={UKRAINE_VIEW_BOX} role="img" aria-label={label} className="h-auto w-full">
      <path
        d={UKRAINE_OUTLINE}
        className="fill-brand-surface stroke-brand-soft"
        strokeWidth={1.5}
      />
      {keys.map((key) => {
        const point = UKRAINE_POINTS[key];
        return (
          <line
            key={key}
            x1={origin.x}
            y1={origin.y}
            x2={point.x}
            y2={point.y}
            className="stroke-brand"
            strokeWidth={1.75}
            strokeDasharray="6 5"
            strokeLinecap="round"
          />
        );
      })}
      {keys.map((key) => {
        const point = UKRAINE_POINTS[key];
        const start = LABEL_SIDE[key] === 'start';
        return (
          <g key={key}>
            <circle cx={point.x} cy={point.y} r={5} className="fill-foreground" />
            <text
              x={point.x + (start ? 10 : -10)}
              y={point.y + 5}
              textAnchor={start ? 'start' : 'end'}
              className="fill-foreground text-[15px] font-bold"
              {...HALO}
            >
              {cities[key]}
            </text>
          </g>
        );
      })}
      <circle cx={origin.x} cy={origin.y} r={18} className="fill-brand/25" />
      <circle
        cx={origin.x}
        cy={origin.y}
        r={9}
        className="fill-brand stroke-background"
        strokeWidth={3}
      />
      <text
        x={origin.x}
        y={origin.y - 36}
        textAnchor="middle"
        className="fill-foreground text-[17px] font-extrabold"
        {...HALO}
      >
        {production}
      </text>
      <text
        x={origin.x}
        y={origin.y - 20}
        textAnchor="middle"
        className="fill-brand-text text-[12px] font-bold"
        {...HALO}
      >
        {productionNote}
      </text>
    </svg>
  );
}
