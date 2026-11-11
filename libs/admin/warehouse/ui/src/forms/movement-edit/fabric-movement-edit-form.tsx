import { ReferenceFormSection } from '@admin/references/ui';
import {
  fabricMovementKindLabels,
  formatMeters,
  movementEditEffect,
  stockColorKey,
} from '@admin/warehouse/model';
import { Alert, Autocomplete, Stack, TextField, Typography } from '@mui/material';

import { FabricOfferField, StockColorField } from '../stock-operations/fabric-choice-fields';

import type {
  FabricMovementEditErrors,
  FabricMovementEditValues,
  FabricMovementRow,
  FabricStockChoices,
  FabricStockFabric,
} from '@admin/warehouse/model';

interface Props {
  row: FabricMovementRow;
  values: FabricMovementEditValues;
  errors: FabricMovementEditErrors;
  /** Offers, colours and suppliers for a receipt. */
  choices: FabricStockChoices | undefined;
  /** Pairs the stock holds, for an issue. */
  fabrics: readonly FabricStockFabric[];
  disabled: boolean;
  onChange: (values: FabricMovementEditValues) => void;
}

const signed = (value: number) => `${value > 0 ? '+' : ''}${formatMeters(value)}`;

const metersHelp: Record<FabricMovementRow['kind'], string> = {
  Opening: 'Від 0, до двох знаків після коми.',
  Receipt: 'Більше нуля, до двох знаків після коми.',
  Issue: 'Фактично взято, більше нуля.',
  Adjustment: 'Зміна зі знаком: мінус — менше на складі.',
  Reversal: '',
};

/**
 * Edit of one movement, not the whole history of the fabric. The fields follow the kind; the effect on the
 * balance is shown before saving.
 */
export function FabricMovementEditForm({
  row,
  values,
  errors,
  choices,
  fabrics,
  disabled,
  onChange,
}: Props) {
  const set = (patch: Partial<FabricMovementEditValues>) => onChange({ ...values, ...patch });
  const effect = movementEditEffect(row, values);
  const current = `${row.fabricCode} · ${row.color}`;
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {fabricMovementKindLabels[row.kind]}: {row.fabricName}, {current}.
      </Typography>
      {row.kind === 'Receipt' && choices && (
        <ReferenceFormSection title="Тканина">
          <FabricOfferField
            choices={choices}
            value={
              values.fabricId ?? choices.fabrics.find((x) => x.code === row.fabricCode)?.id ?? null
            }
            error={errors.fabricId}
            disabled={disabled}
            onChange={(fabricId) => {
              const offer = choices.fabrics.find((x) => x.id === fabricId);
              set({ fabricId: !offer || offer.code === row.fabricCode ? null : offer.id });
            }}
          />
          <StockColorField
            colors={choices.colors}
            value={values.color}
            error={errors.color}
            disabled={disabled}
            onChange={(color) => set({ color })}
          />
        </ReferenceFormSection>
      )}
      {row.kind === 'Issue' && (
        <IssuePairFields
          row={row}
          values={values}
          error={errors.pairColorKey}
          fabrics={fabrics}
          disabled={disabled}
          onChange={set}
        />
      )}
      <ReferenceFormSection title={fabricMovementKindLabels[row.kind]}>
        <TextField
          label={row.kind === 'Adjustment' ? 'Зміна, м' : 'Метри'}
          required
          value={values.meters}
          error={Boolean(errors.meters)}
          helperText={errors.meters ?? metersHelp[row.kind]}
          disabled={disabled}
          slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          onChange={(event) => set({ meters: event.target.value })}
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
          onChange={(event) => set({ operationDate: event.target.value })}
        />
        {row.kind === 'Receipt' && (
          <>
            <Autocomplete
              freeSolo
              options={choices?.suppliers ?? []}
              inputValue={values.supplierName}
              disabled={disabled}
              onInputChange={(_event, supplierName) => set({ supplierName })}
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
              onChange={(event) => set({ document: event.target.value })}
            />
          </>
        )}
        {row.kind === 'Issue' && (
          <TextField
            label="Куди використано / контрагент"
            value={values.destination}
            error={Boolean(errors.destination)}
            helperText={errors.destination}
            disabled={disabled}
            onChange={(event) => set({ destination: event.target.value })}
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
          onChange={(event) => set({ reason: event.target.value })}
        />
      </ReferenceFormSection>
    </Stack>
  );
}

interface PairProps {
  row: FabricMovementRow;
  values: FabricMovementEditValues;
  error: string | undefined;
  fabrics: readonly FabricStockFabric[];
  disabled: boolean;
  onChange: (patch: Partial<FabricMovementEditValues>) => void;
}

/** An issue may move to another pair the stock holds. */
function IssuePairFields({ row, values, error, fabrics, disabled, onChange }: PairProps) {
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
