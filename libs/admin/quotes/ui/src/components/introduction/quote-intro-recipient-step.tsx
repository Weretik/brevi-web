import { quoteIntroEmailMax, quoteNameMaxLength, quoteTextMaxLength } from '@admin/quotes/model';
import { Box, TextField } from '@mui/material';

import { QuoteIntroStep } from './quote-intro-step';

import type { QuoteIntroDraft, QuoteIntroErrors } from '@admin/quotes/model';

type Fields = Pick<
  QuoteIntroDraft,
  'internalName' | 'recipientEmail' | 'companyName' | 'recipientName' | 'managerNote'
>;

interface Props {
  draft: Fields;
  errors: QuoteIntroErrors;
  onChange: (patch: Partial<Fields>) => void;
}

/** Step 2: who the catalogue is for. Only the email goes to «Кому»; the note stays inside. */
export function QuoteIntroRecipientStep({ draft, errors, onChange }: Props) {
  const field = (
    key: keyof Fields,
    label: string,
    options: { max: number; helper?: string; placeholder?: string; type?: string } = {
      max: quoteNameMaxLength,
    },
  ) => (
    <TextField
      size="small"
      label={label}
      type={options.type}
      placeholder={options.placeholder}
      value={draft[key]}
      error={Boolean(errors[key])}
      helperText={errors[key] ?? options.helper}
      onChange={(event) => onChange({ [key]: event.target.value })}
      slotProps={{ htmlInput: { maxLength: options.max } }}
    />
  );
  return (
    <QuoteIntroStep
      step={2}
      title="Вкажіть отримувача"
      description="Контактна особа необов’язкова, але допоможе персоналізувати лист."
    >
      <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        {field('internalName', 'Клієнт або назва запиту', {
          max: quoteNameMaxLength,
          helper: 'Бачите лише ви, у переліку КП.',
        })}
        {field('recipientEmail', 'Електронна пошта', {
          max: quoteIntroEmailMax,
          type: 'email',
          placeholder: 'office@company.ua',
          helper: 'Підставиться в «Кому» при надсиланні.',
        })}
        {field('companyName', 'Назва підприємства', {
          max: quoteNameMaxLength,
          placeholder: 'ТОВ «Приклад»',
        })}
        {field('recipientName', 'Контактна особа', {
          max: quoteNameMaxLength,
          placeholder: 'Ім’я та посада',
        })}
        <Box sx={{ gridColumn: { md: '1 / -1' }, display: 'grid' }}>
          {field('managerNote', 'Внутрішня нотатка', {
            max: quoteTextMaxLength,
            helper: 'Не потрапить клієнту.',
            placeholder:
              'Наприклад: телефонували 15.09, просили надіслати інформацію на загальну пошту',
          })}
        </Box>
      </Box>
    </QuoteIntroStep>
  );
}
