import type { CatalogProductType } from './catalog-tree';

/** Order of a listing: as staff arranged the category, or by the lowest price. */
export type CatalogSort = 'default' | 'cheap' | 'expensive';

/** A price range of a listing; `null` ends are open: «до 1 000», «1 000 – 1 500», «понад 1 500». */
export type CatalogPriceBand = { key: string; min: number | null; max: number | null };

/** What the visitor chose above a listing; `null` means «any». */
export type CatalogListingChoice = {
  type: CatalogProductType | null;
  band: string | null;
  sort: CatalogSort;
};

export const CATALOG_SORTS: readonly CatalogSort[] = ['default', 'cheap', 'expensive'];

export const EMPTY_CATALOG_CHOICE: CatalogListingChoice = {
  type: null,
  band: null,
  sort: 'default',
};

/** Fewer priced models than this get no price filter: three ranges of one or two models help nobody. */
const MIN_PRICED_FOR_BANDS = 6;

/** A round border near `value`: to 10 hryvnias under 100, to 50 under 1 000, to 100 above. */
function roundBorder(value: number): number {
  const step = value < 100 ? 10 : value < 1000 ? 50 : 100;
  return Math.max(step, Math.round(value / step) * step);
}

/**
 * Three price ranges that split the priced models of a listing into about equal thirds, with round borders.
 * A listing with few priced models, or with prices too close to split, gets none.
 */
export function catalogPriceBands(prices: readonly (number | null)[]): readonly CatalogPriceBand[] {
  const sorted = prices.filter((price): price is number => price !== null).sort((a, b) => a - b);
  if (sorted.length < MIN_PRICED_FOR_BANDS) return [];
  const low = roundBorder(sorted[Math.floor(sorted.length / 3)]);
  const high = roundBorder(sorted[Math.floor((sorted.length * 2) / 3)]);
  if (high <= low || low <= sorted[0] || high > sorted[sorted.length - 1]) return [];
  return [
    { key: `0-${low}`, min: null, max: low },
    { key: `${low}-${high}`, min: low, max: high },
    { key: `${high}-`, min: high, max: null },
  ];
}

function inBand(price: number | null, band: CatalogPriceBand): boolean {
  if (price === null) return false;
  return (band.min === null || price >= band.min) && (band.max === null || price < band.max);
}

/**
 * The products a listing shows for the choice: of the chosen kind, in the chosen price range, in the chosen
 * order. A product without a price is outside every range and comes last when sorted by price.
 */
export function applyCatalogChoice<
  T extends { type: CatalogProductType; priceFrom: number | null },
>(products: readonly T[], choice: CatalogListingChoice, bands: readonly CatalogPriceBand[]): T[] {
  const band = bands.find((item) => item.key === choice.band) ?? null;
  const shown = products.filter(
    (product) =>
      (choice.type === null || product.type === choice.type) &&
      (band === null || inBand(product.priceFrom, band)),
  );
  if (choice.sort === 'default') return shown;
  const direction = choice.sort === 'cheap' ? 1 : -1;
  return shown
    .map((product, index) => ({ product, index }))
    .sort((a, b) => {
      const x = a.product.priceFrom;
      const y = b.product.priceFrom;
      if (x === null || y === null) return x === y ? a.index - b.index : x === null ? 1 : -1;
      return (x - y) * direction || a.index - b.index;
    })
    .map((entry) => entry.product);
}

/** How many filters are on, for the «Фільтри · 2» button; the order does not count. */
export function countCatalogFilters(choice: CatalogListingChoice): number {
  return (choice.type === null ? 0 : 1) + (choice.band === null ? 0 : 1);
}

/** The choice from the address `?type=Sewing&price=1000-1500&sort=cheap`; unknown values are ignored. */
export function readCatalogChoice(
  params: URLSearchParams,
  bands: readonly CatalogPriceBand[],
): CatalogListingChoice {
  const type = params.get('type');
  const band = params.get('price');
  const sort = params.get('sort');
  return {
    type: type === 'Sewing' || type === 'Ppe' ? type : null,
    band: bands.some((item) => item.key === band) ? band : null,
    sort: CATALOG_SORTS.includes(sort as CatalogSort) ? (sort as CatalogSort) : 'default',
  };
}

/** The address query of a choice, empty for «any»; other parameters of the address are kept. */
export function writeCatalogChoice(
  params: URLSearchParams,
  choice: CatalogListingChoice,
): URLSearchParams {
  const next = new URLSearchParams(params);
  const set = (key: string, value: string | null) =>
    value === null ? next.delete(key) : next.set(key, value);
  set('type', choice.type);
  set('price', choice.band);
  set('sort', choice.sort === 'default' ? null : choice.sort);
  return next;
}
