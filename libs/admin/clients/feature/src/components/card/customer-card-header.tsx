import { CardPageHeader } from '@admin/shared/ui';
import { Button, Chip } from '@mui/material';

import type { CustomerDetail } from '@admin/clients/model';

interface Props {
  customer: CustomerDetail;
  canCreateQuote: boolean;
  busy: boolean;
  onBack: () => void;
  onEdit: () => void;
  onMerge: () => void;
  onNewQuote: () => void;
}

/** Header of a client card: name, legal facts, «Об’єднати», «Редагувати» and «Нова КП». */
export function CustomerCardHeader({
  customer,
  canCreateQuote,
  busy,
  onBack,
  onEdit,
  onMerge,
  onNewQuote,
}: Props) {
  const primary = customer.contacts.find((contact) => contact.isPrimary) ?? customer.contacts[0];
  return (
    <CardPageHeader
      backLabel="Контрагенти · Клієнти"
      onBack={onBack}
      kind={customer.kind === 'person' ? 'Клієнт · фізична особа' : 'Клієнт · організація'}
      title={customer.displayName}
      facts={[
        customer.legalName !== customer.displayName ? customer.legalName : null,
        customer.taxIdentity ? `Код ${customer.taxIdentity}` : null,
        primary ? `Контакт: ${primary.name}` : null,
      ]}
      badge={!customer.active && <Chip size="small" color="warning" label="Не використовується" />}
      actions={
        <>
          {customer.canMerge && (
            <Button variant="outlined" disabled={busy} onClick={onMerge}>
              Об’єднати з дублем
            </Button>
          )}
          {customer.canEdit && (
            <Button variant="outlined" disabled={busy} onClick={onEdit}>
              Редагувати
            </Button>
          )}
          {canCreateQuote && (
            <Button variant="contained" onClick={onNewQuote}>
              Нова КП
            </Button>
          )}
        </>
      }
    />
  );
}
