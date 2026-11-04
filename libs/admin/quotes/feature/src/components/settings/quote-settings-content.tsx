import { quoteSettingsSections } from '@admin/quotes/model';
import {
  QuoteCompanySection,
  QuoteIntroductionSection,
  QuoteLettersSection,
  QuoteManagersSection,
  QuotePdfSection,
  QuoteSettingsSectionCard,
} from '@admin/quotes/ui';
import { Box } from '@mui/material';

import { QuoteImageField } from './quote-image-field';
import { QuoteMainModelField } from './quote-main-model-field';

import type { useMailboxConnect } from '../../hooks/sending/use-mailbox-connect';
import type { useQuoteSettingsEditor } from '../../hooks/settings/use-quote-settings-editor';
import type { QuoteSettingsDraft, QuoteSettingsSectionId } from '@admin/quotes/model';
import type {
  QuoteImageFieldRender,
  QuoteLetterRef,
  QuoteModelFieldRender,
} from '@admin/quotes/ui';
import type { ReactNode } from 'react';

const imageField: QuoteImageFieldRender = (field) => <QuoteImageField {...field} />;
const modelField: QuoteModelFieldRender = (field) => (
  <QuoteMainModelField
    {...field}
    path={`introduction.${field.season === 'Summer' ? 'summer' : 'winter'}MainCode`}
  />
);

interface Props {
  editor: ReturnType<typeof useQuoteSettingsEditor> & {
    draft: QuoteSettingsDraft;
    saved: QuoteSettingsDraft;
  };
  mailbox: ReturnType<typeof useMailboxConnect>;
  openLetter: QuoteLetterRef | null;
  onOpenLetter: (letter: QuoteLetterRef | null) => void;
  onEditManager: (userId: number) => void;
}

/** The five sections of «Налаштування КП» in page order, each in its card. */
export function QuoteSettingsContent({
  editor,
  mailbox,
  openLetter,
  onOpenLetter,
  onEditManager,
}: Props) {
  const { draft, saved, errors } = editor;
  const content: Record<QuoteSettingsSectionId, ReactNode> = {
    company: (
      <QuoteCompanySection
        company={draft.company}
        saved={saved.company}
        errors={errors}
        imageField={imageField}
        onChange={editor.changeCompany}
      />
    ),
    pdf: (
      <QuotePdfSection
        pdf={draft.pdf}
        saved={saved.pdf}
        errors={errors}
        onChange={editor.changePdf}
      />
    ),
    letters: (
      <QuoteLettersSection
        email={draft.email}
        savedEmail={saved.email}
        variants={draft.letterVariants}
        savedVariants={saved.letterVariants}
        errors={errors}
        open={openLetter}
        onOpen={onOpenLetter}
        onEmailChange={editor.changeEmail}
        onAdd={() => onOpenLetter(editor.addLetter())}
        onChange={editor.changeLetter}
        onRemove={(key) => {
          editor.removeLetter(key);
          if (openLetter === key) onOpenLetter(null);
        }}
      />
    ),
    introduction: (
      <QuoteIntroductionSection
        introduction={draft.introduction}
        saved={saved.introduction}
        errors={errors}
        imageField={imageField}
        modelField={modelField}
        onChange={editor.changeIntroduction}
        onAdvantageChange={editor.changeAdvantage}
        onAdvantageMove={editor.moveAdvantage}
      />
    ),
    managers: (
      <QuoteManagersSection
        contacts={draft.staffContacts}
        errors={errors}
        mailboxBusy={mailbox.busy}
        onEdit={onEditManager}
        onConnect={(userId) => {
          editor.keepUnsaved();
          void mailbox.connect(userId);
        }}
        onDisconnect={(userId) => void mailbox.disconnect(userId)}
      />
    ),
  };

  return (
    <Box sx={{ display: 'grid', gap: 2, minWidth: 0 }}>
      {quoteSettingsSections.map((section) => (
        <QuoteSettingsSectionCard
          key={section.id}
          section={section}
          changed={editor.changed.includes(section.id)}
          errorCount={editor.errorCounts[section.id] ?? 0}
        >
          {content[section.id]}
        </QuoteSettingsSectionCard>
      ))}
    </Box>
  );
}
