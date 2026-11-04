import { useDeleteQuoteMutation } from '@admin/quotes/data-access';
import { quoteIntroPageErrors } from '@admin/quotes/model';
import {
  QuoteIntroLayoutStep,
  QuoteIntroLetterStep,
  QuoteIntroPagesStep,
  QuoteIntroRecipientStep,
} from '@admin/quotes/ui';
import { ReferencePageHeader } from '@admin/references/ui';
import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material';
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { QuoteIntroductionActions } from './quote-introduction-actions';
import { QuoteDeleteDialog } from '../../components/editor/quote-delete-dialog';
import { QuoteIntroModelPickerDrawer } from '../../components/introduction/quote-intro-model-picker-drawer';
import { QuoteIntroTemplateSaveDrawer } from '../../components/introduction/quote-intro-template-save-drawer';
import { QuoteIntroTemplatesDrawer } from '../../components/introduction/quote-intro-templates-drawer';
import { QuoteSendDrawer } from '../../components/sending/quote-send-drawer';
import { useQuotePdf } from '../../hooks/editor/use-quote-pdf';
import { useQuoteIntroductionEditor } from '../../hooks/introduction/use-quote-introduction-editor';
import { useGmailReturnNotice } from '../../hooks/sending/use-gmail-return-notice';
import { QuoteEditorFooter } from '../editor/quote-editor-footer';

import type { QuoteActor, QuoteIntroSeason, QuoteIntroSlotDraft } from '@admin/quotes/model';

type Panel =
  | { kind: 'pick'; season: QuoteIntroSeason; slot: QuoteIntroSlotDraft }
  | { kind: 'templates' }
  | { kind: 'save-template' }
  | { kind: 'send' };

const sentLabel = (at: string | null) =>
  at ? ` · надіслано ${new Date(at).toLocaleDateString('uk-UA')}` : '';

/** «КП для знайомства»: a promotional catalogue of season pages, 4 models each (`/crm/quote-introductions/…`). */
export default function QuoteIntroductionPage({ actor }: { actor: QuoteActor }) {
  const params = useParams();
  const id = params['quoteId'] ? Number(params['quoteId']) : null;
  const navigate = useNavigate();
  const editor = useQuoteIntroductionEditor(id);
  const { quote, draft, setup } = editor;
  const pdf = useQuotePdf({ quote, dirty: editor.dirty, save: editor.save });
  const gmail = useGmailReturnNotice();
  const [panel, setPanel] = useState<Panel | null>(null);
  const [notice, setNotice] = useState<{ severity: 'success' | 'warning'; text: string } | null>(
    null,
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteQuote, deleting] = useDeleteQuoteMutation();

  if (editor.wrongKind && id !== null) return <Navigate to={`/crm/quotes/${id}`} replace />;
  if (editor.loadError)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => navigate('/crm/quotes')}>До списку</Button>}
      >
        {editor.loadError}
      </Alert>
    );
  if (editor.loading || !draft || !setup)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress aria-label="Завантаження добірки" />
      </Box>
    );

  const usedProductIds = new Set(
    draft.pages.flatMap((page) =>
      page.slots.map((slot) => slot.productId).filter((x): x is number => x !== null),
    ),
  );
  const mainProblems = {
    Summer: setup.summer.problem ?? undefined,
    Winter: setup.winter.problem ?? undefined,
  };

  return (
    <Box sx={{ pb: 10 }}>
      <ReferencePageHeader
        overline="Менеджер сервісу"
        title="КП для знайомства"
        subtitle={
          quote
            ? `КП ${quote.number}${sentLabel(quote.lastSentAt)}`
            : 'Самостійна добірка для холодного контакту: лише актуальні моделі, тканини та ціни з каталогу.'
        }
        actions={
          <QuoteIntroductionActions
            canDelete={quote?.status === 'Draft'}
            onDelete={() => setConfirmDelete(true)}
            onRestart={() => {
              setNotice(null);
              editor.restart();
            }}
            onTemplates={() => setPanel({ kind: 'templates' })}
            onSaveTemplate={() => {
              if (Object.keys(quoteIntroPageErrors(draft)).length > 0)
                setNotice({
                  severity: 'warning',
                  text: 'Щоб зберегти шаблон, оберіть усі моделі й тканини.',
                });
              else setPanel({ kind: 'save-template' });
            }}
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
      {notice && (
        <Alert severity={notice.severity} sx={{ mb: 2 }} onClose={() => setNotice(null)}>
          {notice.text}
        </Alert>
      )}
      {pdf.pdfError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {pdf.pdfError}
        </Alert>
      )}
      <Stack sx={{ gap: 2 }}>
        <QuoteIntroLayoutStep layout={draft.layout} onChange={editor.setLayout} />
        <QuoteIntroRecipientStep draft={draft} errors={editor.errors} onChange={editor.change} />
        <QuoteIntroLetterStep
          letters={setup.letters}
          letterName={draft.letterName}
          onChange={(letterName) => editor.change({ letterName })}
        />
        <QuoteIntroPagesStep
          pages={draft.pages}
          products={editor.products}
          errors={editor.errors}
          mainProblems={mainProblems}
          onPick={(season, slot) => setPanel({ kind: 'pick', season, slot })}
          onFabric={editor.chooseFabric}
          onClear={editor.clearSlot}
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
          setNotice(null);
          const saved = quote && !editor.dirty ? quote : await editor.save();
          if (saved) setPanel({ kind: 'send' });
        }}
      />

      {panel?.kind === 'pick' && (
        <QuoteIntroModelPickerDrawer
          season={panel.season}
          usedProductIds={usedProductIds}
          onClose={() => setPanel(null)}
          onChoose={(product, variant) => {
            editor.chooseModel(panel.slot, product, variant);
            setPanel(null);
          }}
        />
      )}
      {panel?.kind === 'templates' && (
        <QuoteIntroTemplatesDrawer
          onClose={() => setPanel(null)}
          onApply={async (template) => {
            await editor.applyTemplate(template);
            setPanel(null);
            setNotice({ severity: 'success', text: `Застосовано шаблон «${template.name}».` });
          }}
        />
      )}
      {panel?.kind === 'save-template' && (
        <QuoteIntroTemplateSaveDrawer
          draft={draft}
          onClose={() => setPanel(null)}
          onSaved={(name) => {
            setPanel(null);
            setNotice({ severity: 'success', text: `Шаблон «${name}» збережено.` });
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
            setNotice({ severity: 'success', text: `КП ${next.number} надіслано.` });
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
