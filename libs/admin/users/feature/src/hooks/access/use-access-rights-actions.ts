import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useRenameRoleMutation,
  useSaveRoleAccessMutation,
} from '@admin/users/data-access';
import { useState } from 'react';

import { getAccessErrorMessage } from '../../errors/access-error-message';

import type { AccessErrorMessage } from '../../errors/access-error-message';
import type { AccessGrants, AccessRole } from '@admin/users/model';

interface AccessRightsActionsOptions {
  /** Re-reads the session, so the signed-in user's menu follows the new rights. */
  onAccessChanged: () => Promise<void>;
  onSuccess: (message: string) => void;
}

/** Mutations of «Права доступу»; each place shows its own error. */
export function useAccessRightsActions({ onAccessChanged, onSuccess }: AccessRightsActionsOptions) {
  const [saveRoleAccess, saveState] = useSaveRoleAccessMutation();
  const [createRole, createState] = useCreateRoleMutation();
  const [deleteRole, deleteState] = useDeleteRoleMutation();
  const [renameRole, renameState] = useRenameRoleMutation();

  const [saveError, setSaveError] = useState<AccessErrorMessage | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [renameError, setRenameError] = useState<string | null>(null);

  const refreshSession = () => {
    onAccessChanged().catch(() => {
      // The menu catches up on the next session check; the change itself is saved.
    });
  };

  const save = async (role: AccessRole, grants: AccessGrants): Promise<boolean> => {
    setSaveError(null);
    try {
      await saveRoleAccess({ role: role.name, version: role.version, grants }).unwrap();
      onSuccess(`Права ролі «${role.title}» збережено.`);
      refreshSession();
      return true;
    } catch (error) {
      setSaveError(getAccessErrorMessage(error, 'save'));
      return false;
    }
  };

  /** Resolves the new role name, or null when it was not created. */
  const create = async (title: string): Promise<string | null> => {
    setCreateError(null);
    try {
      const created = await createRole(title).unwrap();
      onSuccess(`Роль «${created.title}» створено. Позначте, що вона бачить.`);
      refreshSession();
      return created.name;
    } catch (error) {
      setCreateError(getAccessErrorMessage(error, 'create').message);
      return null;
    }
  };

  const rename = async (role: AccessRole, title: string): Promise<boolean> => {
    setRenameError(null);
    try {
      const renamed = await renameRole({ role: role.name, title }).unwrap();
      onSuccess(`Роль перейменовано на «${renamed.title}».`);
      refreshSession();
      return true;
    } catch (error) {
      setRenameError(getAccessErrorMessage(error, 'rename').message);
      return false;
    }
  };

  const remove = async (role: AccessRole): Promise<boolean> => {
    setDeleteError(null);
    try {
      await deleteRole(role.name).unwrap();
      onSuccess(`Роль «${role.title}» видалено.`);
      refreshSession();
      return true;
    } catch (error) {
      setDeleteError(getAccessErrorMessage(error, 'delete').message);
      return false;
    }
  };

  return {
    clearCreateError: () => setCreateError(null),
    clearDeleteError: () => setDeleteError(null),
    clearRenameError: () => setRenameError(null),
    clearSaveError: () => setSaveError(null),
    create,
    createError,
    creating: createState.isLoading,
    deleteError,
    deleting: deleteState.isLoading,
    remove,
    rename,
    renameError,
    renaming: renameState.isLoading,
    save,
    saveError,
    saving: saveState.isLoading,
  };
}
