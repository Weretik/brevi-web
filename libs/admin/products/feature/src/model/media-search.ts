import type { ProductMedia } from '@admin/products/data-access';

export function filterProductMedia(media: readonly ProductMedia[], search: string): ProductMedia[] {
  const normalizedSearch = search.trim().toLocaleLowerCase('uk-UA');
  if (!normalizedSearch) return [...media];
  return media.filter((item) =>
    item.originalFileName.toLocaleLowerCase('uk-UA').includes(normalizedSearch),
  );
}
