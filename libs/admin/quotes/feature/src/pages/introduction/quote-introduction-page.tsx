import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { QuoteIntroductionHeader } from './quote-introduction-header';
import { QuoteIntroductionSendBar } from './quote-introduction-send-bar';
import {
  QuoteIntroductionSteps,
  quoteIntroPagesAnchor,
  quoteIntroRecipientAnchor,
} from './quote-introduction-steps';
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

/** Scrolls to the step of a save problem: the recipient fields or the pages with models. */
const scrollToProblem = (target: string) =>
  document
    .getElementById(
      target.startsWith('slot:') || target === 'pages'
        ? quoteIntroPagesAnchor
        : quoteIntroRecipientAnchor,
    )
    ?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });

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

  return (
    <Box sx={{ pb: 10 }}>
      <QuoteIntroductionHeader
        editor={editor}
        draft={draft}
        lifecycle={lifecycle}
        canDelete={actor.canDelete === true}
        onDelete={removal.ask}
        onPanel={setPanel}
        onNotice={setNotice}
      />
      <QuoteIntroductionNotices
        lifecycle={lifecycle}
        routeNotice={routeNotice}
        editor={editor}
        gmail={gmail}
        notice={notice}
        onCloseNotice={() => setNotice(null)}
      />
      <QuoteIntroductionSteps
        editor={editor}
        draft={draft}
        setup={setup}
        onPick={(season, slot) => setPanel({ kind: 'pick', season, slot })}
      />
      <QuoteIntroductionSendBar
        editor={editor}
        preview={preview}
        saveFirst={saveFirst}
        onNotice={setNotice}
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
