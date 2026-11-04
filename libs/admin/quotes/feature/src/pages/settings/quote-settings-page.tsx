import {
  QuoteCompanyCard,
  QuoteEmailTemplateCard,
  QuoteIntroductionCard,
  QuoteLetterVariantsCard,
  QuotePdfTextsCard,
  QuoteStaffContactsCard,
} from '@admin/quotes/ui';
import { ReferencePageHeader } from '@admin/references/ui';
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { QuoteImageField } from '../../components/settings/quote-image-field';
import { useGmailReturnNotice } from '../../hooks/sending/use-gmail-return-notice';
import { useMailboxConnect } from '../../hooks/sending/use-mailbox-connect';
import { useQuoteSettingsEditor } from '../../hooks/settings/use-quote-settings-editor';

import type { QuoteImageFieldRender } from '@admin/quotes/ui';

const imageField: QuoteImageFieldRender = (field) => <QuoteImageField {...field} />;

const savedLabel = (name: string | null, at: string | null) =>
  name && at
    ? `Змінив(-ла) ${name}, ${new Date(at).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' })}`
    : 'Ще не зберігали — показано тексти за замовчуванням.';

/** «Налаштування КП» (`/crm/quote-settings`): only Director and Admin open it. */
export default function QuoteSettingsPage() {
  const navigate = useNavigate();
  const editor = useQuoteSettingsEditor();
  const mailbox = useMailboxConnect('/crm/quote-settings');
  const gmail = useGmailReturnNotice();
  const { draft, settings, errors } = editor;

  if (editor.loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress aria-label="Завантаження налаштувань КП" />
      </Box>
    );
  if (editor.loadError || !draft)
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => navigate('/crm/quotes')}>До списку</Button>}
      >
        {editor.loadError ?? 'Не вдалося відкрити налаштування.'}
      </Alert>
    );

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Box sx={{ pb: 10 }}>
      <ReferencePageHeader
        overline="Комерційна пропозиція"
        title="Налаштування КП"
        subtitle={savedLabel(settings?.updatedByName ?? null, settings?.updatedAt ?? null)}
        actions={null}
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
      {mailbox.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {mailbox.error}
        </Alert>
      )}
      {hasErrors && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Виправте позначені поля.
        </Alert>
      )}
      <Stack sx={{ gap: 2 }}>
        <QuoteCompanyCard
          company={draft.company}
          errors={errors}
          imageField={imageField}
          onChange={editor.changeCompany}
        />
        <QuoteStaffContactsCard
          contacts={draft.staffContacts}
          errors={errors}
          mailboxLock={
            editor.dirty
              ? 'Спочатку збережіть зміни на сторінці.'
              : mailbox.busy
                ? 'Зачекайте…'
                : null
          }
          onChange={editor.changeContact}
          onConnect={(userId) => void mailbox.connect(userId)}
          onDisconnect={(userId) => void mailbox.disconnect(userId)}
        />
        <QuoteEmailTemplateCard email={draft.email} errors={errors} onChange={editor.changeEmail} />
        <QuotePdfTextsCard pdf={draft.pdf} errors={errors} onChange={editor.changePdf} />
        <QuoteIntroductionCard
          introduction={draft.introduction}
          errors={errors}
          imageField={imageField}
          onChange={editor.changeIntroduction}
          onAdvantageChange={editor.changeAdvantage}
        />
        <QuoteLetterVariantsCard
          variants={draft.letterVariants}
          errors={errors}
          onAdd={editor.addLetter}
          onChange={editor.changeLetter}
          onRemove={editor.removeLetter}
        />
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          position: 'sticky',
          bottom: 16,
          mt: 3,
          p: 1.5,
          display: 'flex',
          gap: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        {editor.dirty && (
          <Typography variant="body2" color="text.secondary" sx={{ mr: 'auto' }}>
            Є незбережені зміни
          </Typography>
        )}
        <Button onClick={() => navigate('/crm/quotes')}>Закрити</Button>
        <Button
          variant="contained"
          onClick={() => void editor.save()}
          disabled={editor.saving || (!editor.dirty && draft.version > 0)}
        >
          {editor.saving ? 'Зберігаємо…' : 'Зберегти зміни'}
        </Button>
      </Paper>
    </Box>
  );
}
