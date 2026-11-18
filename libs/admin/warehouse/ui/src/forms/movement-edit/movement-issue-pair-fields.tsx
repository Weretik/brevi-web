import { ReferenceFormSection } from '@admin/references/ui';
import { formatMeters, stockColorKey } from '@admin/warehouse/model';
import { Autocomplete, TextField } from '@mui/material';

import type {
  FabricMovementEditValues,
  FabricMovementRow,
  FabricStockFabric,
} from '@admin/warehouse/model';

interface Props {
  row: FabricMovementRow;
  values: FabricMovementEditValues;
  error: string | undefined;
  fabrics: readonly FabricStockFabric[];
  disabled: boolean;
  onChange: (patch: Partial<FabricMovementEditValues>) => void;
}

/** An issue may move to another pair the stock holds. */
export function MovementIssuePairFields({
  row,
  values,
  error,
  fabrics,
  disabled,
  onChange,
}: Props) {
  const code = values.pairCode ?? row.groupCode;
  const key = values.pairColorKey ?? stockColorKey(row.color);
  const fabric = fabrics.find((x) => x.fabricCode === code) ?? null;
  const color = fabric?.colors.find((x) => x.colorKey === key) ?? null;
  return (
    <ReferenceFormSection title="Тканина зі складу">
      <Autocomplete
        options={[...fabrics]}
        value={fabric}
        disabled={disabled}
        getOptionLabel={(option) => `${option.fabricCode} · ${option.fabricName}`}
        isOptionEqualToValue={(option, selected) => option.fabricCode === selected.fabricCode}
        onChange={(_event, selected) =>
          onChange({
            pairCode: selected?.fabricCode ?? null,
            pairColorKey:
              selected?.colors.length === 1 ? (selected.colors[0]?.colorKey ?? null) : null,
          })
        }
        renderInput={(params) => <TextField {...params} label="Тканина" required />}
      />
      <Autocomplete
        options={fabric?.colors ?? []}
        value={color}
        disabled={disabled || !fabric}
        getOptionLabel={(option) => `${option.color} · ${formatMeters(option.meters)}`}
        isOptionEqualToValue={(option, selected) => option.colorKey === selected.colorKey}
        onChange={(_event, selected) =>
          onChange({ pairCode: code, pairColorKey: selected?.colorKey ?? null })
        }
        renderInput={(params) => (
          <TextField {...params} label="Колір" required error={Boolean(error)} helperText={error} />
        )}
      />
    </ReferenceFormSection>
  );
}
