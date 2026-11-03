import { parseSewingCreateRoute } from '@admin/products/model';
import { useSearchParams } from 'react-router-dom';

import type { SewingCreateStep } from '@admin/products/model';

/** `?id=&step=` of «Нова модель», so the user can leave a draft and come back to it. */
export function useSewingCreateRoute() {
  const [params, setParams] = useSearchParams();
  const route = parseSewingCreateRoute(params.get('id'), params.get('step'));

  return {
    ...route,
    goTo: (step: SewingCreateStep) =>
      setParams((current) => {
        const copy = new URLSearchParams(current);
        copy.set('step', String(step));
        return copy;
      }),
    openDraft: (id: number) => setParams({ id: String(id), step: '2' }, { replace: true }),
  };
}
