import { useCalculateEmbroideryQuery } from '@admin/embroidery/data-access';
import {
  embroideryValuesFromRequest,
  emptyEmbroideryCalculation,
  needsEmbroideryMachineTime,
  tickEmbroideryExpense,
  toEmbroideryCalculationRequest,
  validateEmbroideryCalculation,
  visibleEmbroideryExpenses,
} from '@admin/embroidery/model';
import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useMemo, useState } from 'react';

import type {
  EmbroideryCalculationRequest,
  EmbroideryCalculationValues,
  EmbroideryFormExpense,
  EmbroideryFormSetup,
} from '@admin/embroidery/model';

/** The price waits this long after the last keystroke. */
export const embroideryCalculationDelayMs = 300;

/**
 * «Розрахунок»: the typed form and the live price. The server computes the price, so a Manager never gets
 * the rates; the request goes only when the form has no problems.
 */
export function useEmbroideryCalculation(setup: EmbroideryFormSetup) {
  const [values, setValues] = useState<EmbroideryCalculationValues>(() =>
    emptyEmbroideryCalculation(setup),
  );
  const errors = useMemo(() => validateEmbroideryCalculation(values), [values]);
  const request = useMemo(
    () => (Object.keys(errors).length ? null : toEmbroideryCalculationRequest(values)),
    [errors, values],
  );
  const key = request ? JSON.stringify(request) : null;
  const [sent, setSent] = useState<EmbroideryCalculationRequest | null>(request);

  useEffect(() => {
    if (!key) {
      setSent(null);
      return;
    }
    const timer = setTimeout(
      () => setSent(JSON.parse(key) as EmbroideryCalculationRequest),
      embroideryCalculationDelayMs,
    );
    return () => clearTimeout(timer);
  }, [key]);

  // A hoop removed in «Налаштування» falls back to the default one.
  useEffect(() => {
    if (!setup.hoops.some((hoop) => hoop.id === values.hoopId))
      setValues((current) => ({ ...current, hoopId: emptyEmbroideryCalculation(setup).hoopId }));
  }, [setup, values.hoopId]);

  const result = useCalculateEmbroideryQuery(sent ?? skipToken);
  const waiting = values.quantity === null || values.stitchesPerUnit === null;

  return {
    values,
    errors,
    hoops: setup.hoops,
    expenses: visibleEmbroideryExpenses(setup, values.mode),
    needsMachineTime: needsEmbroideryMachineTime(setup, values),
    /** Quantity or stitches are still empty. */
    waiting,
    calculation: sent ? (result.data ?? null) : null,
    /** The request behind the shown price, for «Зберегти розрахунок»; null while typing. */
    priced: sent && !result.isFetching && key === JSON.stringify(sent) ? sent : null,
    fetching: Boolean(sent) && (result.isFetching || key !== JSON.stringify(sent)),
    requestError: result.isError
      ? ((result.error as { message?: string } | undefined)?.message ??
        'Не вдалося порахувати ціну.')
      : null,
    retry: () => void result.refetch(),
    change: (patch: Partial<EmbroideryCalculationValues>) =>
      setValues((current) => ({ ...current, ...patch })),
    tick: (expense: EmbroideryFormExpense, ticked: boolean) =>
      setValues((current) => tickEmbroideryExpense(current, expense, ticked)),
    clear: () => setValues(emptyEmbroideryCalculation(setup)),
    /** «Повторити розрахунок»: the saved form, priced again with the current rates. */
    load: (request: EmbroideryCalculationRequest) =>
      setValues(embroideryValuesFromRequest(request, setup)),
  };
}
