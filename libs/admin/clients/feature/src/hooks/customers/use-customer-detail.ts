import { useGetCustomerQuery, useReviseCustomerMutation } from '@admin/clients/data-access';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { customerError } from '../../errors/customer-error';
import { useClientDirtyGuard } from '../navigation/use-client-dirty-guard';
import { useCustomerRequest } from '../requests/use-customer-request';

import type { CustomerContact, CustomerDraft } from '@admin/clients/model';

export function useCustomerDetail() {
  const { customerId = '' } = useParams();
  const query = useGetCustomerQuery(customerId);
  const customer = query.currentData;
  const [revise, state] = useReviseCustomerMutation();
  const [dirty, setDirty] = useState(false);
  const [contactDirty, setContactDirty] = useState(false);
  const [mergeDirty, setMergeDirty] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [reloadConfirm, setReloadConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [duplicates, setDuplicates] = useState('');
  const [contact, setContact] = useState<{ value?: CustomerContact } | null>(null);
  const [merge, setMerge] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const requestId = useCustomerRequest();
  const { blocker } = useClientDirtyGuard(dirty || contactDirty || mergeDirty);
  async function refresh() {
    setReloadConfirm(false);
    try {
      await query.refetch().unwrap();
      setEpoch((value) => value + 1);
      setDirty(false);
      setError(null);
    } catch (error) {
      setError(customerError(error));
    }
  }
  async function save(draft: CustomerDraft) {
    if (!customer) return;
    const intent = { customerId, revision: customer.revision, draft };
    setError(null);
    setSaved(false);
    try {
      await revise({ ...intent, requestId: requestId(intent) }).unwrap();
      setDirty(false);
      setSaved(true);
    } catch (error) {
      setError(customerError(error));
    }
  }
  const pending = state.isLoading || query.isFetching;

  return {
    customerId,
    query,
    customer,
    state,
    dirty,
    setDirty,
    setContactDirty,
    setMergeDirty,
    epoch,
    reloadConfirm,
    setReloadConfirm,
    error,
    duplicates,
    setDuplicates,
    contact,
    setContact,
    merge,
    setMerge,
    saved,
    setSaved,
    navigate,
    blocker,
    refresh,
    save,
    pending,
  };
}
