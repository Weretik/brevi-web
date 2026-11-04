import {
  FABRIC_ISSUE_MAX_LINES,
  emptyIssueLine,
  fabricIssuePurposeLabels,
  fabricIssuePurposes,
} from '@admin/production/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  Alert,
  Autocomplete,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';

import type {
  FabricIssueErrors,
  FabricIssueFormValues,
  FabricIssueLineValues,
  FabricIssuePurpose,
  FabricStockFabricChoice,
  ProductionItemFabric,
} from '@admin/production/model';

interface Props {
  values: FabricIssueFormValues;
  errors: FabricIssueErrors;
  fabric: ProductionItemFabric;
  fabrics: readonly FabricStockFabricChoice[];
  /** The item's fabric in «Тканини», for new lines. */
  itemFabricId: number | null;
  disabled: boolean;
  onChange: (values: FabricIssueFormValues) => void;
}

const purposeHelp: Record<FabricIssuePurpose, string> = {
  Planned: 'Планова тканина й колір; покриває план.',
  Replacement: 'Інша тканина чи колір замість планового; закриває його.',
  Additional: 'Понад план; план не покриває.',
};

/** «Видача» of an item: one package with planned, replacement and extra lines. */
export function FabricIssueForm({
  values,
  errors,
  fabric,
  fabrics,
  itemFabricId,
  disabled,
  onChange,
}: Props) {
  const setLine = (key: string, patch: Partial<FabricIssueLineValues>) =>
    onChange({
      ...values,
      lines: values.lines.map((line) => (line.key === key ? { ...line, ...patch } : line)),
    });

  function choosePart(line: FabricIssueLineValues, colorKey: string) {
    const part = fabric.plan.find((x) => x.colorKey === colorKey);
    if (!part) return;
    setLine(
      line.key,
      line.purpose === 'Planned'
        ? {
            planColorKey: colorKey,
            color: part.color,
            fabricId: fabrics.find((x) => x.code === part.fabricCode)?.id ?? line.fabricId,
          }
        : { planColorKey: colorKey },
    );
  }

  return (
    <Stack sx={{ gap: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
        <TextField
          label="Дата видачі"
          type="date"
          required
          value={values.issuedOn}
          error={Boolean(errors.issuedOn)}
          helperText={errors.issuedOn}
          disabled={disabled}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(event) => onChange({ ...values, issuedOn: event.target.value })}
        />
        <TextField
          label="Коментар"
          fullWidth
          value={values.note}
          error={Boolean(errors.note)}
          helperText={errors.note}
          disabled={disabled}
          onChange={(event) => onChange({ ...values, note: event.target.value })}
        />
      </Stack>
      {errors.lines && <Alert severity="error">{errors.lines}</Alert>}
      {values.lines.map((line, index) => {
        const own = errors.line[line.key] ?? {};
        const chosen = fabrics.find((x) => x.id === line.fabricId) ?? null;
        return (
          <Paper key={line.key} variant="outlined" sx={{ p: 1.5 }}>
            <Stack sx={{ gap: 1.5 }}>
              <Stack direction="row" sx={{ gap: 1.5, alignItems: 'flex-start' }}>
                <TextField
                  select
                  label={`Рядок ${index + 1}`}
                  value={line.purpose}
                  disabled={disabled}
                  helperText={purposeHelp[line.purpose]}
                  sx={{ minWidth: 160, flex: 1 }}
                  onChange={(event) => {
                    const purpose = event.target.value as FabricIssuePurpose;
                    setLine(line.key, {
                      purpose,
                      planColorKey: purpose === 'Additional' ? null : line.planColorKey,
                    });
                  }}
                >
                  {fabricIssuePurposes.map((purpose) => (
                    <MenuItem
                      key={purpose}
                      value={purpose}
                      disabled={purpose !== 'Additional' && fabric.plan.length === 0}
                    >
                      {fabricIssuePurposeLabels[purpose]}
                    </MenuItem>
                  ))}
                </TextField>
                {line.purpose !== 'Additional' && (
                  <TextField
                    select
                    label="Плановий колір"
                    value={line.planColorKey ?? ''}
                    error={Boolean(own.planColorKey)}
                    helperText={own.planColorKey}
                    disabled={disabled}
                    sx={{ minWidth: 160, flex: 1 }}
                    onChange={(event) => choosePart(line, event.target.value)}
                  >
                    {fabric.plan.map((part) => (
                      <MenuItem key={part.colorKey} value={part.colorKey}>
                        {part.color}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
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
                  options={fabrics}
                  value={chosen}
                  disabled={disabled}
                  sx={{ flex: 2 }}
                  getOptionLabel={(option) => `${option.code} · ${option.name}`}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  onChange={(_event, value) => setLine(line.key, { fabricId: value?.id ?? null })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Тканина"
                      required
                      error={Boolean(own.fabricId)}
                      helperText={own.fabricId}
                    />
                  )}
                />
                <TextField
                  label="Колір"
                  required
                  value={line.color}
                  error={Boolean(own.color)}
                  helperText={own.color}
                  disabled={disabled}
                  sx={{ flex: 1 }}
                  onChange={(event) => setLine(line.key, { color: event.target.value })}
                />
                <TextField
                  label="Метри"
                  required
                  value={line.meters}
                  error={Boolean(own.meters)}
                  helperText={own.meters}
                  disabled={disabled}
                  sx={{ width: { sm: 120 } }}
                  slotProps={{ htmlInput: { inputMode: 'decimal' } }}
                  onChange={(event) => setLine(line.key, { meters: event.target.value })}
                />
              </Stack>
            </Stack>
          </Paper>
        );
      })}
      <Button
        startIcon={<AddOutlinedIcon />}
        disabled={disabled || values.lines.length >= FABRIC_ISSUE_MAX_LINES}
        sx={{ alignSelf: 'flex-start' }}
        onClick={() =>
          onChange({ ...values, lines: [...values.lines, emptyIssueLine(itemFabricId)] })
        }
      >
        Додати рядок
      </Button>
    </Stack>
  );
}
