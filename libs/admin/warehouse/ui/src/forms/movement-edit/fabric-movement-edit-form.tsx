import { ReferenceFormSection } from '@admin/references/ui';
import { fabricMovementKindLabels } from '@admin/warehouse/model';
import { Stack, Typography } from '@mui/material';

import { MovementEditDetails } from './movement-edit-details';
import { MovementIssuePairFields } from './movement-issue-pair-fields';
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
        <MovementIssuePairFields
          row={row}
          values={values}
          error={errors.pairColorKey}
          fabrics={fabrics}
          disabled={disabled}
          onChange={set}
        />
      )}
      <MovementEditDetails
        row={row}
        values={values}
        errors={errors}
        suppliers={choices?.suppliers ?? []}
        disabled={disabled}
        onChange={set}
      />
    </Stack>
  );
}
