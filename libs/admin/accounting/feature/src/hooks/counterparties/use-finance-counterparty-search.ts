import {
  useCreateFinanceCounterpartyMutation,
  useGetFinanceCounterpartyChoicesQuery,
} from '@admin/accounting/data-access';
import { quickFinanceCounterpartyBody } from '@admin/accounting/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useDeferredValue, useState } from 'react';

import type { FinanceCounterpartyChoice } from '@admin/accounting/model';
import type { FinanceCounterpartySearch } from '@admin/accounting/ui';

/**
 * The counterparty field of an operation: server search over the three lists and «Додати «X» як
 * фінансового», which creates a confirmed finance counterparty and picks it.
 */
export function useFinanceCounterpartySearch(
  enabled: boolean,
  onPick: (choice: FinanceCounterpartyChoice) => void,
) {
  const [text, setText] = useState('');
  const search = useDeferredValue(text.trim());
  const query = useGetFinanceCounterpartyChoicesQuery(search, { skip: !enabled });
  const [create, createState] = useCreateFinanceCounterpartyMutation();
  const [error, setError] = useState<string | null>(null);

  async function add(name: string) {
    setError(null);
    try {
      const created = await create({
        ...quickFinanceCounterpartyBody(name),
        verified: true,
      }).unwrap();
      onPick({
        kind: 'Financial',
        id: created.id,
        name: created.name,
        hint: created.edrpou,
        verified: created.verified,
        defaultCategoryId: created.defaultCategoryId,
      });
    } catch (failure) {
      setError(adminApiErrorMessage(failure, 'Не вдалося додати контрагента.'));
    }
  }

  const field: FinanceCounterpartySearch = {
    options: query.data ?? [],
    loading: query.isFetching || createState.isLoading,
    disabled: createState.isLoading,
    onSearch: setText,
    onCreate: (name) => void add(name),
  };
  return { field, error };
}
