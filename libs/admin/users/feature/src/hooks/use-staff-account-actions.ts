import {
  useChangeStaffRoleMutation,
  useCreateStaffAccountMutation,
  useDeleteStaffAccountMutation,
  useSetStaffBlockedMutation,
  useSetStaffPasswordMutation,
  useUpdateStaffDetailsMutation,
} from '@admin/users/data-access';
import { useState } from 'react';

import { describeConfirmation } from './staff-action-confirmation';
import { getStaffErrorMessage } from '../errors/staff-error-message';

import type { PendingConfirmation } from './staff-action-confirmation';
import type { CreateStaffAccountInput, StaffAccount, StaffDetailsInput } from '@admin/users/model';
import type { StaffAccountAction } from '@admin/users/ui';

/** Dialog state and mutations of the users page; each dialog shows its own server error. */
export function useStaffAccountActions(onSuccess: (message: string) => void) {
  const [createStaff, createState] = useCreateStaffAccountMutation();
  const [changeRole, changeRoleState] = useChangeStaffRoleMutation();
  const [setBlocked, setBlockedState] = useSetStaffBlockedMutation();
  const [setPassword, setPasswordState] = useSetStaffPasswordMutation();
  const [deleteStaff, deleteState] = useDeleteStaffAccountMutation();
  const [updateDetails, updateDetailsState] = useUpdateStaffDetailsMutation();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState<StaffAccount | null>(null);
  const [detailsTarget, setDetailsTarget] = useState<StaffAccount | null>(null);
  const [confirmation, setConfirmation] = useState<PendingConfirmation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const closeDialogs = () => {
    setIsCreateOpen(false);
    setPasswordTarget(null);
    setDetailsTarget(null);
    setConfirmation(null);
    setError(null);
  };

  const openCreate = () => {
    setError(null);
    setIsCreateOpen(true);
  };

  const startAction = (account: StaffAccount, action: StaffAccountAction) => {
    setError(null);
    if (action.type === 'setPassword') {
      setPasswordTarget(account);
    } else if (action.type === 'editDetails') {
      setDetailsTarget(account);
    } else {
      setConfirmation(describeConfirmation(account, action));
    }
  };

  const submitCreate = async (input: CreateStaffAccountInput): Promise<boolean> => {
    try {
      await createStaff(input).unwrap();
      setError(null);
      onSuccess(`Користувача ${input.email.trim()} створено.`);
      return true;
    } catch (createError) {
      setError(getStaffErrorMessage(createError));
      return false;
    }
  };

  const submitPassword = async (password: string): Promise<boolean> => {
    if (!passwordTarget) return false;

    try {
      await setPassword({ userId: passwordTarget.id, password }).unwrap();
      setError(null);
      onSuccess(`Пароль для ${passwordTarget.email} змінено.`);
      return true;
    } catch (passwordError) {
      setError(getStaffErrorMessage(passwordError));
      return false;
    }
  };

  const submitDetails = async (details: StaffDetailsInput): Promise<boolean> => {
    if (!detailsTarget) return false;

    try {
      await updateDetails({ userId: detailsTarget.id, details }).unwrap();
      setError(null);
      onSuccess('Дані користувача збережено.');
      return true;
    } catch (detailsError) {
      setError(getStaffErrorMessage(detailsError));
      return false;
    }
  };

  const confirm = async () => {
    if (!confirmation) return;
    const { account, action } = confirmation;

    try {
      if (action.type === 'changeRole') {
        await changeRole({ userId: account.id, role: action.role }).unwrap();
      } else if (action.type === 'setBlocked') {
        await setBlocked({ userId: account.id, blocked: action.blocked }).unwrap();
      } else {
        await deleteStaff(account.id).unwrap();
      }

      onSuccess(
        action.type === 'delete' ? `Користувача ${account.email} видалено.` : 'Зміни збережено.',
      );
      closeDialogs();
    } catch (actionError) {
      setError(getStaffErrorMessage(actionError));
    }
  };

  return {
    closeDialogs,
    confirm,
    confirmation,
    confirming: changeRoleState.isLoading || setBlockedState.isLoading || deleteState.isLoading,
    creating: createState.isLoading,
    detailsTarget,
    error,
    isCreateOpen,
    openCreate,
    passwordTarget,
    settingPassword: setPasswordState.isLoading,
    startAction,
    submitCreate,
    submitDetails,
    updatingDetails: updateDetailsState.isLoading,
    submitPassword,
  };
}
