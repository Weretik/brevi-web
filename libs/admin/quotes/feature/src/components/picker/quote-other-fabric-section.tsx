import { formatQuotePrice, quoteTierLabels, quoteTiers } from '@admin/quotes/model';
import {
  Alert,
  Autocomplete,
  Box,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { useQuoteOtherFabric } from '../../hooks/picker/use-quote-other-fabric';
import type { QuoteCustomChoice } from '@admin/quotes/ui';

interface Props {
  other: ReturnType<typeof useQuoteOtherFabric>;
}

/** «Інша тканина з довідника»: a fabric the model has no Catalog variant in, priced by the formula. */
export function QuoteOtherFabricSection({ other }: Props) {
  return (
    <Stack component="section" aria-label="Інша тканина з довідника" sx={{ gap: 1 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Інша тканина з довідника
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Будь-яка тканина з довідника: ціну порахуємо з фурнітурою й операціями цієї моделі.
      </Typography>
      {other.unavailable ? (
        <Alert severity="warning">Не вдалося завантажити склад моделі.</Alert>
      ) : (
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1 }}>
          <Autocomplete
            size="small"
            options={other.choices as QuoteCustomChoice[]}
            loading={other.loading}
            value={other.fabric}
            onChange={(_event, choice) => other.choose(choice)}
            getOptionLabel={(choice) => choice.label}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            renderOption={(props, choice) => (
              <li {...props} key={choice.id}>
                <Stack>
                  <Typography variant="body2">{choice.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {choice.hint}
                  </Typography>
                </Stack>
              </li>
            )}
            renderInput={(params) => <TextField {...params} label="Тканина" />}
            sx={{ flex: 1 }}
          />
          <TextField
            size="small"
            label="Метрів на виріб"
            value={other.meters}
            onChange={(event) => other.setMeters(event.target.value)}
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
            sx={{ width: { sm: 150 } }}
          />
        </Stack>
      )}
      {other.calculating && <LinearProgress aria-label="Рахуємо ціну" />}
      {other.error && <Alert severity="error">{other.error}</Alert>}
      {other.price &&
        (other.price.prices ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1 }}>
            {quoteTiers.map((tier) => (
              <Box key={tier}>
                <Typography variant="caption" color="text.secondary">
                  {quoteTierLabels[tier]}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {formatQuotePrice(other.price?.prices?.[tier] ?? null)}
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Alert severity="warning">
            {other.price.problems.join('; ') || 'Не вдалося порахувати ціну.'}
          </Alert>
        ))}
    </Stack>
  );
}
