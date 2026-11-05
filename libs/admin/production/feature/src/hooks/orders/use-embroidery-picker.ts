import { useGetProductionEmbroideriesQuery } from '@admin/production/data-access';
import { useState } from 'react';

import { useDebouncedValue } from '../requests/use-debounced-value';

import type { EmbroideryPicker } from '@admin/production/ui';

/** «Розрахунок вишивки»: the newest saved calculations, or those matching the typed text. */
export function useEmbroideryPicker(): EmbroideryPicker {
  const [search, setSearch] = useState('');
  const query = useGetProductionEmbroideriesQuery(useDebouncedValue(search));
  return { options: query.data ?? [], loading: query.isFetching, onSearch: setSearch };
}
