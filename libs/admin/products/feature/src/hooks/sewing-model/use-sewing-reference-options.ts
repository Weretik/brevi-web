import {
  useListFabricsQuery,
  useListGarmentAccessoriesQuery,
  useListGarmentPartOperationsQuery,
} from '@admin/references/data-access';

type Kind = 'fabrics' | 'accessories' | 'operations';

/**
 * Reference lists for choosing a value in a side panel. They load only when a panel that needs
 * them is open, so the card itself makes one request (CAT-016).
 */
export function useSewingReferenceOptions(...kinds: Kind[]) {
  const fabrics = useListFabricsQuery(undefined, { skip: !kinds.includes('fabrics') });
  const accessories = useListGarmentAccessoriesQuery(undefined, {
    skip: !kinds.includes('accessories'),
  });
  const operations = useListGarmentPartOperationsQuery(undefined, {
    skip: !kinds.includes('operations'),
  });
  const queries = [fabrics, accessories, operations];
  return {
    fabrics: fabrics.data ?? [],
    accessories: accessories.data ?? [],
    operations: operations.data ?? [],
    loading: queries.some((query) => query.isLoading),
    error: queries.some((query) => query.isError)
      ? 'Не вдалося завантажити довідник для вибору.'
      : null,
  };
}
