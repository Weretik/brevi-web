import { useEffect, useRef, useState } from 'react';

import { useQuotePreview } from './use-quote-preview';
import { useQuoteWrite } from './use-quote-write';
import { quoteError } from '../../errors/quotes/quote-error';
import { useClientDirtyGuard } from '../navigation/use-client-dirty-guard';

import type { QuoteDetail, QuoteDraft } from '@admin/clients/model';

const empty: QuoteDraft = { customerId: null, contactId: null, recipientName: '', items: [] };
export function useQuoteEditor(
  initial: QuoteDetail | null,
  reload: (() => Promise<QuoteDetail>) | undefined,
  onCreated: (id: string) => void,
  external: { isLocked?: () => boolean; blockNavigation?: boolean } = {},
) {
  const [detail, setDetail] = useState(initial);
  const [draft, setDraft] = useState(initial?.draft ?? empty);
  const [baseline, setBaseline] = useState(JSON.stringify(initial?.draft ?? empty));
  const [confirmReload, setConfirmReload] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [refreshing, setRefreshing] = useState(false);
  const refreshBusy = useRef(false);
  const accept = (value: QuoteDetail) => {
    setDetail(value);
    setDraft(value.draft);
    setBaseline(JSON.stringify(value.draft));
  };
  const write = useQuoteWrite(accept, (id) => {
    guard.allowNavigation();
    onCreated(id);
  });
  const preview = useQuotePreview(detail?.publicId, setDraft, write.setError);
  const dirty = JSON.stringify(draft) !== baseline;
  const guard = useClientDirtyGuard(dirty || write.uncertain || !!external.blockNavigation);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);
  const editable = !detail || (detail.canEdit && !detail.archived);
  const save = async () => {
    if (refreshBusy.current || preview.pending || !editable || external.isLocked?.()) return;
    await write.save(detail, draft);
  };
  const refresh = async () => {
    if (
      !reload ||
      refreshBusy.current ||
      preview.pending ||
      write.isLocked() ||
      external.isLocked?.()
    )
      return;
    setConfirmReload(false);
    refreshBusy.current = true;
    setRefreshing(true);
    try {
      accept(await reload());
      write.reset();
    } catch (failure) {
      write.setError(quoteError(failure));
    } finally {
      refreshBusy.current = false;
      setRefreshing(false);
    }
  };
  return {
    draft,
    setDraft,
    detail,
    editable,
    dirty,
    errors: write.errors,
    error: write.error,
    saved: write.saved,
    uncertain: write.uncertain,
    now,
    save,
    saving: write.pending || refreshing || preview.pending,
    calculate: (variant: Parameters<typeof preview.calculate>[0]) => {
      if (!refreshBusy.current && !write.isLocked() && !external.isLocked?.())
        return preview.calculate(variant);
      return undefined;
    },
    blocker: guard.blocker,
    confirmReload,
    setConfirmReload,
    refresh,
    acceptExternal: (value: QuoteDetail) => {
      accept(value);
      write.reset();
    },
    allowNavigation: guard.allowNavigation,
    isBusy: () => write.isLocked() || refreshBusy.current || preview.pending,
    requestReload: () => {
      if (write.isLocked() || refreshBusy.current || preview.pending || external.isLocked?.())
        return;
      if (dirty) setConfirmReload(true);
      else void refresh();
    },
  };
}
