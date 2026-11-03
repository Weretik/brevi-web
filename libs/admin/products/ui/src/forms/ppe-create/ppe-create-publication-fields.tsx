import { ReferenceFormSection } from '@admin/references/ui';
import { FormControlLabel, FormHelperText, Stack, Switch } from '@mui/material';

import type { PpeCreateFieldsProps } from './ppe-create-fields-props';

type Props = PpeCreateFieldsProps;

/** Block 4 «Публікація»: whether the price list shows the product and whether its prices are checked. */
export function PpeCreatePublicationFields({ values, disabled, onChange }: Props) {
  return (
    <ReferenceFormSection title="Публікація">
      <FormControlLabel
        control={
          <Switch
            checked={values.isActive}
            onChange={(event) => onChange('isActive', event.target.checked)}
            disabled={disabled}
          />
        }
        label="Активний · показувати в прайсі"
      />
      <Stack>
        <FormControlLabel
          control={
            <Switch
              checked={values.isVerified}
              onChange={(event) => onChange('isVerified', event.target.checked)}
              disabled={disabled}
            />
          }
          label="Перевірено"
        />
        <FormHelperText sx={{ mt: 0 }}>Ставте тільки після ручної перевірки цін.</FormHelperText>
      </Stack>
    </ReferenceFormSection>
  );
}
