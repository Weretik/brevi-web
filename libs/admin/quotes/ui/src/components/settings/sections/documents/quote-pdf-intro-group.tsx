import { quotePdfIntroCases, quotePdfIntroMarks } from '@admin/quotes/model';
import { Box, Stack, Typography } from '@mui/material';

import { QuoteSettingsField } from '../../form/quote-settings-field';
import { QuoteSettingsGroup, errorsAt } from '../../form/quote-settings-layout';

import type {
  QuotePdfIntroTextsDraft,
  QuotePdfTextsDraft,
  QuoteSettingsErrors,
} from '@admin/quotes/model';

export const standardHint = 'Порожнє поле — стандартний текст.';

interface Props {
  pdf: QuotePdfTextsDraft;
  saved: QuotePdfTextsDraft;
  errors: QuoteSettingsErrors;
  onChange: (patch: Partial<QuotePdfTextsDraft>) => void;
}

/** «Вступ під назвою клієнта»: the opening text for each КП composition. */
export function QuotePdfIntroGroup({ pdf, saved, errors, onChange }: Props) {
  const at = errorsAt(errors, 'pdf');
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
  return (
    <QuoteSettingsGroup title="Вступ під назвою клієнта">
      <Stack sx={{ gap: 1.5 }}>
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          PDF сам вибирає текст за складом КП. «Для кого» стає «для ТОВ …» або «для вас», «Модель»,
          «Тканина» і «ЗІЗ» беруться з позицій. {standardHint}
        </Box>
        {quotePdfIntroCases.map(({ key, when }, index) => intro(key, when, index))}
      </Stack>
    </QuoteSettingsGroup>
  );
}
