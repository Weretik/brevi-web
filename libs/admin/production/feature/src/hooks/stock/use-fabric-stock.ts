import { useGetFabricStockQuery } from '@admin/production/data-access';
import { stockColorKey } from '@admin/production/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';

/** «Склад тканин» with its totals and what the person may do. */
export function useFabricStock() {
  const { data, isLoading, isFetching, error, refetch } = useGetFabricStockQuery();
  const rows = data?.rows ?? [];
  return {
    rows,
    totals: data?.totals ?? null,
    permissions: data?.permissions ?? { canMove: false, seesValue: false },
    loading: isLoading || isFetching,
    error: error ? adminApiErrorMessage(error, 'Не вдалося завантажити склад.') : null,
    reload: refetch,
    /** The version of the line of this fabric and colour, or null when there is none yet. */
    versionOf: (fabricId: number, color: string) =>
      rows.find(
        (row) =>
          row.id !== null &&
          row.fabricId === fabricId &&
          row.color &&
          stockColorKey(row.color) === stockColorKey(color),
      )?.version ?? null,
  };
}
