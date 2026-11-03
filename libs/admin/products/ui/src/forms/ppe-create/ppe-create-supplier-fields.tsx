import { ppeSupplierOfferLimits } from '@admin/products/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { TextField } from '@mui/material';

import { PpeLinkField } from '../../components/ppe-card/ppe-link-field';
import { PpeSupplierSelect } from '../../components/ppe-card/ppe-supplier-select';

import type { PpeCreateFieldsProps } from './ppe-create-fields-props';
import type { PpeSupplierOption } from '../../components/ppe-card/ppe-supplier-select';

interface Props extends PpeCreateFieldsProps {
  suppliers: readonly PpeSupplierOption[];
}

/** Block 2 «Постачальник»: who sells the product and where its page is. */
export function PpeCreateSupplierFields({ values, errors, disabled, onChange, suppliers }: Props) {
  return (
    <ReferenceFormSection title="Постачальник">
      <PpeSupplierSelect
        label="Постачальник"
        required
        value={values.supplierId}
        suppliers={suppliers}
        error={errors.supplierId}
        helperText={
          suppliers.length === 0
            ? 'Немає активних постачальників — «Контрагенти».'
            : 'Тільки зі списку «Контрагенти».'
        }
        disabled={disabled}
        onChange={(value) => onChange('supplierId', value)}
      />
      <TextField
        label="Артикул постачальника"
        value={values.supplierSku}
        onChange={(event) => onChange('supplierSku', event.target.value)}
        error={Boolean(errors.supplierSku)}
        helperText={errors.supplierSku}
        disabled={disabled}
        fullWidth
        slotProps={{ htmlInput: { maxLength: ppeSupplierOfferLimits.supplierSku } }}
      />
      <PpeLinkField
        label="Посилання постачальника"
        openLabel="Відкрити товар постачальника"
        required
        value={values.supplierUrl}
        maxLength={ppeSupplierOfferLimits.supplierUrl}
        error={errors.supplierUrl}
        disabled={disabled}
        onChange={(value) => onChange('supplierUrl', value)}
      />
    </ReferenceFormSection>
  );
}
