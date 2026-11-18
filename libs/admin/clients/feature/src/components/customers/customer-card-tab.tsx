import { CustomerContacts } from '@admin/clients/ui';
import { Alert, Button } from '@mui/material';

import { CustomerForm } from './customer-form';
import { DuplicateCandidates } from './duplicate-candidates';
import { useCustomerDetail } from '../../hooks/customers/use-customer-detail';
import { CustomerContactDialog } from '../contacts/customer-contact-dialog';
import { CustomerMergeDialog } from '../merge/customer-merge-dialog';

type CustomerDetail = ReturnType<typeof useCustomerDetail>;

interface Props {
  detail: CustomerDetail;
  customer: NonNullable<CustomerDetail['customer']>;
}

/** «Картка» of a client: the form, duplicates, contacts and merging. */
export function CustomerCardTab({ detail, customer }: Props) {
  const { customerId, dirty, setDirty, setContactDirty, setMergeDirty, epoch, setReloadConfirm } =
    detail;
  const { error, duplicates, setDuplicates, contact, setContact, merge, setMerge } = detail;
  const { saved, setSaved, refresh, save, pending } = detail;
  return (
    <>
      {saved && (
        <Alert severity="success" onClose={() => setSaved(false)}>
          Клієнта збережено.
        </Alert>
      )}
      <Button
        disabled={pending || !!contact || merge}
        onClick={() => {
          if (dirty) setReloadConfirm(true);
          else void refresh();
        }}
      >
        Оновити дані із сервера
      </Button>
      {dirty && (
        <Alert severity="info">
          Спочатку збережіть зміни клієнта, щоб редагувати контакти або об’єднати записи.
        </Alert>
      )}
      <CustomerForm
        key={`${customerId}:${customer.revision}:${epoch}`}
        customer={customer}
        pending={pending}
        error={error}
        onSave={(draft) => void save(draft)}
        onDirty={setDirty}
        onCheckDuplicates={(draft) =>
          setDuplicates(draft.taxIdentity.trim() || draft.displayName.trim())
        }
      />
      {duplicates && <DuplicateCandidates term={duplicates} currentId={customerId} />}
      {!!customer.externalIdentities.length && (
        <Alert severity="info">
          Зовнішні зв’язки:{' '}
          {customer.externalIdentities
            .map((x) => `${x.source}/${x.type}: ${x.externalId}`)
            .join('; ')}
        </Alert>
      )}
      <CustomerContacts
        contacts={customer.contacts}
        canEdit={customer.canEdit && !dirty && !pending}
        onEdit={(value) => setContact({ value })}
      />
      {customer.canMerge && (
        <Button color="warning" disabled={dirty || pending} onClick={() => setMerge(true)}>
          Об’єднати з перевіреним дублем
        </Button>
      )}
      {contact && (
        <CustomerContactDialog
          customer={customer}
          contact={contact.value}
          onDirty={setContactDirty}
          onClose={() => setContact(null)}
          onRefresh={() => {
            setContact(null);
            void refresh();
          }}
        />
      )}
      {merge && (
        <CustomerMergeDialog
          customer={customer}
          onDirty={setMergeDirty}
          onClose={() => setMerge(false)}
          onRefresh={() => {
            setMerge(false);
            void refresh();
          }}
        />
      )}
    </>
  );
}
