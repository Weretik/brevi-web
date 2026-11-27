import { readCardPeriod, writeCardPeriod } from '@admin/shared/ui';
import { useSearchParams } from 'react-router-dom';

import type { CardPeriodState } from '@admin/shared/ui';

/** The card's period in `?period=&from=&to=`: one choice for every tab, kept on reload. */
export function useCardPeriod() {
  const [params, setParams] = useSearchParams();
  const period = readCardPeriod(params);
  const setPeriod = (next: CardPeriodState) =>
    setParams(writeCardPeriod(params, next), { replace: true });
  return { period, setPeriod, from: period.from, to: period.to };
}
