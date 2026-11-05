import { useGetPurchaseInvoicesQuery } from '@admin/purchasing/data-access';
import {
  defaultPurchaseInvoicePageSize,
  purchaseDocumentVats,
  purchaseInvoiceFilters,
  purchaseInvoicePageSizes,
} from '@admin/purchasing/model';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { PurchaseDocumentVat, PurchaseInvoiceFilter } from '@admin/purchasing/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

const filterOf = (value: string | null): PurchaseInvoiceFilter =>
  purchaseInvoiceFilters.find((filter) => filter === value) ?? 'All';

const dateOf = (value: string | null) =>
  value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;

const vatOf = (value: string | null): PurchaseDocumentVat | undefined =>
  purchaseDocumentVats.find((vat) => vat === value);

const pageSizeOf = (value: string | null) =>
  purchaseInvoicePageSizes.find((size) => String(size) === value) ?? defaultPurchaseInvoicePageSize;

/**
 * Server-side list state of «Рахунки на закупку», kept in the URL (`search`, `filter`, `from`, `to`,
 * `vat`, `page`, `pageSize`) next to `tab=purchases`. Search is sent 300 ms after typing stops.
 */
export function usePurchaseInvoiceList() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') ?? '';
  const filter = filterOf(params.get('filter'));
  const rawPage = Number(params.get('page') ?? '1');
  const page = Number.isInteger(rawPage) && rawPage > 0 && rawPage <= 1_000_000 ? rawPage : 1;
  const pageSize = pageSizeOf(params.get('pageSize'));
  const documentFrom = dateOf(params.get('from'));
  const documentTo = dateOf(params.get('to'));
  const vat = vatOf(params.get('vat'));
  const narrowing = { documentFrom, documentTo, vat };
  const [term, setTerm] = useState(search);

  const update = useCallback(
    (changes: Record<string, string | null>) =>
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === '') next.delete(key);
            else next.set(key, value);
          }
          return next;
        },
        { replace: true },
      ),
    [setParams],
  );

  useEffect(() => setTerm(search), [search]);
  useEffect(() => {
    const trimmed = term.trim();
    if (trimmed === search) return;
    const timer = setTimeout(() => update({ search: trimmed, page: null }), 300);
    return () => clearTimeout(timer);
  }, [term, search, update]);

  const list = useGetPurchaseInvoicesQuery({ search, filter, page, pageSize, ...narrowing });
  const count = (value: PurchaseInvoiceFilter) => ({
    search,
    filter: value,
    page: 1,
    pageSize: 1,
    ...narrowing,
  });
  const allCount = useGetPurchaseInvoicesQuery(count('All'));
  const reviewCount = useGetPurchaseInvoicesQuery(count('NeedsReview'));
  const withoutSupplierCount = useGetPurchaseInvoicesQuery(count('WithoutSupplier'));
  const notRecognizedCount = useGetPurchaseInvoicesQuery(count('NotRecognized'));

  return {
    term,
    setTerm,
    search,
    filter,
    setFilter: (value: PurchaseInvoiceFilter) =>
      update({ filter: value === 'All' ? null : value, page: null }),
    counts: {
      All: allCount.currentData?.total ?? 0,
      NeedsReview: reviewCount.currentData?.total ?? 0,
      WithoutSupplier: withoutSupplierCount.currentData?.total ?? 0,
      NotRecognized: notRecognizedCount.currentData?.total ?? 0,
    },
    documentFrom: documentFrom ?? '',
    documentTo: documentTo ?? '',
    vat: vat ?? null,
    /** Invoice date and VAT of the checked facts; a change goes back to page 1. */
    setNarrowing: (changes: { from?: string; to?: string; vat?: PurchaseDocumentVat | null }) =>
      update({
        ...Object.fromEntries(Object.entries(changes).filter(([, value]) => value !== undefined)),
        page: null,
      }),
    narrowed: Boolean(search) || filter !== 'All' || Boolean(documentFrom || documentTo || vat),
    list,
    setPage: ({ page: next, pageSize: size }: GridPaginationModel) =>
      update({
        page: next === 0 ? null : String(next + 1),
        pageSize: size === defaultPurchaseInvoicePageSize ? null : String(size),
      }),
  };
}
