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
import { QuoteSaveProblemsDialog } from '../../components/editor/quote-save-problems-dialog';
import { QuoteIntroductionNotices } from '../../components/introduction/quote-introduction-notices';
import { QuoteIntroductionPanels } from '../../components/introduction/quote-introduction-panels';
import { QuotePreview } from '../../components/preview/quote-preview';
import { useQuoteSaveFirst } from '../../hooks/editor/use-quote-save-first';
import { useQuoteIntroductionEditor } from '../../hooks/introduction/use-quote-introduction-editor';
import { useQuoteDelete } from '../../hooks/lifecycle/use-quote-delete';
import { useQuoteLifecycle } from '../../hooks/lifecycle/use-quote-lifecycle';
import { useRouteNotice } from '../../hooks/lifecycle/use-route-notice';
import { useQuotePreview } from '../../hooks/preview/use-quote-preview';
import { useGmailReturnNotice } from '../../hooks/sending/use-gmail-return-notice';
import { useQuoteStartPrefill } from '../../hooks/start/use-quote-start-prefill';

import type { QuoteIntroductionNotice } from '../../components/introduction/quote-introduction-notices';
import type { QuoteIntroductionPanel } from '../../components/introduction/quote-introduction-panels';
import type { QuoteActor } from '@admin/quotes/model';

const recipientAnchor = 'quote-intro-recipient';
const pagesAnchor = 'quote-intro-pages';

/** Scrolls to the step of a save problem: the recipient fields or the pages with models. */
const scrollToProblem = (target: string) =>
  document
    .getElementById(
      target.startsWith('slot:') || target === 'pages' ? pagesAnchor : recipientAnchor,
    )
    ?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });

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
  const [panel, setPanel] = useState<QuoteIntroductionPanel | null>(null);
  const [notice, setNotice] = useState<QuoteIntroductionNotice | null>(null);
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
      <QuoteIntroductionNotices
        lifecycle={lifecycle}
        routeNotice={routeNotice}
        editor={editor}
        gmail={gmail}
        notice={notice}
        onCloseNotice={() => setNotice(null)}
      />
      <Stack sx={{ gap: 2 }}>
        <QuoteIntroLayoutStep layout={draft.layout} onChange={editor.setLayout} />
        <Box id={recipientAnchor} sx={{ scrollMarginTop: 96 }}>
          <QuoteIntroRecipientStep draft={draft} errors={editor.errors} onChange={editor.change} />
        </Box>
        <QuoteIntroLetterStep
          letters={setup.letters}
          letterName={draft.letterName}
          letterSubject={draft.letterSubject}
          letterBody={draft.letterBody}
          onChange={(letterName) => {
            if (letterName !== draft.letterName)
              editor.change({ letterName, letterSubject: null, letterBody: null });
          }}
          onEditLetter={editor.change}
        />
        <Box id={pagesAnchor} sx={{ scrollMarginTop: 96 }}>
          <QuoteIntroPagesStep
            pages={draft.pages}
            products={editor.products}
            errors={editor.errors}
            mainProblems={mainProblems}
            onPick={(season, slot) => setPanel({ kind: 'pick', season, slot })}
            onFabric={editor.chooseFabric}
            onClear={editor.clearSlot}
          />
        </Box>
      </Stack>

      <QuoteSendActions
        layout="bar"
        dirty={editor.dirty}
        saving={editor.saving}
        generating={preview.preparing}
        onSave={() =>
          void editor.save().then((saved) => {
            if (saved) setNotice({ severity: 'success', text: 'КП збережено.' });
          })
        }
        onSaveAndClose={() =>
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
      {editor.saveProblems.length > 0 && (
        <QuoteSaveProblemsDialog
          problems={editor.saveProblems}
          onGo={scrollToProblem}
          onClose={editor.closeSaveProblems}
        />
      )}
      <QuoteIntroductionPanels
        panel={panel}
        actor={actor}
        quote={quote}
        draft={draft}
        editor={editor}
        onClose={() => setPanel(null)}
        onNotice={setNotice}
      />
      <QuoteDeleteDialog flow={removal} />
    </Box>
  );
}
