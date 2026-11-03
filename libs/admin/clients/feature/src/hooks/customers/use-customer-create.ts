import { useCreateCustomerMutation } from '@admin/clients/data-access';
import { customerDraft, customerErrors } from '@admin/clients/model';
import { useState } from 'react';

import { customerError } from '../../errors/customer-error';
import { useCustomerRequest } from '../requests/use-customer-request';

import type { CustomerDetail, CustomerDraft } from '@admin/clients/model';

/** Draft, checks and save of a new client in the «Контрагенти → Клієнти» side panel. */
export function useCustomerCreate(onCreated: (customer: CustomerDetail) => void) {
  const [create, state] = useCreateCustomerMutation();
  const [draft, setDraft] = useState<CustomerDraft>(() => customerDraft());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [duplicates, setDuplicates] = useState('');
  const [error, setError] = useState<string | null>(null);
  const requestId = useCustomerRequest();

  async function save() {
    const found = customerErrors(draft);
    setErrors(found);
    if (Object.keys(found).length) return;
    setError(null);
    try {
      onCreated(await create({ draft, requestId: requestId(draft) }).unwrap());
    } catch (failure) {
      setError(customerError(failure));
    }
  }

  return {
    draft,
    setDraft,
    errors,
    error,
    saving: state.isLoading,
    duplicates,
    checkDuplicates: () => setDuplicates(draft.taxIdentity.trim() || draft.displayName.trim()),
    save,
  };
}
