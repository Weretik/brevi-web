import { PRODUCTION_WORK_COMMENT_MAX_LENGTH } from '@admin/production/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { Checkbox, FormControlLabel, MenuItem, TextField } from '@mui/material';

import type { ProductionWorkErrors, ProductionWorkFormValues } from '@admin/production/model';

interface Props {
  values: ProductionWorkFormValues;
  errors: ProductionWorkErrors;
  reasons: readonly string[];
  disabled: boolean;
  onChange: (patch: Partial<ProductionWorkFormValues>) => void;
}

/** «Понад план»: work beyond the item quantity with its reason, and the comment. */
export function ProductionWorkOverPlanSection({
  values,
  errors,
  reasons,
  disabled,
  onChange,
}: Props) {
  return (
    <ReferenceFormSection title="Понад план">
      <FormControlLabel
        control={
          <Checkbox
            checked={values.overPlan}
            disabled={disabled}
            onChange={(event) => onChange({ overPlan: event.target.checked, reason: '' })}
          />
        }
        label="Робота понад кількість у позиції"
      />
      {values.overPlan && (
        <TextField
          select
          label="Причина"
          required
          value={values.reason}
          error={Boolean(errors.reason)}
          helperText={errors.reason ?? 'Така робота не зараховується в план позиції.'}
          disabled={disabled}
          onChange={(event) => onChange({ reason: event.target.value })}
        >
          {reasons.map((reason) => (
            <MenuItem key={reason} value={reason}>
              {reason}
            </MenuItem>
          ))}
        </TextField>
      )}
      <TextField
        label="Коментар"
        multiline
        minRows={2}
        value={values.comment}
        error={Boolean(errors.comment)}
        helperText={errors.comment}
        disabled={disabled}
        slotProps={{ htmlInput: { maxLength: PRODUCTION_WORK_COMMENT_MAX_LENGTH } }}
        onChange={(event) => onChange({ comment: event.target.value })}
      />
    </ReferenceFormSection>
  );
}
