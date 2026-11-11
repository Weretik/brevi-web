import {
  FABRIC_ISSUE_MAX_LINES,
  fabricIssuePurposeLabels,
  fabricLayerLabels,
  fabricLayers,
  formatMeters,
  issueLineFor,
  issueLinePair,
  issueLinePart,
  issueLinePurpose,
  planPartKey,
} from '@admin/warehouse/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  Alert,
  Autocomplete,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';

import type {
  FabricLayer,
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

const ABOVE_PLAN = '';

const fabricLabel = (fabric: FabricStockFabric) =>
  `${fabric.fabricCode} · ${fabric.fabricName} · ${formatMeters(fabric.meters)}`;

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
      {values.lines.map((line, index) => {
        const own = errors.line[line.key] ?? {};
        const pair = issueLinePair(line, fabrics);
        const part = issueLinePart(line, card);
        const purpose = issueLinePurpose(part, pair);
        const fabric = fabrics.find((x) => x.fabricCode === line.fabricCode) ?? null;
        const color = fabric?.colors.find((x) => x.colorKey === line.colorKey) ?? null;
        return (
          <Paper key={line.key} variant="outlined" sx={{ p: 1.5 }}>
            <Stack sx={{ gap: 1.5 }}>
              <Stack direction="row" sx={{ gap: 1.5, alignItems: 'flex-start' }}>
                <TextField
                  select
                  label={`Рядок ${index + 1}: що покриває`}
                  value={line.partKey ?? ABOVE_PLAN}
                  disabled={disabled}
                  sx={{ flex: 2 }}
                  onChange={(event) => choosePart(line, event.target.value)}
                >
                  {card.plan.map((x) => (
                    <MenuItem key={planPartKey(x)} value={planPartKey(x)}>
                      План: {x.fabricCode} · {x.color} (ще {formatMeters(x.missing)})
                    </MenuItem>
                  ))}
                  <MenuItem value={ABOVE_PLAN}>Понад план (додаткова)</MenuItem>
                </TextField>
                {!part && (
                  <TextField
                    select
                    label="Роль"
                    value={line.layer ?? ''}
                    disabled={disabled}
                    sx={{ flex: 1 }}
                    onChange={(event) =>
                      setLine(line.key, {
                        layer: (event.target.value || null) as FabricLayer | null,
                      })
                    }
                  >
                    <MenuItem value="">Не вказано</MenuItem>
                    {fabricLayers.map((layer) => (
                      <MenuItem key={layer} value={layer}>
                        {fabricLayerLabels[layer]}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
                <Chip
                  size="small"
                  label={fabricIssuePurposeLabels[purpose]}
                  color={purpose === 'Replacement' ? 'warning' : 'default'}
                  sx={{ mt: 2 }}
                />
                <Tooltip title="Прибрати рядок">
                  <span>
                    <IconButton
                      aria-label={`Прибрати рядок ${index + 1}`}
                      disabled={disabled || values.lines.length === 1}
                      onClick={() =>
                        onChange({
                          ...values,
                          lines: values.lines.filter((x) => x.key !== line.key),
                        })
                      }
                    >
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1.5 }}>
                <Autocomplete
                  options={[...fabrics]}
                  value={fabric}
                  disabled={disabled}
                  sx={{ flex: 2 }}
                  getOptionLabel={fabricLabel}
                  isOptionEqualToValue={(option, selected) =>
                    option.fabricCode === selected.fabricCode
                  }
                  onChange={(_event, selected) =>
                    setLine(line.key, {
                      fabricCode: selected?.fabricCode ?? null,
                      colorKey:
                        selected?.colors.length === 1
                          ? (selected.colors[0]?.colorKey ?? null)
                          : null,
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Тканина зі складу"
                      required
                      error={Boolean(own.fabricCode)}
                      helperText={own.fabricCode}
                    />
                  )}
                />
                <Autocomplete
                  options={fabric?.colors ?? []}
                  value={color}
                  disabled={disabled || !fabric}
                  sx={{ flex: 1.5 }}
                  getOptionLabel={(option) => `${option.color} · ${formatMeters(option.meters)}`}
                  isOptionEqualToValue={(option, selected) => option.colorKey === selected.colorKey}
                  onChange={(_event, selected) =>
                    setLine(line.key, { colorKey: selected?.colorKey ?? null })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Колір"
                      required
                      error={Boolean(own.colorKey)}
                      helperText={own.colorKey}
                    />
                  )}
                />
                <TextField
                  label="Метри"
                  required
                  value={line.meters}
                  error={Boolean(own.meters)}
                  helperText={own.meters ?? 'Фактично взято.'}
                  disabled={disabled}
                  sx={{ width: { sm: 130 } }}
                  slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                  onChange={(event) => setLine(line.key, { meters: event.target.value })}
                />
              </Stack>
              <TextField
                label="Примітка рядка"
                size="small"
                value={line.note}
                error={Boolean(own.note)}
                helperText={own.note}
                disabled={disabled}
                onChange={(event) => setLine(line.key, { note: event.target.value })}
              />
            </Stack>
          </Paper>
        );
      })}
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
