import { useCreateCustomerMutation } from '@admin/clients/data-access';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { customerError } from '../../errors/customer-error';
import { useClientDirtyGuard } from '../navigation/use-client-dirty-guard';
import { useCustomerRequest } from '../requests/use-customer-request';

import type { CustomerDraft } from '@admin/clients/model';

export function useCustomerCreate() {
  const [create, state] = useCreateCustomerMutation();
  const [dirty, setDirty] = useState(false);
  const [duplicates, setDuplicates] = useState('');
  const [error, setError] = useState<string | null>(null);
  const requestId = useCustomerRequest();
  const navigate = useNavigate();
  const { blocker, allowNavigation } = useClientDirtyGuard(dirty);
  async function save(draft: CustomerDraft) {
    setError(null);
    try {
      const customer = await create({ draft, requestId: requestId(draft) }).unwrap();
      allowNavigation();
      navigate(`/crm/clients/${customer.publicId}`, { replace: true });
    } catch (error) {
      setError(customerError(error));
    }
  }

  return { state, duplicates, setDuplicates, error, navigate, blocker, save, setDirty };
}
