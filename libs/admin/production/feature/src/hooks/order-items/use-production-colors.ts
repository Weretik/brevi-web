import { useGetProductionColorsQuery } from '@admin/production/data-access';

/** Colours of «Кольори» for the item form; empty while loading. */
export function useProductionColors(): readonly string[] {
  return useGetProductionColorsQuery().data ?? noColors;
}

const noColors: readonly string[] = [];
