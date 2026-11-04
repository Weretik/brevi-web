import { quoteTemplateMarks } from '@admin/quotes/model';

import {
  QuoteSettingsCard,
  QuoteSettingsField,
  QuoteSettingsGrid,
  errorsAt,
} from './quote-settings-fields';

import type { QuoteEmailTemplateDraft, QuoteSettingsErrors } from '@admin/quotes/model';

interface Props {
  email: QuoteEmailTemplateDraft;
  errors: QuoteSettingsErrors;
  onChange: (patch: Partial<QuoteEmailTemplateDraft>) => void;
}

export const quoteMarksHint = `Можна вставити: ${quoteTemplateMarks.join(', ')}.`;

/** «Лист, що надсилається з КП». */
export function QuoteEmailTemplateCard({ email, errors, onChange }: Props) {
  const at = errorsAt(errors, 'email');
  return (
    <QuoteSettingsCard title="Лист, що надсилається з КП" description={quoteMarksHint}>
      <QuoteSettingsGrid columns={1}>
        <QuoteSettingsField
          required
          label="Тема листа"
          value={email.subject}
          error={at('subject')}
          onChange={(subject) => onChange({ subject })}
        />
        <QuoteSettingsField
          required
          multiline
          label="Текст листа"
          value={email.body}
          error={at('body')}
          onChange={(body) => onChange({ body })}
        />
      </QuoteSettingsGrid>
    </QuoteSettingsCard>
  );
}
