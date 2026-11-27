import { useGetCustomerQuery, useReviseCustomerMutation } from '@admin/clients/data-access';
import { useRequestId } from '@admin/shared/api-client';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { customerError } from '../../errors/customer-error';
import { useClientDirtyGuard } from '../navigation/use-client-dirty-guard';

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
  const requestId = useRequestId();
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
  /** Saves the edited client; true when the server accepted it. */
  async function save(draft: CustomerDraft): Promise<boolean> {
    if (!customer) return false;
    const intent = { customerId, revision: customer.revision, draft };
    setError(null);
    setSaved(false);
    try {
      await revise({ ...intent, requestId: requestId.forPayload(intent) }).unwrap();
      setDirty(false);
      setSaved(true);
      return true;
    } catch (error) {
      setError(customerError(error));
      return false;
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
