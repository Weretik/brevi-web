import {
  QuoteRecipientCard,
  QuoteSendActions,
  quoteItemAnchor,
  quoteRecipientAnchor,
} from '@admin/quotes/ui';
import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material';
import { Navigate } from 'react-router-dom';

import { QuoteEditorAside } from './quote-editor-aside';
import { QuoteEditorHeader } from './quote-editor-header';
import { QuoteEditorNotices } from './quote-editor-notices';
import { QuoteEditorPanels } from './quote-editor-panels';
import { QuoteDeleteDialog } from '../../components/editor/quote-delete-dialog';
import { QuoteEditorItems, quoteAddItemsAnchor } from '../../components/editor/quote-editor-items';
import { QuoteSaveFirstDialog } from '../../components/editor/quote-save-first-dialog';
import { QuoteSaveProblemsDialog } from '../../components/editor/quote-save-problems-dialog';
import { QuotePreview } from '../../components/preview/quote-preview';
import { useQuoteEditorPage } from '../../hooks/editor/use-quote-editor-page';

import type { QuoteSupplierCard, QuoteWorkshopCard } from './quote-supplier-card';
import type { QuoteActor } from '@admin/quotes/model';

const scrollTo = (target: string) => {
  const id =
    target === 'header'
      ? quoteRecipientAnchor
      : target === 'items'
        ? quoteAddItemsAnchor
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
  const {
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
  } = useQuoteEditorPage(supplierCard);
  const { quote, draft } = editor;

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
          <QuoteEditorItems
            editor={editor}
            fabricFacts={fabricFacts}
            onOpenSupplier={openSupplier}
            onPanel={setPanel}
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
