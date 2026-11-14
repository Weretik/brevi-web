import { Alert, Box, LinearProgress, Stack, Typography } from '@mui/material';

import type { AiSettings } from '@admin/ai/model';

interface Props {
  settings: AiSettings;
}

const usd = (value: number) => `${value.toLocaleString('uk-UA', { maximumFractionDigits: 2 })} $`;
const count = (value: number) => value.toLocaleString('uk-UA');
const monthName = (month: string) =>
  new Date(`${month}-01T00:00:00`).toLocaleString('uk-UA', { month: 'long' });

/** Why the AI does not read invoices now, or null when it does. */
export function aiStopReason(settings: AiSettings): string | null {
  if (!settings.hasKey) return 'Немає ключа OpenAI';
  if (!settings.enabled) return 'ШІ вимкнено';
  if (settings.usage.costUsd >= settings.monthlyLimitUsd) return 'Вичерпано ліміт місяця';
  return null;
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Stack sx={{ p: 1.5, gap: 0.25, bgcolor: 'background.paper', minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      {children}
    </Stack>
  );
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontWeight: 600, fontSize: 16 } as const;

/** The answer to «does the AI work now?», the key and this month's spending against the limit. */
export function AiStatusStrip({ settings }: Props) {
  const reason = aiStopReason(settings);
  const { usage } = settings;
  const share =
    settings.monthlyLimitUsd > 0
      ? Math.min(100, (usage.costUsd / settings.monthlyLimitUsd) * 100)
      : 100;
  return (
    <Stack sx={{ gap: 1.5 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1px',
          bgcolor: 'divider',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Cell label="Стан">
          <Typography sx={mono} color={reason ? 'warning.main' : 'text.primary'}>
            {reason ? 'Не працює' : 'Працює'}
          </Typography>
        </Cell>
        <Cell label="Ключ OpenAI">
          <Typography sx={mono} color={settings.hasKey ? 'text.primary' : 'warning.main'}>
            {settings.hasKey ? `sk-…${settings.keyHint ?? ''}` : 'Немає'}
          </Typography>
        </Cell>
        <Cell label={`Витрачено за ${monthName(usage.month)}`}>
          <Typography sx={mono}>
            {usd(usage.costUsd)} з {usd(settings.monthlyLimitUsd)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={share}
            aria-label="Витрати місяця від ліміту"
            sx={{ mt: 0.5 }}
          />
        </Cell>
        <Cell label="Запитів · токенів">
          <Typography sx={mono}>
            {count(usage.requests)} · {count(usage.inputTokens + usage.outputTokens)}
          </Typography>
        </Cell>
      </Box>
      {reason && (
        <Alert severity="warning">
          ШІ не читає рахунки: {reason.toLowerCase()}.
          {!settings.hasKey && ' Додайте ключ у картці «Ключ OpenAI».'}
          {settings.hasKey && !settings.enabled && ' Увімкніть його в картці «Робота ШІ».'}
          {settings.hasKey && settings.enabled && ' Підніміть ліміт або зачекайте до 1-го числа.'}
        </Alert>
      )}
    </Stack>
  );
}
