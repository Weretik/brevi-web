import {
  useListPpeMarkupRulesQuery,
  useListProductSectionsQuery,
  useListSuppliersQuery,
} from '@admin/references/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useMemo } from 'react';

/** Lists of «Новий ЗІЗ»: active PPE sections, active suppliers and PPE markup rules. */
export function usePpeCreateLookups() {
  const sectionsResult = useListProductSectionsQuery();
  const suppliersResult = useListSuppliersQuery();
  const rulesResult = useListPpeMarkupRulesQuery();
  const sections = useMemo(
    () =>
      (sectionsResult.data ?? [])
        .filter((section) => section.type === 'Ppe' && section.isActive)
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map(({ id, name }) => ({ id, name })),
    [sectionsResult.data],
  );
  const suppliers = useMemo(
    () =>
      (suppliersResult.data ?? [])
        .filter((supplier) => supplier.isActive)
        .map(({ id, name, isActive }) => ({ id, name, isActive }))
        .sort((a, b) => a.name.localeCompare(b.name, 'uk')),
    [suppliersResult.data],
  );
  const rules = useMemo(
    () => [...(rulesResult.data ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    [rulesResult.data],
  );
  const failure = sectionsResult.error ?? suppliersResult.error ?? rulesResult.error;

  return {
    sections,
    suppliers,
    rules,
    loading: sectionsResult.isLoading || suppliersResult.isLoading || rulesResult.isLoading,
    error: failure ? adminApiErrorMessage(failure, 'Не вдалося завантажити списки.') : null,
    reload: () => {
      void sectionsResult.refetch();
      void suppliersResult.refetch();
      void rulesResult.refetch();
    },
  };
}
