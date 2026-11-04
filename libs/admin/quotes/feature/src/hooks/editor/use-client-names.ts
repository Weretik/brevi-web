import { useListCustomersQuery } from '@admin/clients/data-access';
import { useDeferredValue, useState } from 'react';

/** KeepinCRM client names for the internal name field; the field still accepts any text. */
export function useClientNames() {
  const [search, setSearch] = useState('');
  const deferred = useDeferredValue(search.trim());
  const query = useListCustomersQuery(
    { search: deferred, active: true, page: 1, pageSize: 20 },
    { skip: deferred.length < 2 },
  );
  return {
    names: query.data?.rows.map((row) => row.displayName) ?? [],
    search: setSearch,
  };
}
