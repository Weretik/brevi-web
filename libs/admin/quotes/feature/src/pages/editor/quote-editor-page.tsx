import { useDeleteQuoteMutation } from '@admin/quotes/data-access';
import { oneOffItemDraft, quoteTierLabels, quoteTiers } from '@admin/quotes/model';
import { QuoteHeaderCard, QuoteItemCard, QuoteNotesCard } from '@admin/quotes/ui';
import { ReferencePageHeader } from '@admin/references/ui';
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { QuoteEditorActions } from './quote-editor-actions';
import { QuoteEditorFooter } from './quote-editor-footer';
import { QuoteDeleteDialog } from '../../components/editor/quote-delete-dialog';
import { QuoteRepriceDrawer } from '../../components/editor/quote-reprice-drawer';
import { QuoteResponsibleDrawer } from '../../components/editor/quote-responsible-drawer';
import { QuoteCatalogPickerDrawer } from '../../components/picker/quote-catalog-picker-drawer';
import { QuoteFabricPickerDrawer } from '../../components/picker/quote-fabric-picker-drawer';
import { QuoteSendDrawer } from '../../components/sending/quote-send-drawer';
import { useClientNames } from '../../hooks/editor/use-client-names';
import { useQuoteEditor } from '../../hooks/editor/use-quote-editor';
import { useQuotePdf } from '../../hooks/editor/use-quote-pdf';
import { useGmailReturnNotice } from '../../hooks/sending/use-gmail-return-notice';

import type { QuoteActor } from '@admin/quotes/model';

type Panel =
  | { kind: 'catalog' }
  | { kind: 'fabric'; itemKey: string }
  | { kind: 'responsible' }
  | { kind: 'reprice' }
  | { kind: 'send' };

const countLabel = (count: number) =>
  `${count} ${count % 10 === 1 && count % 100 !== 11 ? 'товар' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20) ? 'товари' : 'товарів'} у пропозиції`;

const sentLabel = (at: string | null) =>
  at ? ` · надіслано ${new Date(at).toLocaleDateString('uk-UA')}` : '';

/** «Комерційна пропозиція / Товари та ціни»: a new КП (`/crm/quotes/new`) or a saved one. */
export default function QuoteEditorPage({ actor }: { actor: QuoteActor }) {
  const params = useParams();
  const id = params['quoteId'] ? Number(params['quoteId']) : null;
  const navigate = useNavigate();
  const editor = useQuoteEditor(id);
  const clients = useClientNames();
  const [panel, setPanel] = useState<Panel | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteQuote, deleting] = useDeleteQuoteMutation();
  const { quote, draft } = editor;
  const pdf = useQuotePdf({ quote, dirty: editor.dirty, save: editor.save });
  const gmail = useGmailReturnNotice();
  const [sentNotice, setSentNotice] = useState<string | null>(null);

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

  const fabricItem =
    panel?.kind === 'fabric' ? draft.items.find((item) => item.key === panel.itemKey) : undefined;

  return (
    <Box sx={{ pb: 10 }}>
      <ReferencePageHeader
        overline="Комерційна пропозиція"
        title="Товари та ціни"
        subtitle={quote ? `КП ${quote.number}${sentLabel(quote.lastSentAt)}` : 'Нове КП'}
        actions={
          <QuoteEditorActions
            saved={quote !== null}
            dirty={editor.dirty}
            canAssign={actor.canSeeAll}
            canDelete={quote?.status === 'Draft'}
            onAssign={() => setPanel({ kind: 'responsible' })}
            onReprice={() => setPanel({ kind: 'reprice' })}
            onAddProduct={() => setPanel({ kind: 'catalog' })}
            onAddOneOff={() => editor.addItems([oneOffItemDraft()])}
            onDelete={() => setConfirmDelete(true)}
          />
        }
      />
      {editor.saveError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            editor.saveError.stale ? (
              <Button color="inherit" onClick={() => void editor.reload()}>
                Оновити
              </Button>
            ) : undefined
          }
        >
          {editor.saveError.message}
        </Alert>
      )}
      {gmail.notice && (
        <Alert severity={gmail.notice.severity} sx={{ mb: 2 }} onClose={gmail.dismiss}>
          {gmail.notice.text}
        </Alert>
      )}
      {sentNotice && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSentNotice(null)}>
          {sentNotice}
        </Alert>
      )}
      {pdf.pdfError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {pdf.pdfError}
        </Alert>
      )}
      <Stack sx={{ gap: 2 }}>
        <QuoteHeaderCard
          number={quote?.number ?? null}
          author={quote?.author ?? null}
          responsible={quote?.responsible ?? null}
          draft={draft}
          clientNames={clients.names}
          headerError={editor.errors['header']}
          onChange={editor.change}
          onClientSearch={clients.search}
        />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ justifyContent: 'space-between', gap: 1 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {countLabel(draft.items.length)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ціни: {quoteTiers.map((tier) => quoteTierLabels[tier]).join(' / ')}
          </Typography>
        </Stack>
        {draft.items.length === 0 && (
          <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Додайте модель з варіантами тканини, товар ЗІЗ або разову позицію.
            </Typography>
          </Paper>
        )}
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
            onOptionChange={(optionKey, change) => editor.updateOption(item.key, optionKey, change)}
            onRecommend={(optionKey) => editor.recommend(item.key, optionKey)}
            onRemoveOption={(optionKey) => editor.removeOption(item.key, optionKey)}
            onAddFabric={() => setPanel({ kind: 'fabric', itemKey: item.key })}
            onMove={(offset) => editor.moveItem(item.key, offset)}
            onRemove={() => editor.removeItem(item.key)}
          />
        ))}
        <QuoteNotesCard
          clientComment={draft.clientComment}
          managerNote={draft.managerNote}
          onChange={editor.change}
        />
      </Stack>

      <QuoteEditorFooter
        dirty={editor.dirty}
        saving={editor.saving}
        generating={pdf.generating}
        onClose={() => navigate('/crm/quotes')}
        onSave={() => void editor.save()}
        onPdf={() => void pdf.generate()}
        onSend={async () => {
          setSentNotice(null);
          const saved = quote && !editor.dirty ? quote : await editor.save();
          if (saved) setPanel({ kind: 'send' });
        }}
      />

      {panel?.kind === 'catalog' && (
        <QuoteCatalogPickerDrawer
          onClose={() => setPanel(null)}
          onAdd={(items) => {
            editor.addItems(items);
            setPanel(null);
          }}
        />
      )}
      {fabricItem && (
        <QuoteFabricPickerDrawer
          item={fabricItem}
          onClose={() => setPanel(null)}
          onAdd={(options) => {
            editor.addOptions(fabricItem.key, options);
            setPanel(null);
          }}
        />
      )}
      {panel?.kind === 'responsible' && quote && (
        <QuoteResponsibleDrawer
          quote={quote}
          onClose={() => setPanel(null)}
          onDone={(next) => {
            setPanel(null);
            if (actor.canSeeAll || next.responsible.userId === actor.userId)
              editor.applyServerQuote(next);
            else navigate('/crm/quotes');
          }}
        />
      )}
      {panel?.kind === 'reprice' && quote && (
        <QuoteRepriceDrawer
          quote={quote}
          onClose={() => setPanel(null)}
          onApplied={() => {
            setPanel(null);
            void editor.reload();
          }}
        />
      )}
      {panel?.kind === 'send' && quote && (
        <QuoteSendDrawer
          quote={quote}
          actor={actor}
          onClose={() => setPanel(null)}
          onSent={(next) => {
            setPanel(null);
            editor.applyServerQuote(next);
            setSentNotice(`КП ${next.number} надіслано.`);
          }}
        />
      )}
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
