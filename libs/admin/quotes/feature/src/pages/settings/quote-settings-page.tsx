import {
  quoteSettingsErrorCounts,
  quoteSettingsErrors,
  quoteSettingsSections,
} from '@admin/quotes/model';
import {
  QuoteSettingsFormContext,
  QuoteSettingsNav,
  QuoteSettingsPreview,
  QuoteSettingsSaveBar,
} from '@admin/quotes/ui';
import { ReferencePageHeader } from '@admin/references/ui';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { QuoteManagerDrawer } from '../../components/settings/quote-manager-drawer';
import { QuoteSettingsContent } from '../../components/settings/quote-settings-content';
import { QuoteSettingsNotices } from '../../components/settings/quote-settings-notices';
import { useGmailReturnNotice } from '../../hooks/sending/use-gmail-return-notice';
import { useMailboxConnect } from '../../hooks/sending/use-mailbox-connect';
import { useQuoteSettingsEditor } from '../../hooks/settings/use-quote-settings-editor';
import { useSettingsSections } from '../../hooks/settings/use-settings-sections';

import type { QuoteLetterRef, QuotePreviewView } from '@admin/quotes/ui';

const savedLabel = (name: string | null, at: string | null) =>
  name && at
    ? `Що бачить клієнт у PDF і листі. Змінив(-ла) ${name}, ${new Date(at).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' })}.`
    : 'Що бачить клієнт у PDF і листі. Ще не зберігали — показано тексти за замовчуванням.';

/** The preview follows the field in focus: letter fields show the letter, the rest the PDF. */
const viewOf = (path: string): QuotePreviewView | null =>
  path.startsWith('email.') || path.startsWith('letter:')
    ? 'letter'
    : path.startsWith('company.') || path.startsWith('pdf.') || path.startsWith('staff:')
      ? 'pdf'
      : null;

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
  const [focused, setFocused] = useState<string | null>(null);
  const [view, setView] = useState<QuotePreviewView>('pdf');
  const [openLetter, setOpenLetter] = useState<QuoteLetterRef | null>(null);
  const [managerId, setManagerId] = useState<number | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const form = useMemo(
    () => ({
      onFocusField: (path: string) => {
        setFocused(path);
        const next = viewOf(path);
        if (next) setView(next);
      },
    }),
    [],
  );
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

  const openLetterRow = (letter: QuoteLetterRef | null) => {
    setOpenLetter(letter);
    if (letter) setView('letter');
  };
  const save = async () => {
    if (await editor.save()) return;
    const first = quoteSettingsSections.find(
      (section) => quoteSettingsErrorCounts(quoteSettingsErrors(draft))[section.id],
    );
    if (first) sections.goTo(first.id);
  };
  const manager = draft.staffContacts.find((contact) => contact.userId === managerId) ?? null;

  const preview = (
    <QuoteSettingsPreview
      draft={draft}
      view={view}
      letter={openLetter}
      focused={focused}
      onViewChange={setView}
    />
  );

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
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            alignItems: 'start',
            gridTemplateColumns: widePreview
              ? '200px minmax(0, 1fr) 380px'
              : wideNav
                ? '200px minmax(0, 1fr)'
                : 'minmax(0, 1fr)',
          }}
        >
          <Box sx={wideNav ? { position: 'sticky', top: 88 } : undefined}>
            <QuoteSettingsNav
              active={sections.active}
              changed={editor.changed}
              errorCounts={editor.errorCounts}
              layout={wideNav ? 'column' : 'row'}
              onSelect={sections.goTo}
            />
          </Box>
          <QuoteSettingsContent
            editor={{ ...editor, draft, saved }}
            mailbox={mailbox}
            openLetter={openLetter}
            onOpenLetter={openLetterRow}
            onEditManager={setManagerId}
          />
          {widePreview && <Box sx={{ position: 'sticky', top: 88 }}>{preview}</Box>}
        </Box>

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
            setFocused(null);
          }}
          onSave={() => void save()}
        />

        {!widePreview && (
          <Drawer
            anchor="right"
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
            slotProps={{ paper: { sx: { width: { xs: '100%', sm: 420 }, p: 2.5 } } }}
          >
            {preview}
          </Drawer>
        )}
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
