import { quoteSupplierFabrics } from '@admin/quotes/model';
import { useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useQuoteEditor } from './use-quote-editor';
import { useQuoteFabricFacts } from './use-quote-fabric-facts';
import { useQuoteSaveFirst } from './use-quote-save-first';
import { useClientSuggestions } from '../clients/use-client-suggestions';
import { useQuoteDelete } from '../lifecycle/use-quote-delete';
import { useQuoteLifecycle } from '../lifecycle/use-quote-lifecycle';
import { useRouteNotice } from '../lifecycle/use-route-notice';
import { useQuotePreview } from '../preview/use-quote-preview';
import { useGmailReturnNotice } from '../sending/use-gmail-return-notice';
import { useQuoteStartPrefill } from '../start/use-quote-start-prefill';

import type { QuoteEditorPanel } from '../../pages/editor/quote-editor-panels';
import type { QuoteSupplierCard } from '../../pages/editor/quote-supplier-card';
import type { QuoteFabricFacts } from '@admin/quotes/model';

/**
 * Everything the КП «під запит» page needs: the editor of the КП in the address, the open side panel, the
 * notices, the supplier card opener, and the save, PDF and send actions of the bottom bar and right column.
 */
export function useQuoteEditorPage(supplierCard: QuoteSupplierCard | undefined) {
  const params = useParams();
  const id = params['quoteId'] ? Number(params['quoteId']) : null;
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const prefill = useQuoteStartPrefill();
  const editor = useQuoteEditor(id, prefill);
  const clients = useClientSuggestions();
  const theme = useTheme();
  const wide = useMediaQuery(theme.breakpoints.up('lg'));
  // An old «КП з нуля» link opens a new КП with the «Новий виріб» panel.
  const [panel, setPanel] = useState<QuoteEditorPanel | null>(() =>
    id === null && search.get('custom') === '1' ? { kind: 'custom' } : null,
  );
  const { quote, draft } = editor;
  const fabricFacts = useQuoteFabricFacts(draft);
  const openSupplierCard = supplierCard?.open;
  const openSupplier = openSupplierCard
    ? (facts: QuoteFabricFacts) =>
        openSupplierCard({
          id: facts.supplierId,
          name: facts.supplierName ?? '',
          fabrics: quoteSupplierFabrics(facts, fabricFacts),
        })
    : undefined;
  const preview = useQuotePreview();
  const saveFirst = useQuoteSaveFirst({ quote, dirty: editor.dirty, save: editor.save });
  const removal = useQuoteDelete(() => navigate('/crm/quotes'));
  const gmail = useGmailReturnNotice();
  const [sentNotice, setSentNotice] = useState<string | null>(null);
  const lifecycle = useQuoteLifecycle(quote);
  const routeNotice = useRouteNotice();

  const actions = {
    dirty: editor.dirty,
    saving: editor.saving,
    generating: preview.preparing,
    // «Зберегти» saves and stays, «Зберегти і закрити» goes back to the list; «Скасувати» closes without saving.
    onSave: () =>
      void editor.save().then((saved) => {
        if (saved) setSentNotice('КП збережено.');
      }),
    onSaveAndClose: () =>
      void editor.save().then((saved) => {
        if (saved) navigate('/crm/quotes', { state: { notice: 'КП збережено' } });
      }),
    onCancel: () => navigate('/crm/quotes'),
    onPdf: () => saveFirst.run((saved) => void preview.open(saved)),
    // The manager sees the PDF first and sends it from the preview (crm R-30).
    onSend: () => {
      setSentNotice(null);
      saveFirst.run((saved) => void preview.open(saved));
    },
  };

  return {
    id,
    navigate,
    editor,
    clients,
    wide,
    panel,
    setPanel,
    fabricFacts,
    openSupplier,
    preview,
    saveFirst,
    removal,
    gmail,
    sentNotice,
    setSentNotice,
    lifecycle,
    routeNotice,
    actions,
  };
}
