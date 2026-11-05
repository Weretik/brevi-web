import { useDeleteQuoteMutation } from '@admin/quotes/data-access';
import { oneOffItemDraft } from '@admin/quotes/model';
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
import { QuotePreview } from '../../components/preview/quote-preview';
import { useClientSuggestions } from '../../hooks/clients/use-client-suggestions';
import { useQuoteEditor } from '../../hooks/editor/use-quote-editor';
import { useQuoteLifecycle } from '../../hooks/lifecycle/use-quote-lifecycle';
import { useRouteNotice } from '../../hooks/lifecycle/use-route-notice';
import { useQuotePreview } from '../../hooks/preview/use-quote-preview';
import { useGmailReturnNotice } from '../../hooks/sending/use-gmail-return-notice';
import { useQuoteStartPrefill } from '../../hooks/start/use-quote-start-prefill';

import type { QuoteEditorPanel } from './quote-editor-panels';
import type { QuoteActor } from '@admin/quotes/model';

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
export default function QuoteEditorPage({ actor }: { actor: QuoteActor }) {
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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteQuote, deleting] = useDeleteQuoteMutation();
  const { quote, draft } = editor;
  const preview = useQuotePreview({ quote, dirty: editor.dirty, save: editor.save });
  const gmail = useGmailReturnNotice();
  const [sentNotice, setSentNotice] = useState<string | null>(null);
  const lifecycle = useQuoteLifecycle(quote, editor.applyServerQuote);
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
    locked: lifecycle.archived,
    onSave: () => void editor.save(),
    onPdf: () => void preview.open(),
    // The manager sees the PDF first and sends it from the preview (crm R-30).
    onSend: () => {
      setSentNotice(null);
      void preview.open();
    },
  };

  return (
    <Box sx={{ pb: wide ? 4 : 10 }}>
      <QuoteEditorHeader
        quote={quote}
        name={draft.internalName}
        dirty={editor.dirty}
        archived={lifecycle.archived}
        busy={lifecycle.busy}
        canAssign={actor.canSeeAll}
        onHistory={() => setPanel({ kind: 'history' })}
        onCopy={() => void lifecycle.copy()}
        onArchive={(archived) => void lifecycle.setArchived(archived)}
        onAssign={() => setPanel({ kind: 'responsible' })}
        onReprice={() => setPanel({ kind: 'reprice' })}
        onDelete={() => setConfirmDelete(true)}
      />
      <QuoteEditorNotices
        quote={quote}
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
              onMove={(offset) => editor.moveItem(item.key, offset)}
              onRemove={() => editor.removeItem(item.key)}
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
          <QuoteEditorAside
            draft={draft}
            withActions={wide}
            onTierShown={editor.setTierShown}
            onGo={scrollTo}
            {...actions}
          />
        </Box>
      </Box>
      {!wide && <QuoteSendActions layout="bar" {...actions} />}
      <QuotePreview
        preview={preview}
        locked={lifecycle.archived}
        onSend={() => setPanel({ kind: 'send' })}
      />

      <QuoteEditorPanels
        panel={panel}
        editor={editor}
        actor={actor}
        onClose={() => setPanel(null)}
        onHandedOver={() => navigate('/crm/quotes')}
        onSent={(next) => setSentNotice(`КП ${next.number} надіслано.`)}
      />
      {confirmDelete && quote && (
        <QuoteDeleteDialog
          number={quote.number}
          deleting={deleting.isLoading}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            try {
              await deleteQuote({ id: quote.id, version: quote.version }).unwrap();
              navigate('/crm/quotes');
            } catch {
              setConfirmDelete(false);
            }
          }}
        />
      )}
    </Box>
  );
}
