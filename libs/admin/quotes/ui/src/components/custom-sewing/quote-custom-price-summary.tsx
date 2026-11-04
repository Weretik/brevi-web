import { Alert, LinearProgress, Stack, Typography } from '@mui/material';

interface Props {
  calculating: boolean;
  /** What is still missing before the variants can be priced. */
  missing: readonly string[];
  error: string | null;
}

/** «Розрахунок»: what is still missing or why the server could not price; prices are on the variant cards. */
export function QuoteCustomPriceSummary({ calculating, missing, error }: Props) {
  if (!calculating && !error && missing.length === 0) return null;
  return (
    <Stack component="section" aria-label="Розрахунок" sx={{ gap: 1 }}>
      {calculating && <LinearProgress aria-label="Рахуємо ціну" />}
      {error && <Alert severity="error">{error}</Alert>}
      {missing.length > 0 && (
        <Typography variant="body2" color="text.secondary">
          {missing[0]}
        </Typography>
      )}
    </Stack>
  );
}
