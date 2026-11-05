import { Stack } from '@mui/material';

import { QuoteSettingsField } from '../form/quote-settings-field';
import { QuoteSettingsGroup, errorsAt } from '../form/quote-settings-layout';

import type { QuotePdfTextsDraft, QuoteSettingsErrors } from '@admin/quotes/model';

interface Props {
  pdf: QuotePdfTextsDraft;
  saved: QuotePdfTextsDraft;
  errors: QuoteSettingsErrors;
  onChange: (patch: Partial<QuotePdfTextsDraft>) => void;
}

/** «PDF КП під запит»: the title, the opening text, the VAT note and the block at the bottom of the page. */
export function QuotePdfSection({ pdf, saved, errors, onChange }: Props) {
  const at = errorsAt(errors, 'pdf');
  const field = (
    key: keyof QuotePdfTextsDraft,
    label: string,
    options: { required?: boolean; multiline?: boolean; marks?: boolean; helperText?: string } = {},
  ) => (
    <QuoteSettingsField
      path={`pdf.${key}`}
      label={label}
      {...options}
      value={pdf[key]}
      saved={saved[key]}
      error={at(key)}
      onChange={(value) => onChange({ [key]: value })}
    />
  );
  return (
    <>
      <Stack sx={{ gap: 1.5 }}>
        {field('title', 'Заголовок документа', { required: true })}
        {field('introText', 'Вступ під назвою клієнта', {
          multiline: true,
          helperText:
            '{client} — назва клієнта. Порожнє поле — стандартний текст: «Підібрали для {client} добірку…».',
        })}
        {field('vatNotice', 'Примітка про ПДВ', {
          multiline: true,
          helperText: 'Під вступом, жирним.',
        })}
      </Stack>
      <QuoteSettingsGroup title="Блок унизу сторінки">
        <Stack sx={{ gap: 1.5 }}>
          {field('ctaTitle', 'Заголовок блоку')}
          {field('ctaText', 'Текст блоку', { multiline: true })}
          {field('ctaContactTemplate', 'Контакт менеджера', { multiline: true, marks: true })}
        </Stack>
      </QuoteSettingsGroup>
    </>
  );
}
