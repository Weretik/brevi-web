import { formatMeters } from '@admin/warehouse/model';
import { Autocomplete, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';

import type {
  FabricMovementFilter,
  FabricMovementQuery,
  FabricStockFabric,
} from '@admin/warehouse/model';

interface Props {
  query: FabricMovementQuery;
  fabrics: readonly FabricStockFabric[];
  onChange: (change: Partial<Omit<FabricMovementQuery, 'page'>>) => void;
}

const kinds: [FabricMovementFilter, string][] = [
  ['All', 'Усі'],
  ['Receipt', 'Прихід'],
  ['Issue', 'Витрата'],
];

/** Fabric, colour and «Усі / Прихід / Витрата»; any code of an alias group selects the group. */
export function FabricMovementFilters({ query, fabrics, onChange }: Props) {
  const fabric = fabrics.find((x) => x.codes.includes(query.fabricCode ?? '')) ?? null;
  const color = fabric?.colors.find((x) => x.color === query.color) ?? null;
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{ gap: 1.5, mb: 2, alignItems: { md: 'center' } }}
    >
      <Autocomplete
        size="small"
        options={[...fabrics]}
        value={fabric}
        sx={{ minWidth: 280, flex: 1 }}
        getOptionLabel={(option) => `${option.fabricCode} · ${option.fabricName}`}
        isOptionEqualToValue={(option, selected) => option.fabricCode === selected.fabricCode}
        onChange={(_event, selected) =>
          onChange({ fabricCode: selected?.fabricCode ?? null, color: null })
        }
        renderInput={(params) => <TextField {...params} label="Тканина" />}
      />
      <Autocomplete
        size="small"
        options={fabric?.colors ?? []}
        value={color}
        disabled={!fabric}
        sx={{ minWidth: 220 }}
        getOptionLabel={(option) => `${option.color} · ${formatMeters(option.meters)}`}
        isOptionEqualToValue={(option, selected) => option.colorKey === selected.colorKey}
        onChange={(_event, selected) => onChange({ color: selected?.color ?? null })}
        renderInput={(params) => <TextField {...params} label="Колір" />}
      />
      <ToggleButtonGroup
        exclusive
        size="small"
        value={query.kind}
        aria-label="Вид руху"
        onChange={(_event, kind: FabricMovementFilter | null) => kind && onChange({ kind })}
      >
        {kinds.map(([kind, label]) => (
          <ToggleButton key={kind} value={kind}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Stack>
  );
}
