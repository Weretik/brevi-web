import {
  quoteSettingsErrorCounts,
  quoteSettingsErrors,
  quoteSettingsSections,
} from '@admin/quotes/model';
import { QuoteSettingsFormContext, QuoteSettingsSaveBar } from '@admin/quotes/ui';
import { ReferencePageHeader } from '@admin/references/ui';
import { Alert, Box, Button, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { QuoteSettingsLayout } from './quote-settings-layout';
import { QuoteManagerDrawer } from '../../components/settings/quote-manager-drawer';
import { QuoteSettingsNotices } from '../../components/settings/quote-settings-notices';
import { useGmailReturnNotice } from '../../hooks/sending/use-gmail-return-notice';
import { useMailboxConnect } from '../../hooks/sending/use-mailbox-connect';
import { useQuoteSettingsEditor } from '../../hooks/settings/use-quote-settings-editor';
import { useQuoteSettingsPreview } from '../../hooks/settings/use-quote-settings-preview';
import { useSettingsSections } from '../../hooks/settings/use-settings-sections';

const savedLabel = (name: string | null, at: string | null) =>
  name && at
    ? `Що бачить клієнт у PDF і листі. Змінив(-ла) ${name}, ${new Date(at).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' })}.`
    : 'Що бачить клієнт у PDF і листі. Ще не зберігали — показано тексти за замовчуванням.';

/** «Налаштування КП» (`/admin/quote-settings`): only Director and Admin open it. */
export default function QuoteSettingsPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const wideNav = useMediaQuery(theme.breakpoints.up('lg'));
  const widePreview = useMediaQuery(theme.breakpoints.up(1400));
  const editor = useQuoteSettingsEditor();
  // The backend only allows known return paths; `/crm/quote-settings` redirects to this page.
  const mailbox = useMailboxConnect('/crm/quote-settings');
  const gmail = useGmailReturnNotice();
  const sections = useSettingsSections(Boolean(editor.draft));
  const previewState = useQuoteSettingsPreview();
  const { form } = previewState;
  const [managerId, setManagerId] = useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const { draft, saved, errors } = editor;

  if (editor.loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress aria-label="Завантаження налаштувань КП" />
      </Box>
    );
  if (editor.loadError || !draft || !saved)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => navigate('/crm/quotes')}>До списку</Button>}
      >
        {editor.loadError ?? 'Не вдалося відкрити налаштування.'}
      </Alert>
    );

  const save = async () => {
    if (await editor.save()) return;
    const first = quoteSettingsSections.find(
      (section) => quoteSettingsErrorCounts(quoteSettingsErrors(draft))[section.id],
    );
    if (first) sections.goTo(first.id);
  };
  const manager = draft.staffContacts.find((contact) => contact.userId === managerId) ?? null;

  return (
    <QuoteSettingsFormContext.Provider value={form}>
      <Box sx={{ pb: 4 }}>
        <ReferencePageHeader
          overline="Комерційна пропозиція"
          title="Налаштування КП"
          subtitle={savedLabel(
            editor.settings?.updatedByName ?? null,
            editor.settings?.updatedAt ?? null,
          )}
          actions={null}
        />
        <QuoteSettingsNotices
          saveError={editor.saveError}
          onReload={() => void editor.reload()}
          gmail={gmail}
          mailboxError={mailbox.error}
          restored={editor.restored}
          onRestoredClose={editor.dismissRestored}
        />
        <QuoteSettingsLayout
          editor={{ ...editor, draft, saved }}
          sections={sections}
          mailbox={mailbox}
          previewState={previewState}
          wideNav={wideNav}
          widePreview={widePreview}
          previewOpen={previewOpen}
          onPreviewClose={() => setPreviewOpen(false)}
          onEditManager={setManagerId}
        />

        <QuoteSettingsSaveBar
          changed={editor.changed}
          errorCounts={editor.errorCounts}
          saving={editor.saving}
          canSaveUnchanged={draft.version === 0}
          previewButton={
            widePreview ? undefined : (
              <Button variant="outlined" onClick={() => setPreviewOpen(true)}>
                Перегляд
              </Button>
            )
          }
          onGoTo={sections.goTo}
          onDiscard={() => {
            editor.discard();
            previewState.clearFocus();
          }}
          onSave={() => void save()}
        />

        {manager && (
          <QuoteManagerDrawer
            key={manager.userId}
            contact={manager}
            errors={errors}
            onClose={() => setManagerId(null)}
            onDone={(patch) => {
              editor.changeContact(manager.userId, patch);
              setManagerId(null);
            }}
          />
        )}
      </Box>
    </QuoteSettingsFormContext.Provider>
  );
}
