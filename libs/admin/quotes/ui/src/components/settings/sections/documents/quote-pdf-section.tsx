import { Box, FormControlLabel, Stack, Switch } from '@mui/material';

import { QuotePdfIntroGroup, standardHint } from './quote-pdf-intro-group';
import { QuoteSettingsField } from '../../form/quote-settings-field';
import { QuoteSettingsGroup, errorsAt } from '../../form/quote-settings-layout';

import type {
  QuotePdfLabelsDraft,
  QuotePdfTextsDraft,
  QuoteMark,
  QuoteSettingsErrors,
} from '@admin/quotes/model';

interface Props {
  pdf: QuotePdfTextsDraft;
  saved: QuotePdfTextsDraft;
  errors: QuoteSettingsErrors;
  onChange: (patch: Partial<QuotePdfTextsDraft>) => void;
}

type FlatKey = Exclude<keyof QuotePdfTextsDraft, 'intros' | 'labels' | 'showClient'>;

interface FieldOptions {
  required?: boolean;
  multiline?: boolean;
  marks?: boolean | readonly QuoteMark[];
  helperText?: string;
  minRows?: number;
}

const labelFields: readonly { key: keyof QuotePdfLabelsDraft; label: string; hint: string }[] = [
  { key: 'codeLabel', label: 'Перед кодом товару', hint: 'Наприклад «арт.».' },
  { key: 'siteLink', label: 'Посилання на товар', hint: 'Під описом, веде на сайт.' },
  { key: 'fabricsTitle', label: 'Над тканинами моделі', hint: 'Заголовок варіантів тканини.' },
  { key: 'recommended', label: 'Позначка рекомендованого', hint: 'Коли варіантів кілька.' },
  { key: 'commentTitle', label: 'Над коментарем', hint: 'Якщо в КП є коментар.' },
];

/**
 * «PDF КП під запит»: the title, the opening text for each КП composition, the VAT note, the short texts
 * of the items and the block at the bottom of the page (R-35).
 */
export function QuotePdfSection({ pdf, saved, errors, onChange }: Props) {
  const at = errorsAt(errors, 'pdf');
  const field = (key: FlatKey, label: string, options: FieldOptions = {}) => (
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
  const label = (key: keyof QuotePdfLabelsDraft, title: string, options: FieldOptions = {}) => (
    <QuoteSettingsField
      key={key}
      path={`pdf.labels.${key}`}
      label={title}
      {...options}
      value={pdf.labels[key]}
      saved={saved.labels[key]}
      error={at(`labels.${key}`)}
      onChange={(value) => onChange({ labels: { ...pdf.labels, [key]: value } })}
    />
  );
  return (
    <>
      <Stack sx={{ gap: 1.5 }}>
        {field('title', 'Заголовок документа', { required: true })}
        {field('vatNotice', 'Примітка про ПДВ', {
          multiline: true,
          helperText: 'Під вступом, жирним.',
        })}
        {label('contactLine', 'Контакт під примітками', {
          marks: true,
          helperText: `Під приміткою про ПДВ. ${standardHint}`,
        })}
      </Stack>
      <QuoteSettingsGroup title="Блок «Для» з клієнтом">
        <Stack sx={{ gap: 1.5 }}>
          <FormControlLabel
            control={
              <Switch
                checked={pdf.showClient}
                onChange={(event) => onChange({ showClient: event.target.checked })}
              />
            }
            label="Показувати в PDF"
          />
          <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
            Ліворуч від вступу: «Підприємство» і «Отримувач» з КП. Без блоку вступ займає всю
            ширину.
          </Box>
          {pdf.showClient &&
            label('clientTitle', 'Заголовок над клієнтом', {
              helperText: `Наприклад «Для» або «Замовник». ${standardHint}`,
            })}
        </Stack>
      </QuoteSettingsGroup>
      <QuotePdfIntroGroup pdf={pdf} saved={saved} errors={errors} onChange={onChange} />
      <QuoteSettingsGroup title="Підписи позицій">
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          {labelFields.map(({ key, label: title, hint }) =>
            label(key, title, { helperText: `${hint} ${standardHint}` }),
          )}
        </Box>
      </QuoteSettingsGroup>
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
