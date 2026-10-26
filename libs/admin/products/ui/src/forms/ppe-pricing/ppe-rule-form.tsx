import { Alert, Button, Stack, TextField, Typography } from '@mui/material';

import type { PpeRuleMarkupDraft } from '@admin/products/model';

interface Props {
  code: string;
  value: PpeRuleMarkupDraft;
  onChange: (value: PpeRuleMarkupDraft) => void;
  onSave: () => void;
  disabled: boolean;
  error: string | null;
}
export function PpeRuleForm({ code, value, onChange, onSave, disabled, error }: Props) {
  return (
    <Stack
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        onSave();
      }}
      sx={{ gap: 1 }}
    >
      <Typography variant="subtitle1" component="h4">
        Правило націнки: {code}
      </Typography>
      <Alert severity="info">
        Правило спільне для всіх товарів із цією назвою. Зміна вплине на їхній розрахунок.
      </Alert>
      {error && <Alert severity="error">{error}</Alert>}
      {(['retail', 'wholesale', 'largeWholesale'] as const).map((tier, index) => (
        <TextField
          key={tier}
          label={
            [
              'Роздрібна націнка (0.5 = 50%)',
              'Оптова націнка (0.36 = 36%)',
              'Націнка великого опту (0.3 = 30%)',
            ][index]
          }
          type="number"
          required
          disabled={disabled}
          value={value[tier]}
          onChange={(event) => onChange({ ...value, [tier]: event.target.value })}
          slotProps={{ htmlInput: { min: 0, step: 0.00000001 } }}
        />
      ))}
      <Button type="submit" variant="outlined" disabled={disabled}>
        Зберегти й підтвердити правило
      </Button>
    </Stack>
  );
}
