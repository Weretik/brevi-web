import { useCalculateQuoteCustomSewingMutation } from '@admin/quotes/data-access';
import {
  addCustomFabric,
  addCustomLine,
  addCustomVariant,
  customSewingDraft,
  customSewingErrors,
  customSewingItemDraft,
  customSewingPriceRequest,
  recommendCustomVariant,
  removeCustomFabric,
  removeCustomVariant,
  setCustomFabricMeters,
} from '@admin/quotes/model';
import {
  useListFabricsQuery,
  useListGarmentAccessoriesQuery,
  useListGarmentPartOperationsQuery,
} from '@admin/references/data-access';
import { useEffect, useMemo, useState } from 'react';

import type {
  QuoteCustomSewingDraft,
  QuoteCustomSewingPrice,
  QuoteItemDraft,
  QuoteModelComposition,
} from '@admin/quotes/model';
import type { QuoteCustomChoice } from '@admin/quotes/ui';

const delayMs = 400;
const money = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

/**
 * The «Виріб з нуля» panel: the composition the manager builds, reference choices, and the price the server
 * recalculates a moment after every change.
 */
export function useQuoteCustomSewing(item?: QuoteItemDraft, model?: QuoteModelComposition) {
  const [draft, setDraft] = useState<QuoteCustomSewingDraft>(() => customSewingDraft(item, model));
  const fabrics = useListFabricsQuery();
  const accessories = useListGarmentAccessoriesQuery();
  const operations = useListGarmentPartOperationsQuery();
  const [calculate, calculation] = useCalculateQuoteCustomSewingMutation();
  const [result, setResult] = useState<{ key: string; price: QuoteCustomSewingPrice } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const request = useMemo(() => customSewingPriceRequest(draft), [draft]);
  const requestKey = request ? JSON.stringify(request) : '';

  useEffect(() => {
    if (!request) return undefined;
    const timer = setTimeout(() => {
      calculate(request)
        .unwrap()
        .then((price) => {
          setResult({ key: requestKey, price });
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
  const missing = customSewingErrors(draft);
  const priced = price !== null && price.variants.every((variant) => variant.prices !== null);

  const choices = useMemo(() => {
    return {
      /** All active fabrics; the panel leaves out the ones a variant already has. */
      fabrics: (fabrics.data ?? [])
        .filter((x) => x.isActive)
        .map<QuoteCustomChoice>((x) => ({
          id: x.id,
          label: x.name,
          hint: `${money.format(x.price)} грн/м · ${x.providerName}`,
        })),
      accessories: (accessories.data ?? [])
        .filter((x) => x.isActive)
        .map<QuoteCustomChoice>((x) => ({
          id: x.id,
          label: x.name,
          hint: `${money.format(x.price)} грн за ${x.unit}`,
        })),
      operations: (operations.data ?? [])
        .filter((x) => x.isActive)
        .map<QuoteCustomChoice>((x) => ({
          id: x.id,
          label: [x.garmentPartName, x.name, x.variant].filter(Boolean).join(' · '),
          hint: x.minutesPerProduct ? 'час вказується для виробу' : `${money.format(x.min)} хв`,
        })),
    };
  }, [fabrics.data, accessories.data, operations.data]);

  const operationById = useMemo(
    () => new Map((operations.data ?? []).map((x) => [x.id, x])),
    [operations.data],
  );
  const accessoryById = useMemo(
    () => new Map((accessories.data ?? []).map((x) => [x.id, x])),
    [accessories.data],
  );

  return {
    draft,
    price,
    missing,
    error,
    calculating: calculation.isLoading,
    loadingReferences: fabrics.isLoading || accessories.isLoading || operations.isLoading,
    referencesError: fabrics.isError || accessories.isError || operations.isError,
    choices,
    canAdd: missing.length === 0 && priced && !calculation.isLoading,
    change: (patch: Partial<Pick<QuoteCustomSewingDraft, 'name' | 'description'>>) =>
      setDraft((current) => ({ ...current, ...patch })),
    addVariant: () => setDraft(addCustomVariant),
    removeVariant: (variantKey: string) =>
      setDraft((current) => removeCustomVariant(current, variantKey)),
    recommend: (variantKey: string) =>
      setDraft((current) => recommendCustomVariant(current, variantKey)),
    addFabric: (variantKey: string, choice: QuoteCustomChoice) =>
      setDraft((current) =>
        addCustomFabric(current, variantKey, { id: choice.id, name: choice.label }),
      ),
    setMeters: (variantKey: string, fabricKey: string, meters: string) =>
      setDraft((current) => setCustomFabricMeters(current, variantKey, fabricKey, meters)),
    removeFabric: (variantKey: string, fabricKey: string) =>
      setDraft((current) => removeCustomFabric(current, variantKey, fabricKey)),
    addAccessory: (choice: QuoteCustomChoice) =>
      setDraft((current) =>
        addCustomLine(current, {
          kind: 'Accessory',
          referenceId: choice.id,
          name: choice.label,
          unit: accessoryById.get(choice.id)?.unit ?? 'шт.',
          needsMinutes: false,
        }),
      ),
    addOperation: (choice: QuoteCustomChoice) =>
      setDraft((current) =>
        addCustomLine(current, {
          kind: 'Operation',
          referenceId: choice.id,
          name: choice.label,
          unit: 'хв',
          needsMinutes: operationById.get(choice.id)?.minutesPerProduct ?? false,
        }),
      ),
    setLine: (key: string, patch: { quantity?: string; minutes?: string }) =>
      setDraft((current) => ({
        ...current,
        lines: current.lines.map((x) => (x.key === key ? { ...x, ...patch } : x)),
      })),
    removeLine: (key: string) =>
      setDraft((current) => ({
        ...current,
        lines: current.lines.filter((x) => x.key !== key),
      })),
    /** The КП item; call only when `canAdd`. */
    build: (): QuoteItemDraft => customSewingItemDraft(draft, request!, price!, item),
  };
}
