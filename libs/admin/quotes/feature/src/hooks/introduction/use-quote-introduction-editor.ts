import {
  toSaveQuoteIntroductionInput,
  useCreateQuoteIntroductionMutation,
  useGetQuoteIntroductionSetupQuery,
  useGetQuoteQuery,
  useLazyGetQuoteCatalogProductsQuery,
  useSaveQuoteIntroductionMutation,
} from '@admin/quotes/data-access';
import {
  applyIntroTemplate,
  chooseIntroFabric,
  chooseIntroModel,
  emptyIntroDraft,
  introToDraft,
  mainProductsOf,
  quoteIntroErrors,
  setIntroLayout,
  updateIntroSlot,
} from '@admin/quotes/model';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useIntroProducts } from './use-intro-products';

import type {
  Quote,
  QuoteCatalogProduct,
  QuoteCatalogVariant,
  QuoteIntroDraft,
  QuoteIntroLayout,
  QuoteIntroSlotDraft,
  QuoteIntroTemplate,
  QuoteStartPrefill,
} from '@admin/quotes/model';

const messageOf = (error: unknown, fallback: string) =>
  (error as { message?: string } | undefined)?.message ?? fallback;

const snapshot = (draft: QuoteIntroDraft | null) =>
  draft ? JSON.stringify(toSaveQuoteIntroductionInput(draft)) : '';

/**
 * «КП для знайомства»: starts a new selection from the setup or loads a saved one, keeps the draft and saves it
 * whole. A 409 is a stale version or a page rule the server checked (shown as it is).
 */
export function useQuoteIntroductionEditor(
  id: number | null,
  prefill: QuoteStartPrefill | null = null,
) {
  const navigate = useNavigate();
  const setup = useGetQuoteIntroductionSetupQuery();
  const loaded = useGetQuoteQuery(id ?? 0, { skip: id === null });
  const [createIntroduction, creating] = useCreateQuoteIntroductionMutation();
  const [saveIntroduction, saving] = useSaveQuoteIntroductionMutation();
  const [loadProducts] = useLazyGetQuoteCatalogProductsQuery();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [draft, setDraft] = useState<QuoteIntroDraft | null>(null);
  const [baseline, setBaseline] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [saveError, setSaveError] = useState<{ message: string; stale: boolean } | null>(null);
  const { products, remember } = useIntroProducts(setup.data, draft);

  const start = (next: QuoteIntroDraft, saved: Quote | null) => {
    setQuote(saved);
    setDraft(next);
    setBaseline(snapshot(next));
    setShowErrors(false);
  };

  useEffect(() => {
    if (id === null && setup.data && draft === null)
      start({ ...emptyIntroDraft(setup.data), ...prefill }, null);
  }, [id, setup.data]);

  useEffect(() => {
    if (loaded.data?.kind === 'Introduction') start(introToDraft(loaded.data), loaded.data);
  }, [loaded.data]);

  const errors = useMemo(() => (draft ? quoteIntroErrors(draft) : {}), [draft]);
  const change = (patch: Partial<QuoteIntroDraft>) =>
    setDraft((current) => (current ? { ...current, ...patch } : current));
  const changeSlot = (
    slot: QuoteIntroSlotDraft,
    next: (slot: QuoteIntroSlotDraft) => QuoteIntroSlotDraft,
  ) => setDraft((current) => (current ? updateIntroSlot(current, slot.key, next) : current));

  const save = async (): Promise<Quote | null> => {
    if (!draft) return null;
    setShowErrors(true);
    setSaveError(null);
    if (Object.keys(errors).length > 0) return null;
    try {
      const saved =
        quote === null
          ? await createIntroduction(draft).unwrap()
          : await saveIntroduction({ id: quote.id, draft }).unwrap();
      start(introToDraft(saved), saved);
      if (id === null) navigate(`/crm/quote-introductions/${saved.id}`, { replace: true });
      return saved;
    } catch (error) {
      const message = messageOf(error, 'Не вдалося зберегти КП.');
      setSaveError({
        message,
        stale:
          (error as { status?: number }).status === 409 &&
          quote !== null &&
          /іншому вікні/.test(message),
      });
      return null;
    }
  };

  return {
    quote,
    draft,
    setup: setup.data ?? null,
    products,
    loading: setup.isLoading || (id !== null && loaded.isLoading),
    loadError: setup.isError
      ? messageOf(setup.error, 'Не вдалося підготувати добірку.')
      : id !== null && loaded.isError
        ? messageOf(loaded.error, 'Не вдалося відкрити КП.')
        : null,
    /** A КП «під запит» opened by this address. */
    wrongKind: loaded.data !== undefined && loaded.data.kind !== 'Introduction',
    dirty: draft !== null && snapshot(draft) !== baseline,
    errors: showErrors ? errors : {},
    change,
    setLayout: (layout: QuoteIntroLayout) =>
      setDraft((current) =>
        current && setup.data
          ? setIntroLayout(current, layout, mainProductsOf(setup.data))
          : current,
      ),
    chooseModel: (
      slot: QuoteIntroSlotDraft,
      product: QuoteCatalogProduct,
      variant: QuoteCatalogVariant | null,
    ) => {
      remember([product]);
      changeSlot(slot, (current) => chooseIntroModel(current, product, variant));
    },
    chooseFabric: (slot: QuoteIntroSlotDraft, articleId: number | null) => {
      const variant =
        products.get(slot.productId ?? 0)?.variants.find((x) => x.articleId === articleId) ?? null;
      changeSlot(slot, (current) => chooseIntroFabric(current, variant));
    },
    clearSlot: (slot: QuoteIntroSlotDraft) =>
      changeSlot(slot, (current) => ({
        ...current,
        itemId: null,
        productId: null,
        articleId: null,
        name: '',
        photoUrl: null,
        fabricTitle: null,
        problem: null,
      })),
    /** «Готові шаблони»: fills the selection with current Catalog data. */
    applyTemplate: async (template: QuoteIntroTemplate) => {
      const ids = [
        ...new Set(template.pages.flatMap((page) => page.models.map((x) => x.productId))),
      ];
      const fresh = await loadProducts(ids).unwrap();
      remember(fresh);
      const map = new Map(fresh.map((product) => [product.productId, product]));
      setDraft((current) => (current ? applyIntroTemplate(current, template, map) : current));
    },
    /** «Нова добірка». */
    restart: () => {
      if (!setup.data) return;
      start(emptyIntroDraft(setup.data), null);
      setSaveError(null);
      if (id !== null) navigate('/crm/quote-introductions/new');
    },
    applyServerQuote: (next: Quote) => start(introToDraft(next), next),
    reload: async () => {
      setSaveError(null);
      const fresh = await loaded.refetch();
      if (fresh.data) start(introToDraft(fresh.data), fresh.data);
    },
    save,
    saving: creating.isLoading || saving.isLoading,
    saveError,
  };
}
