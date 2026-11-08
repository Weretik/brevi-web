import { oneOffItemDraft, quoteSupplierFabrics } from '@admin/quotes/model';
import {
  QuoteAddItems,
  QuoteItemCard,
  QuoteNotesCard,
  QuoteRecipientCard,
  QuoteSendActions,
  quoteItemAnchor,
  quoteRecipientAnchor,
} from '@admin/quotes/ui';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { QuoteEditorAside } from './quote-editor-aside';
import { QuoteEditorHeader } from './quote-editor-header';
import { QuoteEditorNotices } from './quote-editor-notices';
import { QuoteEditorPanels } from './quote-editor-panels';
import { QuoteDeleteDialog } from '../../components/editor/quote-delete-dialog';
import { QuoteSaveFirstDialog } from '../../components/editor/quote-save-first-dialog';
import { QuoteSaveProblemsDialog } from '../../components/editor/quote-save-problems-dialog';
import { QuotePreview } from '../../components/preview/quote-preview';
import { useClientSuggestions } from '../../hooks/clients/use-client-suggestions';
import { useQuoteEditor } from '../../hooks/editor/use-quote-editor';
import { useQuoteFabricFacts } from '../../hooks/editor/use-quote-fabric-facts';
import { useQuoteSaveFirst } from '../../hooks/editor/use-quote-save-first';
import { useQuoteDelete } from '../../hooks/lifecycle/use-quote-delete';
import { useQuoteLifecycle } from '../../hooks/lifecycle/use-quote-lifecycle';
import { useRouteNotice } from '../../hooks/lifecycle/use-route-notice';
import { useQuotePreview } from '../../hooks/preview/use-quote-preview';
import { useGmailReturnNotice } from '../../hooks/sending/use-gmail-return-notice';
import { useQuoteStartPrefill } from '../../hooks/start/use-quote-start-prefill';

import type { QuoteEditorPanel } from './quote-editor-panels';
import type { QuoteSupplierCard, QuoteWorkshopCard } from './quote-supplier-card';
import type { QuoteActor, QuoteFabricFacts } from '@admin/quotes/model';

const addItemsAnchor = 'quote-add-items';

const scrollTo = (target: string) => {
  const id =
    target === 'header'
      ? quoteRecipientAnchor
      : target === 'items'
        ? addItemsAnchor
        : quoteItemAnchor(target);
  document.getElementById(id)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
};

/** A КП «під запит»: who it is for, its items with prices, and a right column with the summary and actions. */
export default function QuoteEditorPage({
  actor,
  supplierCard,
  workshopCard: WorkshopCard,
}: {
  actor: QuoteActor;
  supplierCard?: QuoteSupplierCard;
  /** «Цех» in the right column (client corrections item 9); the app supplies it from «Виробничі завдання». */
  workshopCard?: QuoteWorkshopCard;
}) {
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

  if (editor.loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress aria-label="Завантаження КП" />
      </Box>
    );
  if (editor.loadError)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => navigate('/crm/quotes')}>До списку</Button>}
      >
        {editor.loadError}
      </Alert>
    );
  if (quote?.kind === 'Introduction')
    return <Navigate to={`/crm/quote-introductions/${quote.id}`} replace />;

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

  return (
    <Box sx={{ pb: wide ? 4 : 10 }}>
      <QuoteEditorHeader
        quote={quote}
        name={draft.internalName}
        dirty={editor.dirty}
        busy={lifecycle.busy}
        canAssign={actor.canSeeAll}
        onHistory={() => setPanel({ kind: 'history' })}
        onCopy={() => void lifecycle.copy()}
        onAssign={() => setPanel({ kind: 'responsible' })}
        onReprice={() => setPanel({ kind: 'reprice' })}
        onDelete={actor.canDelete && quote ? () => removal.ask(quote) : undefined}
      />
      <QuoteEditorNotices
        lifecycle={lifecycle}
        routeNotice={routeNotice}
        saveError={editor.saveError}
        onReload={() => void editor.reload()}
        gmail={gmail}
        sentNotice={sentNotice}
        onSentNoticeClose={() => setSentNotice(null)}
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          alignItems: 'start',
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 340px' },
        }}
      >
        <Stack sx={{ gap: 2, minWidth: 0 }}>
          <QuoteRecipientCard
            draft={draft}
            clients={clients.clients}
            headerError={editor.errors['header']}
            onChange={editor.change}
            onClientSearch={clients.search}
          />
          <Typography variant="h5" component="h2" sx={{ mt: 1 }}>
            Позиції{' '}
            <Box
              component="span"
              sx={{ fontFamily: 'var(--admin-font-mono)', color: 'text.secondary' }}
            >
              {draft.items.length}
            </Box>
          </Typography>
          {draft.items.map((item, index) => (
            <QuoteItemCard
              key={item.key}
              item={item}
              position={index + 1}
              isFirst={index === 0}
              isLast={index === draft.items.length - 1}
              itemError={editor.errors[`item:${item.key}`]}
              optionErrors={editor.errors}
              onChange={(patch) => editor.updateItem(item.key, patch)}
              onTierChange={(optionKey, tier, patch) =>
                editor.setTier(item.key, optionKey, tier, patch)
              }
              onOptionChange={(optionKey, change) =>
                editor.updateOption(item.key, optionKey, change)
              }
              onRecommend={(optionKey) => editor.recommend(item.key, optionKey)}
              onRemoveOption={(optionKey) => editor.removeOption(item.key, optionKey)}
              onAddFabric={() => setPanel({ kind: 'fabric', itemKey: item.key })}
              onEditComposition={() => setPanel({ kind: 'custom', itemKey: item.key })}
              onChangePhoto={() => setPanel({ kind: 'photo', itemKey: item.key })}
              onShowChanges={() => setPanel({ kind: 'changes', itemKey: item.key })}
              onMove={(offset) => editor.moveItem(item.key, offset)}
              onRemove={() => editor.removeItem(item.key)}
              fabricFacts={fabricFacts}
              onOpenSupplier={openSupplier}
            />
          ))}
          <Box id={addItemsAnchor} sx={{ scrollMarginTop: 96 }}>
            <QuoteAddItems
              empty={draft.items.length === 0}
              onAddProduct={() => setPanel({ kind: 'catalog' })}
              onAddOneOff={() => editor.addItems([oneOffItemDraft()])}
              onAddCustom={() => setPanel({ kind: 'custom' })}
              onAddEmbroidery={() => setPanel({ kind: 'embroidery' })}
            />
          </Box>
          <QuoteNotesCard
            clientComment={draft.clientComment}
            managerNote={draft.managerNote}
            onChange={editor.change}
          />
        </Stack>
        <Box sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
          <Stack sx={{ gap: 2 }}>
            <QuoteEditorAside
              draft={draft}
              withActions={wide}
              onTierShown={editor.setTierShown}
              onGo={scrollTo}
              {...actions}
            />
            {WorkshopCard && (
              <WorkshopCard
                quoteId={quote?.id ?? null}
                canCreate={actor.canPassToWorkshop === true && draft.items.length > 0}
                onPass={() =>
                  saveFirst.run((saved) => navigate(`/production/orders/new?quote=${saved.id}`))
                }
              />
            )}
          </Stack>
        </Box>
      </Box>
      {!wide && <QuoteSendActions layout="bar" {...actions} />}
      <QuotePreview preview={preview} onSend={() => setPanel({ kind: 'send' })} />

      <QuoteEditorPanels
        panel={panel}
        editor={editor}
        actor={actor}
        onClose={() => setPanel(null)}
        onHandedOver={() => navigate('/crm/quotes')}
        onSent={(next) => setSentNotice(`КП ${next.number} надіслано.`)}
      />
      {saveFirst.asking && (
        <QuoteSaveFirstDialog
          saving={editor.saving}
          onCancel={saveFirst.cancel}
          onSave={() => void saveFirst.confirm()}
        />
      )}
      {editor.saveProblems.length > 0 && (
        <QuoteSaveProblemsDialog
          problems={editor.saveProblems}
          onGo={scrollTo}
          onClose={editor.closeSaveProblems}
        />
      )}
      <QuoteDeleteDialog flow={removal} />
      {supplierCard?.element}
    </Box>
  );
}
