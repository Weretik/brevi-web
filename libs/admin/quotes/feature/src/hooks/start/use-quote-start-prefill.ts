import { readQuoteStartPrefill } from '@admin/quotes/model';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

/** Who a new КП is for, as chosen in «Нове КП»; read once when the editor opens. */
export function useQuoteStartPrefill() {
  const location = useLocation();
  const [prefill] = useState(() => readQuoteStartPrefill(location.state));
  return prefill;
}
