import { useListSuppliersQuery } from '@admin/references/data-access';
import { useParams } from 'react-router-dom';

/** The supplier of `/references/counterparties/suppliers/:supplierId` from the suppliers list. */
export function useSupplierCard() {
  const { supplierId = '' } = useParams();
  const id = Number(supplierId);
  const list = useListSuppliersQuery();
  const supplier = list.data?.find((row) => row.id === id);
  return {
    supplier,
    loading: list.isLoading,
    failed: list.isError,
    missing: list.isSuccess && !supplier,
    retry: () => void list.refetch(),
    nextId: (list.data ?? []).reduce((largest, row) => Math.max(largest, row.id), 0) + 1,
  };
}
