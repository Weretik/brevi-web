import { ReferenceFormSection } from '@admin/references/ui';
import { FormControlLabel, Switch } from '@mui/material';

import type { PpeCreateFieldsProps } from './ppe-create-fields-props';

type Props = PpeCreateFieldsProps;

/** Block 4 «Публікація»: whether the price list shows the product. */
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
    </ReferenceFormSection>
  );
}
