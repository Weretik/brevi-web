import { Checkbox, FormControlLabel, Stack, Switch } from '@mui/material';

/** Under the review line: «Разова назва» and, for a finance counterparty, «Запамʼятати». */
export function FinanceReviewOptions({
  oneoff,
  onOneoffChange,
  rememberLabel,
  remember,
  onRememberChange,
}: {
  oneoff: boolean;
  onOneoffChange: (oneoff: boolean) => void;
  rememberLabel: string | null;
  remember: boolean;
  onRememberChange: (remember: boolean) => void;
}) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ columnGap: 3, rowGap: 0.5 }}>
      <FormControlLabel
        control={
          <Switch
            size="small"
            checked={oneoff}
            onChange={(event) => onOneoffChange(event.target.checked)}
          />
        }
        label="Разова назва"
        slotProps={{ typography: { variant: 'body2' } }}
      />
      {rememberLabel && (
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={remember}
              onChange={(event) => onRememberChange(event.target.checked)}
            />
          }
          label={rememberLabel}
          slotProps={{ typography: { variant: 'body2' } }}
        />
      )}
    </Stack>
  );
}
