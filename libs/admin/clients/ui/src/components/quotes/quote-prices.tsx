import { quoteBasisState } from '@admin/clients/model';
import { Alert, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';

import { quoteBlockerMessage } from './quote-blocker-message';

import type { QuoteVariantDraft } from '@admin/clients/model';

const labels = { retail: 'Роздріб', wholesale: 'Опт', largeWholesale: 'Великий опт' } as const;
const format = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });
export function QuotePrices({
  variant,
  disabled,
  now,
  onChange,
}: {
  variant: QuoteVariantDraft;
  disabled: boolean;
  now: number;
  onChange: (value: QuoteVariantDraft['tierVisibility']) => void;
}) {
  const state = quoteBasisState(variant, now);
  return (
    <Stack spacing={1}>
      {state === 'missing' && <Alert severity="info">Потрібен серверний розрахунок.</Alert>}
      {state === 'changed' && (
        <Alert severity="warning">Вибір змінився. Потрібен новий розрахунок.</Alert>
      )}
      {state === 'expired' && (
        <Alert severity="warning">Строк розрахунку минув. Оновіть його явно.</Alert>
      )}
      {variant.basis?.value.blockers.map((code) => (
        <Alert severity="warning" key={code}>
          {quoteBlockerMessage(code)}
        </Alert>
      ))}
      {state === 'blocked' && !variant.basis?.value.blockers.length && (
        <Alert severity="warning">Деякі ціни недоступні.</Alert>
      )}
      {variant.basis?.origin === 'saved' && (
        <Typography variant="caption">Збережені ціни версії</Typography>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        {(['retail', 'wholesale', 'largeWholesale'] as const).map((code) => {
          const amount = variant.basis?.value[code];
          return (
            <FormControlLabel
              key={code}
              control={
                <Checkbox
                  disabled={disabled}
                  checked={variant.tierVisibility[code]}
                  onChange={(_, checked) =>
                    onChange({ ...variant.tierVisibility, [code]: checked })
                  }
                />
              }
              label={`${labels[code]}: ${amount == null ? 'ціна недоступна' : format.format(amount)}`}
            />
          );
        })}
      </Stack>
      {!Object.values(variant.tierVisibility).some(Boolean) && (
        <Alert severity="info">
          Усі ціни приховано. Чернетку можна зберегти; готовий документ потребуватиме перевірки.
        </Alert>
      )}
    </Stack>
  );
}
