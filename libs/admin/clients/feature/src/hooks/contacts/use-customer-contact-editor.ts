import { useSaveCustomerContactMutation } from '@admin/clients/data-access';
import { contactDraft, contactErrors } from '@admin/clients/model';
import { useEffect, useState } from 'react';

import { customerError } from '../../errors/customer-error';
import { useCustomerRequest } from '../requests/use-customer-request';

import type { CustomerDetail, CustomerContact } from '@admin/clients/model';

export function useCustomerContactEditor({
  customer,
  contact,
  onClose,
  onDirty,
}: {
  customer: CustomerDetail;
  contact?: CustomerContact;
  onClose: () => void;
  onDirty: (dirty: boolean) => void;
}) {
  const [draft, setDraft] = useState(() => contactDraft(contact));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [discard, setDiscard] = useState(false);
  const [refreshAfterDiscard, setRefreshAfterDiscard] = useState(false);
  const [save, state] = useSaveCustomerContactMutation();
  const requestId = useCustomerRequest();
  const dirty = JSON.stringify(draft) !== JSON.stringify(contactDraft(contact));
  useEffect(() => {
    onDirty(dirty);
    return () => onDirty(false);
  }, [dirty, onDirty]);
  const close = () => {
    if (!state.isLoading) {
      if (dirty) setDiscard(true);
      else onClose();
    }
  };
  async function submit() {
    const errors = contactErrors(draft);
    setErrors(errors);
    if (Object.keys(errors).length) return;
    const intent = {
      customerId: customer.publicId,
      contactId: contact?.publicId,
      revision: customer.revision,
      draft,
    };
    try {
      await save({ ...intent, requestId: requestId(intent) }).unwrap();
      onClose();
    } catch (error) {
      setError(customerError(error));
    }
  }

  return {
    draft,
    setDraft,
    errors,
    error,
    discard,
    setDiscard,
    refreshAfterDiscard,
    setRefreshAfterDiscard,
    state,
    close,
    submit,
  };
}
