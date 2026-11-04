import { formatQuotePrice, quoteTierLabels, quoteTiers } from '@admin/quotes/model';
import { Alert, Box, LinearProgress, Paper, Stack, Typography } from '@mui/material';

import type { QuoteCustomSewingPrice } from '@admin/quotes/model';

interface Props {
  price: QuoteCustomSewingPrice | null;
  calculating: boolean;
  /** What is still missing; shown instead of prices. */
  missing: readonly string[];
  error: string | null;
}

const minutesFormat = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

/** «Розрахунок»: three prices of each fabric by the Catalog formula, or why there are none. */
export function QuoteCustomPriceSummary({ price, calculating, missing, error }: Props) {
  return (
    <Stack component="section" aria-label="Розрахунок" sx={{ gap: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Розрахунок
      </Typography>
      {calculating && <LinearProgress aria-label="Рахуємо ціну" />}
      {error && <Alert severity="error">{error}</Alert>}
      {missing.length > 0 ? (
        <Typography variant="body2" color="text.secondary">
          {missing[0]}
        </Typography>
      ) : (
        price?.fabrics.map((fabric) => (
          <Paper key={fabric.fabricId} variant="outlined" sx={{ p: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {fabric.name ?? 'Тканину не знайдено'} · {minutesFormat.format(fabric.meters)} м
            </Typography>
            {fabric.prices ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                  gap: 1,
                  mt: 1,
                }}
              >
                {quoteTiers.map((tier) => (
                  <Box key={tier}>
                    <Typography variant="caption" color="text.secondary">
                      {quoteTierLabels[tier]}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {formatQuotePrice(fabric.prices?.[tier] ?? null)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Alert severity="warning" sx={{ mt: 1 }}>
                {fabric.problems.join('; ') || 'Не вдалося порахувати ціну.'}
              </Alert>
            )}
            {fabric.minutes !== null && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Час {minutesFormat.format(fabric.minutes)} хв
                {fabric.laborCost !== null &&
                  ` · трудовитрати ${formatQuotePrice(fabric.laborCost)}`}
                {fabric.fullCost !== null && ` · собівартість ${formatQuotePrice(fabric.fullCost)}`}
              </Typography>
            )}
          </Paper>
        ))
      )}
    </Stack>
  );
}
