import { Alert, Button, Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';

import type { ProductionPackageView } from '@admin/clients/model';

export function QuoteProductionActions(props: {
  choices: readonly { id: string; label: string }[];
  selected: readonly string[];
  artifact: ProductionPackageView | null;
  locked: boolean;
  canExport: boolean;
  versionNumber: number;
  onSelect: (id: string, checked: boolean) => void;
  onExport: () => void;
  onDownload: () => void;
}) {
  return (
    <Stack spacing={2}>
      <Alert severity="info">
        ZIP містить виробничі дані вибраної версії. Він не створює замовлення в Цеху та не надсилає
        КП.
      </Alert>
      {props.choices.length === 0 && (
        <Typography>У версії немає видимих індивідуальних варіантів для виробництва.</Typography>
      )}
      {props.choices.map((choice) => (
        <FormControlLabel
          key={choice.id}
          label={choice.label}
          control={
            <Checkbox
              slotProps={{ input: { 'aria-label': `Виробництво: ${choice.label}` } }}
              checked={props.selected.includes(choice.id)}
              disabled={props.locked}
              onChange={(_event, checked) => props.onSelect(choice.id, checked)}
            />
          }
        />
      ))}
      <Button type="button" variant="outlined" disabled={!props.canExport} onClick={props.onExport}>
        Створити виробничий ZIP
      </Button>
      {props.artifact && (
        <>
          <Typography>
            Збережений пакет · версія КП {props.versionNumber} · {props.artifact.bytes} байт
          </Typography>
          <Typography variant="caption" sx={{ overflowWrap: 'anywhere' }}>
            SHA-256: {props.artifact.sha256}
          </Typography>
          <Button type="button" disabled={props.locked} onClick={props.onDownload}>
            Завантажити виробничий ZIP
          </Button>
        </>
      )}
    </Stack>
  );
}
