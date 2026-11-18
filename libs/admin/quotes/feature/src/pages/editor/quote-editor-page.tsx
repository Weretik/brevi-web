import { QuoteSendActions, quoteItemAnchor, quoteRecipientAnchor } from '@admin/quotes/ui';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';

import { QuoteEditorHeader } from './quote-editor-header';
import { QuoteEditorNotices } from './quote-editor-notices';
import { QuoteEditorWorkspace } from './quote-editor-workspace';
import { QuoteDeleteDialog } from '../../components/editor/quote-delete-dialog';
import { quoteAddItemsAnchor } from '../../components/editor/quote-editor-items';
import { QuoteSaveFirstDialog } from '../../components/editor/quote-save-first-dialog';
import { QuoteSaveProblemsDialog } from '../../components/editor/quote-save-problems-dialog';
import { QuoteEditorPanels } from '../../components/editor-panels/quote-editor-panels';
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
  const page = useQuoteEditorPage(supplierCard);
  const {
    navigate,
    editor,
    wide,
    panel,
    setPanel,
    preview,
    saveFirst,
    removal,
    gmail,
    sentNotice,
    setSentNotice,
    lifecycle,
    routeNotice,
    actions,
  } = page;
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

      <QuoteEditorWorkspace page={page} actor={actor} workshopCard={WorkshopCard} onGo={scrollTo} />
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
