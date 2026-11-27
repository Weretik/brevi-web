import { CardPageHeader } from '@admin/shared/ui';
import { Button, Chip } from '@mui/material';

import type { Supplier } from '@admin/references/model';

interface Props {
  supplier: Supplier;
  canEdit: boolean;
  onBack: () => void;
  onEdit: () => void;
}

/** Header of a supplier card (CARD-001): the same shape as a client card. */
export function SupplierCardHeader({ supplier, canEdit, onBack, onEdit }: Props) {
  return (
    <CardPageHeader
      backLabel="Контрагенти · Постачальники"
      onBack={onBack}
      kind="Постачальник"
      title={supplier.name}
      facts={[
        supplier.purchaseCategories,
        supplier.contactPerson ? `Контакт: ${supplier.contactPerson}` : null,
        supplier.phoneNumber,
      ]}
      badge={
        !supplier.isActive && (
          <Chip size="small" color="warning" label="Не використовується в проєкті" />
        )
      }
      actions={
        canEdit && (
          <Button variant="outlined" onClick={onEdit}>
            Редагувати
          </Button>
        )
      }
    />
  );
}
