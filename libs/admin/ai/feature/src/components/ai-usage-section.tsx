import { Alert, LinearProgress, Stack, Typography } from '@mui/material';

import type { AiUsage } from '@admin/ai/model';

interface Props {
  usage: AiUsage;
  limitUsd: number;
}

const usd = (value: number) => `${value.toLocaleString('uk-UA', { maximumFractionDigits: 4 })} $`;
const count = (value: number) => value.toLocaleString('uk-UA');

/** This month's requests, tokens and cost against the limit; a reached limit is a problem. */
export function AiUsageSection({ usage, limitUsd }: Props) {
  const share = limitUsd > 0 ? Math.min(100, (usage.costUsd / limitUsd) * 100) : 100;
  return (
    <Stack sx={{ gap: 1 }}>
      <Typography variant="body2">
        {usage.month}: {count(usage.requests)} запитів,{' '}
        {count(usage.inputTokens + usage.outputTokens)} токенів,{' '}
        <strong>{usd(usage.costUsd)}</strong> з {usd(limitUsd)}
      </Typography>
      <LinearProgress variant="determinate" value={share} aria-label="Витрати місяця від ліміту" />
      {usage.costUsd >= limitUsd && (
        <Alert severity="warning">
          Ліміт цього місяця вичерпано: ШІ не надсилає нових запитів.
        </Alert>
      )}
    </Stack>
  );
}
