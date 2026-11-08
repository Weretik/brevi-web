import { quotePdfIntroCases, quotePdfIntroMarks } from '@admin/quotes/model';
import { Box, FormControlLabel, Stack, Switch, Typography } from '@mui/material';

import { QuoteSettingsField } from '../form/quote-settings-field';
import { QuoteSettingsGroup, errorsAt } from '../form/quote-settings-layout';

import type {
  QuotePdfIntroTextsDraft,
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

const standardHint = 'Порожнє поле — стандартний текст.';

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
  // Each variant under its own heading and a line, so the cases stand apart from the mark buttons.
  const intro = (key: keyof QuotePdfIntroTextsDraft, when: string, index: number) => (
    <Box
      key={key}
      sx={{ pt: index === 0 ? 0 : 2, borderTop: index === 0 ? 0 : 1, borderColor: 'divider' }}
    >
      <Typography variant="subtitle2" component="h4" sx={{ mb: 1, fontWeight: 700 }}>
        {when}
      </Typography>
      <QuoteSettingsField
        path={`pdf.intros.${key}`}
        label="Текст"
        name={when}
        multiline
        minRows={2}
        marks={quotePdfIntroMarks}
        value={pdf.intros[key]}
        saved={saved.intros[key]}
        error={at(`intros.${key}`)}
        onChange={(value) => onChange({ intros: { ...pdf.intros, [key]: value } })}
      />
    </Box>
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
      <QuoteSettingsGroup title="Вступ під назвою клієнта">
        <Stack sx={{ gap: 1.5 }}>
          <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
            PDF сам вибирає текст за складом КП. «Для кого» стає «для ТОВ …» або «для вас»,
            «Модель», «Тканина» і «ЗІЗ» беруться з позицій. {standardHint}
          </Box>
          {quotePdfIntroCases.map(({ key, when }, index) => intro(key, when, index))}
        </Stack>
      </QuoteSettingsGroup>
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
