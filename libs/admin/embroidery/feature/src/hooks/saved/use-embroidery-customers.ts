import { useListCustomersQuery } from '@admin/clients/data-access';
import { useDeferredValue, useState } from 'react';

import type { EmbroideryCustomerOption } from '@admin/embroidery/ui';

/** Active clients of «Контрагенти» a saved calculation can point to; the search starts from two letters. */
export function useEmbroideryCustomers(enabled: boolean) {
  const [search, setSearch] = useState('');
  const deferred = useDeferredValue(search.trim());
  const query = useListCustomersQuery(
    { search: deferred, active: true, page: 1, pageSize: 20 },
    { skip: !enabled || deferred.length < 2 },
  );
  const options: EmbroideryCustomerOption[] =
    query.data?.rows.map((row) => ({ publicId: row.publicId, name: row.displayName })) ?? [];
  return { options, search: setSearch };
}
