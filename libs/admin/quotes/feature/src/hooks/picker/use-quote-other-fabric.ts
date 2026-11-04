import {
  useCalculateQuoteCustomSewingMutation,
  useGetQuoteModelCompositionQuery,
} from '@admin/quotes/data-access';
import { parseCustomQuantity, pricedOptionDraft } from '@admin/quotes/model';
import { useListFabricsQuery } from '@admin/references/data-access';
import { useEffect, useMemo, useState } from 'react';

import type {
  QuoteCustomSewingVariantPrice,
  QuoteItemDraft,
  QuoteOptionDraft,
} from '@admin/quotes/model';
import type { QuoteCustomChoice } from '@admin/quotes/ui';

const delayMs = 400;
const money = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

/**
 * «Інша тканина з довідника» for a Catalog model (R-27): any active fabric with its metres, priced a moment after
 * each change by the Catalog formula with the model's shared accessories and operations.
 */
export function useQuoteOtherFabric(item: QuoteItemDraft) {
  const composition = useGetQuoteModelCompositionQuery(item.productId ?? 0, {
    skip: item.productId === null,
  });
  const fabrics = useListFabricsQuery();
  const [calculate, calculation] = useCalculateQuoteCustomSewingMutation();
  const [fabric, setFabric] = useState<QuoteCustomChoice | null>(null);
  const [meters, setMeters] = useState<string | null>(null);
  const [result, setResult] = useState<{
    key: string;
    price: QuoteCustomSewingVariantPrice;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Metres start from the model's first variant: the same cut in another fabric.
  const defaultMeters = composition.data?.fabrics[0]?.meters;
  const metersText = meters ?? (defaultMeters ? String(defaultMeters).replace('.', ',') : '');
  const amount = parseCustomQuantity(metersText);

  const used = useMemo(
    () => new Set(item.options.flatMap((x) => x.fabrics.map((f) => f.fabricId))),
    [item.options],
  );
  const choices = useMemo(
    () =>
      (fabrics.data ?? [])
        .filter((x) => x.isActive && !used.has(x.id))
        .map<QuoteCustomChoice>((x) => ({
          id: x.id,
          label: x.name,
          hint: `${money.format(x.price)} грн/м · ${x.providerName}`,
        })),
    [fabrics.data, used],
  );

  const request = useMemo(() => {
    if (!fabric || amount === null || !composition.data) return null;
    return {
      variants: [{ fabrics: [{ fabricId: fabric.id, meters: amount }] }],
      lines: composition.data.lines.map((line) => ({
        kind: line.kind,
        referenceId: line.referenceId,
        quantity: line.quantity,
        manualMinutes: line.manualMinutes,
        costCode: line.costCode,
      })),
    };
  }, [fabric, amount, composition.data]);
  const requestKey = request ? JSON.stringify(request) : '';

  useEffect(() => {
    if (!request) return undefined;
    const timer = setTimeout(() => {
      calculate(request)
        .unwrap()
        .then((price) => {
          setResult({ key: requestKey, price: price.variants[0] });
          setError(null);
        })
        .catch((reason: { message?: string }) =>
          setError(reason.message ?? 'Не вдалося порахувати ціну.'),
        );
    }, delayMs);
    return () => clearTimeout(timer);
    // The key stands for the request: a new object with the same content must not price again.
  }, [requestKey, calculate]);

  const price = result && result.key === requestKey ? result.price : null;
  return {
    choices,
    fabric,
    meters: metersText,
    price,
    error,
    loading: fabrics.isLoading || composition.isLoading,
    calculating: calculation.isLoading,
    unavailable: composition.isError,
    /** Something is chosen: the panel adds this row only when it is priced. */
    started: fabric !== null,
    ready: price?.prices != null && !calculation.isLoading,
    choose: setFabric,
    setMeters,
    /** The КП row; null until it is priced. */
    option: (): QuoteOptionDraft | null =>
      fabric && amount !== null && price?.prices
        ? pricedOptionDraft(price, [{ fabricId: fabric.id, name: fabric.label, meters: amount }])
        : null,
  };
}
