import {
  QuoteSettingsCard,
  QuoteSettingsField,
  QuoteSettingsGrid,
  errorsAt,
} from './quote-settings-fields';

import type { QuotePdfTextsDraft, QuoteSettingsErrors } from '@admin/quotes/model';

interface Props {
  pdf: QuotePdfTextsDraft;
  errors: QuoteSettingsErrors;
  onChange: (patch: Partial<QuotePdfTextsDraft>) => void;
}

/** «Тексти PDF»: title, VAT note and the closing call to action. */
export function QuotePdfTextsCard({ pdf, errors, onChange }: Props) {
  const at = errorsAt(errors, 'pdf');
  return (
    <QuoteSettingsCard title="Тексти PDF" description="Заголовок і текст під цінами в PDF.">
      <QuoteSettingsGrid>
        <QuoteSettingsField
          required
          label="Заголовок"
          value={pdf.title}
          error={at('title')}
          onChange={(title) => onChange({ title })}
        />
        <QuoteSettingsField
          label="Заголовок блоку внизу"
          value={pdf.ctaTitle}
          error={at('ctaTitle')}
          onChange={(ctaTitle) => onChange({ ctaTitle })}
        />
        <QuoteSettingsField
          multiline
          label="Примітка про ПДВ"
          value={pdf.vatNotice}
          error={at('vatNotice')}
          onChange={(vatNotice) => onChange({ vatNotice })}
        />
        <QuoteSettingsField
          multiline
          label="Текст блоку внизу"
          value={pdf.ctaText}
          error={at('ctaText')}
          onChange={(ctaText) => onChange({ ctaText })}
        />
        <QuoteSettingsField
          wide
          multiline
          label="Контакт менеджера внизу"
          helperText="Можна вставити: {managerName}, {managerPhone}, {managerEmail}, {site}, {quoteNumber}."
          value={pdf.ctaContactTemplate}
          error={at('ctaContactTemplate')}
          onChange={(ctaContactTemplate) => onChange({ ctaContactTemplate })}
        />
      </QuoteSettingsGrid>
    </QuoteSettingsCard>
  );
}
