import {
  productionOrderFilterChipText,
  productionStageLabels,
  setProductionOrderFilters,
} from '@admin/production/model';
import { Chip } from '@mui/material';

import type {
  ProductionOrderFilterField,
  ProductionOrderFilterOptions,
  ProductionOrderFilterValues,
  ProductionStage,
} from '@admin/production/model';

interface Props {
  values: ProductionOrderFilterValues;
  options: ProductionOrderFilterOptions | null;
  manager: string | null;
  stage: ProductionStage | null;
  onChange: (field: ProductionOrderFilterField, value: string | null) => void;
  onManagerChange: (manager: string | null) => void;
  onStageChange: (stage: ProductionStage | null) => void;
}

const sx = { height: 32, bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 600 };

/** The set filters as chips next to the status chips; × removes one filter. */
export function ProductionOrderFilterChips({
  values,
  options,
  manager,
  stage,
  onChange,
  onManagerChange,
  onStageChange,
}: Props) {
  return (
    <>
      {stage && (
        <Chip
          sx={sx}
          label={`Етап: ${productionStageLabels[stage]}`}
          onDelete={() => onStageChange(null)}
        />
      )}
      {setProductionOrderFilters(values).map((field) => (
        <Chip
          key={field}
          sx={sx}
          label={productionOrderFilterChipText(field, values[field] ?? '', options)}
          onDelete={() => onChange(field, null)}
        />
      ))}
      {manager && (
        <Chip sx={sx} label={`Менеджер: ${manager}`} onDelete={() => onManagerChange(null)} />
      )}
    </>
  );
}
