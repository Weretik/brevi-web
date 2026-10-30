import { usePreviewQuotePricesMutation } from '@admin/clients/data-access';
import { compareQuoteBasis, sameQuoteSelection } from '@admin/clients/model';
import { useEffect, useRef, useState } from 'react';

import { quoteError } from '../../../errors/quotes/quote-error';

import type { QuoteDetail, QuoteRepriceRow } from '@admin/clients/model';

export function useQuoteReprice(detail: QuoteDetail) {
  const [preview] = usePreviewQuotePricesMutation();
  const [rows, setRows] = useState<readonly QuoteRepriceRow[]>([]);
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [now, setNow] = useState(Date.now());
  const snapshotKey = `${detail.publicId}:${detail.versionId}:${detail.revision}`;
  const [preparedFor, setPreparedFor] = useState<{ key: string; generation: number } | null>(null);
  const busy = useRef(false);
  const generation = useRef(0);
  const current = preparedFor?.key === snapshotKey && preparedFor.generation === generation.current;
  const active = useRef<{ abort: () => void } | null>(null);
  const keys = useRef(new Map<string, string>());
  const variants = detail.draft.items.flatMap((item) =>
    item.variants.map((variant) => ({ item, variant })),
  );
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    return () => {
      generation.current++;
      active.current?.abort();
      active.current = null;
      busy.current = false;
      keys.current.clear();
    };
  }, [snapshotKey]);
  const run = async () => {
    if (busy.current || detail.archived || !detail.canEdit) return;
    busy.current = true;
    const runId = ++generation.current;
    setPreparedFor({ key: snapshotKey, generation: runId });
    setPending(true);
    setError('');
    setRows([]);
    setProgress(0);
    try {
      if (!variants.length) throw new Error('У КП немає варіантів для перерахунку.');
      const next: QuoteRepriceRow[] = [];
      for (const { item, variant } of variants) {
        if (!variant.publicId || !variant.basis)
          throw new Error('Варіант не має збереженої основи.');
        const requestId = keys.current.get(variant.publicId) ?? crypto.randomUUID();
        keys.current.set(variant.publicId, requestId);
        const request = preview({
          quoteId: detail.publicId,
          selection: variant.selection,
          requestId,
        });
        active.current = request;
        const value = await request.unwrap();
        if (runId !== generation.current) return;
        if (!sameQuoteSelection(value.selection, variant.selection))
          throw new Error('Розрахунок не відповідає збереженому вибору.');
        keys.current.delete(variant.publicId);
        next.push({
          variantId: variant.publicId,
          title: item.title + ' · ' + variant.title,
          previous: variant.basis.value,
          next: value,
        });
        setProgress(next.length);
      }
      setRows(next);
      setNow(Date.now());
    } catch (failure) {
      if (runId === generation.current)
        setError(failure instanceof Error ? failure.message : quoteError(failure));
    } finally {
      if (runId === generation.current) {
        busy.current = false;
        active.current = null;
        setPending(false);
      }
    }
  };
  const ready =
    current &&
    detail.canEdit &&
    !detail.archived &&
    !pending &&
    rows.length === variants.length &&
    rows.length > 0 &&
    rows.every((row) => {
      const comparison = compareQuoteBasis(row.previous, row.next);
      return comparison.selectionMatches && !comparison.blocked && row.next.expiresAt > now;
    });
  return {
    rows: current ? rows : [],
    pending: current && pending,
    progress: current ? progress : 0,
    total: variants.length,
    error: current ? error : '',
    ready,
    run,
  };
}
