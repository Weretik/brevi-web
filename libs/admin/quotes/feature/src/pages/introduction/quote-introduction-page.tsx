import { quoteIntroPageErrors } from '@admin/quotes/model';
import {
  QuoteIntroLayoutStep,
  QuoteIntroLetterStep,
  QuoteIntroPagesStep,
  QuoteIntroRecipientStep,
  QuoteMoreMenu,
  QuoteSendActions,
} from '@admin/quotes/ui';
import { ReferencePageHeader } from '@admin/references/ui';
import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material';
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { QuoteIntroductionActions } from './quote-introduction-actions';
import { QuoteDeleteDialog } from '../../components/editor/quote-delete-dialog';
import { QuoteSaveFirstDialog } from '../../components/editor/quote-save-first-dialog';
import { QuoteIntroModelPickerDrawer } from '../../components/introduction/quote-intro-model-picker-drawer';
import { QuoteIntroTemplateSaveDrawer } from '../../components/introduction/quote-intro-template-save-drawer';
import { QuoteIntroTemplatesDrawer } from '../../components/introduction/quote-intro-templates-drawer';
import { QuoteHistoryDrawer } from '../../components/lifecycle/quote-history-drawer';
import { QuotePreview } from '../../components/preview/quote-preview';
import { QuoteSendDrawer } from '../../components/sending/quote-send-drawer';
import { useQuoteSaveFirst } from '../../hooks/editor/use-quote-save-first';
import { useQuoteIntroductionEditor } from '../../hooks/introduction/use-quote-introduction-editor';
import { useQuoteDelete } from '../../hooks/lifecycle/use-quote-delete';
import { useQuoteLifecycle } from '../../hooks/lifecycle/use-quote-lifecycle';
import { useRouteNotice } from '../../hooks/lifecycle/use-route-notice';
import { useQuotePreview } from '../../hooks/preview/use-quote-preview';
import { useGmailReturnNotice } from '../../hooks/sending/use-gmail-return-notice';
import { useQuoteStartPrefill } from '../../hooks/start/use-quote-start-prefill';

import type { QuoteActor, QuoteIntroSeason, QuoteIntroSlotDraft } from '@admin/quotes/model';

type Panel =
  | { kind: 'pick'; season: QuoteIntroSeason; slot: QuoteIntroSlotDraft }
  | { kind: 'templates' }
  | { kind: 'save-template' }
  | { kind: 'history' }
  | { kind: 'send' };

const sentLabel = (at: string | null) =>
  at ? ` · надіслано ${new Date(at).toLocaleDateString('uk-UA')}` : '';

/** «КП для знайомства»: a promotional catalogue of season pages, 4 models each (`/crm/quote-introductions/…`). */
export default function QuoteIntroductionPage({ actor }: { actor: QuoteActor }) {
  const params = useParams();
  const id = params['quoteId'] ? Number(params['quoteId']) : null;
  const navigate = useNavigate();
  const prefill = useQuoteStartPrefill();
  const editor = useQuoteIntroductionEditor(id, prefill);
  const { quote, draft, setup } = editor;
  const preview = useQuotePreview();
  const saveFirst = useQuoteSaveFirst({ quote, dirty: editor.dirty, save: editor.save });
  const removal = useQuoteDelete(() => navigate('/crm/quotes'));
  const gmail = useGmailReturnNotice();
  const [panel, setPanel] = useState<Panel | null>(null);
  const [notice, setNotice] = useState<{ severity: 'success' | 'warning'; text: string } | null>(
    null,
  );
  const lifecycle = useQuoteLifecycle(quote);
  const routeNotice = useRouteNotice();

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
          <>
            <QuoteIntroductionActions
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
            {quote && (
              <QuoteMoreMenu
                dirty={editor.dirty}
                busy={lifecycle.busy}
                onHistory={() => setPanel({ kind: 'history' })}
                onCopy={() => void lifecycle.copy()}
                onDelete={actor.canDelete ? () => removal.ask(quote) : undefined}
              />
            )}
          </>
        }
      />
      {lifecycle.error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={lifecycle.clearError}>
          {lifecycle.error}
        </Alert>
      )}
      {routeNotice.notice && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={routeNotice.dismiss}>
          {routeNotice.notice}
        </Alert>
      )}
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

      <QuoteSendActions
        layout="bar"
        dirty={editor.dirty}
        saving={editor.saving}
        generating={preview.preparing}
        onSave={() =>
          void editor.save().then((saved) => {
            if (saved) navigate('/crm/quotes', { state: { notice: 'КП збережено' } });
          })
        }
        onCancel={() => navigate('/crm/quotes')}
        onPdf={() => saveFirst.run((saved) => void preview.open(saved))}
        onSend={() => {
          setNotice(null);
          saveFirst.run((saved) => void preview.open(saved));
        }}
      />
      <QuotePreview preview={preview} onSend={() => setPanel({ kind: 'send' })} />
      {saveFirst.asking && (
        <QuoteSaveFirstDialog
          saving={editor.saving}
          onCancel={saveFirst.cancel}
          onSave={() => void saveFirst.confirm()}
        />
      )}

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
      {panel?.kind === 'history' && quote && (
        <QuoteHistoryDrawer
          quoteId={quote.id}
          number={quote.number}
          onClose={() => setPanel(null)}
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
      <QuoteDeleteDialog flow={removal} />
    </Box>
  );
}
