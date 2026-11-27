import { CustomerContactDialog } from '../contacts/customer-contact-dialog';
import { CustomerEditDrawer } from '../customers/customer-edit-drawer';
import { CustomerMergeDialog } from '../merge/customer-merge-dialog';

import type { useCustomerDetail } from '../../hooks/customers/use-customer-detail';
import type { CustomerDetail } from '@admin/clients/model';

interface Props {
  detail: ReturnType<typeof useCustomerDetail>;
  customer: CustomerDetail;
  editing: boolean;
  onCloseEdit: () => void;
}

/** The panels a client card opens: «Редагувати», a contact and merging with a duplicate. */
export function CustomerCardDialogs({ detail, customer, editing, onCloseEdit }: Props) {
  const reopen = (close: () => void) => () => {
    close();
    void detail.refresh();
  };
  return (
    <>
      {editing && (
        <CustomerEditDrawer
          key={`${customer.publicId}:${customer.revision}`}
          customer={customer}
          saving={detail.pending}
          error={detail.error}
          onDirty={detail.setDirty}
          onSave={detail.save}
          onClose={onCloseEdit}
        />
      )}
      {detail.contact && (
        <CustomerContactDialog
          customer={customer}
          contact={detail.contact.value}
          onDirty={detail.setContactDirty}
          onClose={() => detail.setContact(null)}
          onRefresh={reopen(() => detail.setContact(null))}
        />
      )}
      {detail.merge && (
        <CustomerMergeDialog
          customer={customer}
          onDirty={detail.setMergeDirty}
          onClose={() => detail.setMerge(false)}
          onRefresh={reopen(() => detail.setMerge(false))}
        />
      )}
    </>
  );
}
