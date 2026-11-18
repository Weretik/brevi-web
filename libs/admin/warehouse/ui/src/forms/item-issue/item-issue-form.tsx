import { FABRIC_ISSUE_MAX_LINES, issueLineFor, planPartKey } from '@admin/warehouse/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Alert, Button, Stack, TextField } from '@mui/material';

import { ItemIssueLine } from './item-issue-line';

import type {
  FabricStockFabric,
  ItemFabric,
  ItemIssueErrors,
  ItemIssueFormValues,
  ItemIssueLineValues,
} from '@admin/warehouse/model';

interface Props {
  values: ItemIssueFormValues;
  errors: ItemIssueErrors;
  card: ItemFabric;
  /** Pairs the stock holds; every line takes one of them. */
  fabrics: readonly FabricStockFabric[];
  disabled: boolean;
  onChange: (values: ItemIssueFormValues) => void;
}

/** «Видача» by actual cutting: products cut now and the real metres of each pair. */
export function ItemIssueForm({ values, errors, card, fabrics, disabled, onChange }: Props) {
  const setLine = (key: string, patch: Partial<ItemIssueLineValues>) =>
    onChange({
      ...values,
      lines: values.lines.map((line) => (line.key === key ? { ...line, ...patch } : line)),
    });

  function choosePart(line: ItemIssueLineValues, partKey: string) {
    const part = card.plan.find((x) => planPartKey(x) === partKey) ?? null;
    const fresh = issueLineFor(part, fabrics);
    // A new part brings its planned pair unless the line already took another one.
    setLine(line.key, {
      partKey: fresh.partKey,
      layer: part ? null : line.layer,
      fabricCode: line.fabricCode ?? fresh.fabricCode,
      colorKey: line.fabricCode ? line.colorKey : fresh.colorKey,
    });
  }

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
        <TextField
          label="Розкроєно виробів"
          required
          value={values.issuedQuantity}
          error={Boolean(errors.issuedQuantity)}
          helperText={errors.issuedQuantity ?? `У позиції ${card.quantity} шт.`}
          disabled={disabled}
          slotProps={{ htmlInput: { inputMode: 'numeric' } }}
          onChange={(event) => onChange({ ...values, issuedQuantity: event.target.value })}
        />
        <TextField
          label="Дата видачі"
          type="date"
          required
          value={values.issuedOn}
          error={Boolean(errors.issuedOn)}
          helperText={errors.issuedOn ?? 'День, коли тканину реально взяли.'}
          disabled={disabled}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(event) => onChange({ ...values, issuedOn: event.target.value })}
        />
      </Stack>
      <TextField
        label="Коментар"
        value={values.note}
        error={Boolean(errors.note)}
        helperText={errors.note}
        disabled={disabled}
        onChange={(event) => onChange({ ...values, note: event.target.value })}
      />
      {errors.lines && <Alert severity="error">{errors.lines}</Alert>}
      {values.lines.map((line, index) => (
        <ItemIssueLine
          key={line.key}
          line={line}
          index={index}
          errors={errors.line[line.key] ?? {}}
          card={card}
          fabrics={fabrics}
          disabled={disabled}
          canRemove={values.lines.length > 1}
          onChange={(patch) => setLine(line.key, patch)}
          onChoosePart={(partKey) => choosePart(line, partKey)}
          onRemove={() =>
            onChange({ ...values, lines: values.lines.filter((x) => x.key !== line.key) })
          }
        />
      ))}
      <Button
        startIcon={<AddOutlinedIcon />}
        disabled={disabled || values.lines.length >= FABRIC_ISSUE_MAX_LINES}
        sx={{ alignSelf: 'flex-start' }}
        onClick={() =>
          onChange({ ...values, lines: [...values.lines, issueLineFor(null, fabrics)] })
        }
      >
        Додати рядок
      </Button>
    </Stack>
  );
}
