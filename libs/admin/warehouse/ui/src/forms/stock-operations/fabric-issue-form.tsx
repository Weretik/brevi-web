import { ReferenceFormSection } from '@admin/references/ui';
import { formatMeters } from '@admin/warehouse/model';
import { Alert, Autocomplete, Stack, TextField } from '@mui/material';

import type {
  FabricIssueErrors,
  FabricIssueFormValues,
  FabricStockFabric,
  FabricStockPair,
} from '@admin/warehouse/model';

interface Props {
  values: FabricIssueFormValues;
  errors: FabricIssueErrors;
  /** Pairs the stock holds; an issue takes only one of them. */
  fabrics: readonly FabricStockFabric[];
  pair: FabricStockPair | null;
  /** The pair balance after this issue; null until the metres are a number. */
  after: number | null;
  disabled: boolean;
  onChange: (values: FabricIssueFormValues) => void;
}

const fabricLabel = (fabric: FabricStockFabric) =>
  `${fabric.fabricCode} · ${fabric.fabricName} · ${formatMeters(fabric.meters)}`;

/** «Разова витрата / без замовлення»: real metres from a pair; a shortage becomes a visible minus. */
export function FabricIssueForm({
  values,
  errors,
  fabrics,
  pair,
  after,
  disabled,
  onChange,
}: Props) {
  const set = (patch: Partial<FabricIssueFormValues>) => onChange({ ...values, ...patch });
  const fabric = fabrics.find((x) => x.fabricCode === values.fabricCode) ?? null;
  const color = fabric?.colors.find((x) => x.colorKey === values.colorKey) ?? null;
  return (
    <Stack sx={{ gap: 2 }}>
      <ReferenceFormSection title="Тканина зі складу">
        <Autocomplete
          options={[...fabrics]}
          value={fabric}
          disabled={disabled}
          getOptionLabel={fabricLabel}
          isOptionEqualToValue={(option, selected) => option.fabricCode === selected.fabricCode}
          onChange={(_event, selected) =>
            set({
              fabricCode: selected?.fabricCode ?? null,
              colorKey:
                selected?.colors.length === 1 ? (selected.colors[0]?.colorKey ?? null) : null,
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Тканина"
              required
              error={Boolean(errors.fabricCode)}
              helperText={errors.fabricCode}
            />
          )}
        />
        <Autocomplete
          options={fabric?.colors ?? []}
          value={color}
          disabled={disabled || !fabric}
          getOptionLabel={(option) => `${option.color} · ${formatMeters(option.meters)}`}
          isOptionEqualToValue={(option, selected) => option.colorKey === selected.colorKey}
          onChange={(_event, selected) => set({ colorKey: selected?.colorKey ?? null })}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Колір"
              required
              error={Boolean(errors.colorKey)}
              helperText={errors.colorKey}
            />
          )}
        />
      </ReferenceFormSection>
      <ReferenceFormSection title="Витрата">
        <TextField
          label="Метри"
          required
          value={values.meters}
          error={Boolean(errors.meters)}
          helperText={errors.meters ?? 'Фактично взято, до двох знаків після коми.'}
          disabled={disabled}
          slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          onChange={(event) => set({ meters: event.target.value })}
        />
        {pair && after !== null && (
          <Alert severity={after < 0 ? 'warning' : 'info'}>
            На складі {formatMeters(pair.color.meters)}, після витрати {formatMeters(after)}.
            {after < 0 && ' Нестача стане відʼємним залишком.'}
          </Alert>
        )}
        <TextField
          label="Дата операції"
          type="date"
          required
          value={values.operationDate}
          error={Boolean(errors.operationDate)}
          helperText={errors.operationDate ?? 'День, коли тканину реально взяли.'}
          disabled={disabled}
          slotProps={{ inputLabel: { shrink: true } }}
          onChange={(event) => set({ operationDate: event.target.value })}
        />
        <TextField
          label="Куди використано / контрагент"
          value={values.destination}
          error={Boolean(errors.destination)}
          helperText={errors.destination ?? 'Не створює клієнта чи замовлення.'}
          disabled={disabled}
          onChange={(event) => set({ destination: event.target.value })}
        />
        <TextField
          label="Коментар"
          multiline
          minRows={2}
          value={values.note}
          error={Boolean(errors.note)}
          helperText={errors.note}
          disabled={disabled}
          onChange={(event) => set({ note: event.target.value })}
        />
      </ReferenceFormSection>
    </Stack>
  );
}
