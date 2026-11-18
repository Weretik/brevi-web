import { formatMeters } from '@admin/warehouse/model';
import { Autocomplete, Stack, TextField } from '@mui/material';

import type {
  FabricStockFabric,
  ItemIssueErrors,
  ItemIssueLineValues,
} from '@admin/warehouse/model';

interface Props {
  line: ItemIssueLineValues;
  errors: ItemIssueErrors['line'][string];
  fabrics: readonly FabricStockFabric[];
  disabled: boolean;
  onChange: (patch: Partial<ItemIssueLineValues>) => void;
}

const fabricLabel = (fabric: FabricStockFabric) =>
  `${fabric.fabricCode} · ${fabric.fabricName} · ${formatMeters(fabric.meters)}`;

/** The fabric and colour from the stock and the metres actually taken. */
export function ItemIssuePairFields({ line, errors: own, fabrics, disabled, onChange }: Props) {
  const fabric = fabrics.find((x) => x.fabricCode === line.fabricCode) ?? null;
  const color = fabric?.colors.find((x) => x.colorKey === line.colorKey) ?? null;
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 1.5 }}>
      <Autocomplete
        options={[...fabrics]}
        value={fabric}
        disabled={disabled}
        sx={{ flex: 2 }}
        getOptionLabel={fabricLabel}
        isOptionEqualToValue={(option, selected) => option.fabricCode === selected.fabricCode}
        onChange={(_event, selected) =>
          onChange({
            fabricCode: selected?.fabricCode ?? null,
            colorKey: selected?.colors.length === 1 ? (selected.colors[0]?.colorKey ?? null) : null,
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
        onChange={(_event, selected) => onChange({ colorKey: selected?.colorKey ?? null })}
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
        onChange={(event) => onChange({ meters: event.target.value })}
      />
    </Stack>
  );
}
