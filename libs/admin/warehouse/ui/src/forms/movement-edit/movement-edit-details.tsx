import { ReferenceFormSection } from '@admin/references/ui';
import { fabricMovementKindLabels, formatMeters, movementEditEffect } from '@admin/warehouse/model';
import { Alert, Autocomplete, TextField } from '@mui/material';

import type {
  FabricMovementEditErrors,
  FabricMovementEditValues,
  FabricMovementRow,
} from '@admin/warehouse/model';

interface Props {
  row: FabricMovementRow;
  values: FabricMovementEditValues;
  errors: FabricMovementEditErrors;
  /** Known suppliers for a receipt. */
  suppliers: readonly string[];
  disabled: boolean;
  onChange: (patch: Partial<FabricMovementEditValues>) => void;
}

const signed = (value: number) => `${value > 0 ? '+' : ''}${formatMeters(value)}`;

const metersHelp: Record<FabricMovementRow['kind'], string> = {
  Opening: 'Від 0, до двох знаків після коми.',
  Receipt: 'Більше нуля, до двох знаків після коми.',
  Issue: 'Фактично взято, більше нуля.',
  Adjustment: 'Зміна зі знаком: мінус — менше на складі.',
  Reversal: '',
};

/** Metres with the effect on the balance, the date, receipt or issue details and the reason of the edit. */
export function MovementEditDetails({ row, values, errors, suppliers, disabled, onChange }: Props) {
  const effect = movementEditEffect(row, values);
  const current = `${row.fabricCode} · ${row.color}`;
  return (
    <ReferenceFormSection title={fabricMovementKindLabels[row.kind]}>
      <TextField
        label={row.kind === 'Adjustment' ? 'Зміна, м' : 'Метри'}
        required
        value={values.meters}
        error={Boolean(errors.meters)}
        helperText={errors.meters ?? metersHelp[row.kind]}
        disabled={disabled}
        slotProps={{ htmlInput: { inputMode: 'decimal' } }}
        onChange={(event) => onChange({ meters: event.target.value })}
      />
      {effect && (
        <Alert severity="info">
          {effect.moves
            ? `${current}: ${signed(effect.back)}; нова тканина і колір: ${signed(effect.change)}.`
            : effect.change === 0
              ? 'Залишок не зміниться.'
              : `Залишок ${current} зміниться на ${signed(effect.change)}.`}
        </Alert>
      )}
      <TextField
        label="Дата операції"
        type="date"
        required
        value={values.operationDate}
        error={Boolean(errors.operationDate)}
        helperText={errors.operationDate ?? 'Пізніші записи перерахуються за датою.'}
        disabled={disabled}
        slotProps={{ inputLabel: { shrink: true } }}
        onChange={(event) => onChange({ operationDate: event.target.value })}
      />
      {row.kind === 'Receipt' && (
        <>
          <Autocomplete
            freeSolo
            options={suppliers}
            inputValue={values.supplierName}
            disabled={disabled}
            onInputChange={(_event, supplierName) => onChange({ supplierName })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Постачальник"
                error={Boolean(errors.supplierName)}
                helperText={errors.supplierName}
              />
            )}
          />
          <TextField
            label="Документ"
            value={values.document}
            error={Boolean(errors.document)}
            helperText={errors.document}
            disabled={disabled}
            onChange={(event) => onChange({ document: event.target.value })}
          />
        </>
      )}
      {row.kind === 'Issue' && row.itemId === null && (
        <TextField
          label="Куди використано / контрагент"
          value={values.destination}
          error={Boolean(errors.destination)}
          helperText={errors.destination}
          disabled={disabled}
          onChange={(event) => onChange({ destination: event.target.value })}
        />
      )}
      <TextField
        label="Причина правки"
        multiline
        minRows={2}
        value={values.reason}
        error={Boolean(errors.reason)}
        helperText={errors.reason ?? 'Необовʼязково; буде в історії правок.'}
        disabled={disabled}
        onChange={(event) => onChange({ reason: event.target.value })}
      />
    </ReferenceFormSection>
  );
}
