import {
  useGetCustomerQuery,
  useListCustomersQuery,
  useMergeCustomersMutation,
} from '@admin/clients/data-access';
import { useEffect, useState } from 'react';

import { customerError } from '../../errors/customer-error';
import { useCustomerRequest } from '../requests/use-customer-request';

import type { CustomerDetail } from '@admin/clients/model';

export function useCustomerMerge({
  customer,
  onClose,
  onDirty,
}: {
  customer: CustomerDetail;
  onClose: () => void;
  onDirty: (dirty: boolean) => void;
}) {
  const [term, setTerm] = useState('');
  const [search, setSearch] = useState('');
  const [victimId, setVictimId] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const list = useListCustomersQuery({ page: 1, pageSize: 25, search }, { skip: !search });
  const victim = useGetCustomerQuery(victimId, { skip: !victimId });
  const [merge, state] = useMergeCustomersMutation();
  const requestId = useCustomerRequest();
  useEffect(() => {
    onDirty(!!reason || !!victimId);
    return () => onDirty(false);
  }, [reason, victimId, onDirty]);
  async function submit() {
    if (!victim.currentData || !reason.trim()) return;
    const intent = {
      customerId: customer.publicId,
      victimId,
      revision: customer.revision,
      victimRevision: victim.currentData.revision,
      reason,
    };
    try {
      await merge({ ...intent, requestId: requestId(intent) }).unwrap();
      onClose();
    } catch (error) {
      setError(customerError(error));
    }
  }

  return {
    term,
    setTerm,
    search,
    setSearch,
    victimId,
    setVictimId,
    reason,
    setReason,
    error,
    list,
    victim,
    state,
    submit,
  };
}
