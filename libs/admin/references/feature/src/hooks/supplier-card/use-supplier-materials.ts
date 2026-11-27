import { useListFabricsQuery, useListGarmentAccessoriesQuery } from '@admin/references/data-access';

import type { Supplier } from '@admin/references/model';

const same = (a: string | null | undefined, b: string) =>
  (a ?? '').trim().toLocaleLowerCase('uk') === b.trim().toLocaleLowerCase('uk');

/**
 * Fabrics and accessories of one supplier (CARD-001): a fabric by its supplier link or name, an accessory by
 * the supplier name typed on it (accessories keep no link yet).
 */
export function useSupplierMaterials(supplier: Supplier | undefined, skip: boolean) {
  const fabrics = useListFabricsQuery(undefined, { skip: skip || !supplier });
  const accessories = useListGarmentAccessoriesQuery(undefined, { skip: skip || !supplier });
  const id = supplier?.id;
  const name = supplier?.name ?? '';
  return {
    fabrics: (fabrics.data ?? []).filter(
      (row) => (row.providerId != null && row.providerId === id) || same(row.providerName, name),
    ),
    accessories: (accessories.data ?? []).filter((row) => same(row.supplierName, name)),
    loading: fabrics.isFetching || accessories.isFetching,
    failed: fabrics.isError || accessories.isError,
    retry: () => {
      void fabrics.refetch();
      void accessories.refetch();
    },
  };
}
