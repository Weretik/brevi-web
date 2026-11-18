import { Box, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';

import { QuoteStartClientField } from './quote-start-client-field';

import type { QuoteClientSuggestion, QuoteStartKind } from '@admin/quotes/model';

interface Props {
  name: string;
  client: QuoteClientSuggestion | null;
  clients: readonly QuoteClientSuggestion[];
  kind: QuoteStartKind;
  nameError?: string;
  onNameChange: (name: string) => void;
  onClientChange: (client: QuoteClientSuggestion | null) => void;
  onKindChange: (kind: QuoteStartKind) => void;
}

const kinds: readonly { kind: QuoteStartKind; title: string; text: string }[] = [
  {
    kind: 'Request',
    title: 'КП під запит',
    text: 'Клієнт щось попросив: моделі з каталогу з тканинами, нові вироби під замовлення, товари ЗІЗ. Ціни за кількістю.',
  },
  {
    kind: 'Introduction',
    title: 'КП для знайомства',
    text: 'Рекламна добірка моделей (по 4 на сторінку) для нового клієнта, з листом і готовими шаблонами.',
  },
];

/** «Нове КП»: first who it is for (KeepinCRM or typed), then which kind of КП. */
export function QuoteStartForm({
  name,
  client,
  clients,
  kind,
  nameError,
  onNameChange,
  onClientChange,
  onKindChange,
}: Props) {
  return (
    <Stack sx={{ gap: 3 }}>
      <Box>
        <Typography variant="overline" color="text.secondary" component="h3">
          1 · Для кого
        </Typography>
        <QuoteStartClientField
          name={name}
          client={client}
          clients={clients}
          error={nameError}
          onNameChange={onNameChange}
          onClientChange={onClientChange}
        />
      </Box>
      <Box>
        <Typography variant="overline" color="text.secondary" component="h3" id="quote-start-kind">
          2 · Що готуємо
        </Typography>
        <RadioGroup
          aria-labelledby="quote-start-kind"
          value={kind}
          onChange={(event) => onKindChange(event.target.value as QuoteStartKind)}
          sx={{ gap: 1, mt: 1 }}
        >
          {kinds.map((option) => {
            const selected = option.kind === kind;
            return (
              <FormControlLabel
                key={option.kind}
                value={option.kind}
                control={<Radio sx={{ mt: -0.5 }} />}
                sx={{
                  m: 0,
                  p: 1.5,
                  pl: 1,
                  alignItems: 'flex-start',
                  borderRadius: 2,
                  border: selected ? 2 : 1,
                  borderColor: selected ? 'primary.main' : 'divider',
                  bgcolor: selected ? 'primary.light' : 'background.paper',
                }}
                label={
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{option.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.text}
                    </Typography>
                  </Box>
                }
              />
            );
          })}
        </RadioGroup>
        <Typography variant="caption" color="text.secondary" component="p" sx={{ mt: 1 }}>
          Виріб, якого немає в каталозі, додають у КП під запит кнопкою «Новий виріб».
        </Typography>
      </Box>
    </Stack>
  );
}
