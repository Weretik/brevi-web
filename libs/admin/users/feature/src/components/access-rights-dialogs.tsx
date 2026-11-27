import { ConfirmActionDialog } from '@admin/users/ui';
import { Alert, Snackbar } from '@mui/material';

import type { useAccessRightsActions } from '../hooks/access/use-access-rights-actions';
import type { useAccessRoleDraft } from '../hooks/access/use-access-role-draft';
import type { AccessRole } from '@admin/users/model';

interface Props {
  actions: ReturnType<typeof useAccessRightsActions>;
  role: ReturnType<typeof useAccessRoleDraft>;
  deleteTarget: AccessRole | null;
  onCancelDelete: () => void;
  onDelete: () => void;
  successMessage: string | null;
  onCloseSuccess: () => void;
}

/** «Видалити роль?», «Незбережені зміни» and the success message. */
export function AccessRightsDialogs({
  actions,
  role,
  deleteTarget,
  onCancelDelete,
  onDelete,
  successMessage,
  onCloseSuccess,
}: Props) {
  return (
    <>
      <ConfirmActionDialog
        confirmLabel="Видалити роль"
        description={`Роль «${deleteTarget?.title ?? ''}» буде видалено разом з її правами. Цю дію не можна скасувати.`}
        destructive
        error={actions.deleteError}
        onCancel={onCancelDelete}
        onConfirm={onDelete}
        open={deleteTarget !== null}
        submitting={actions.deleting}
        title="Видалити роль?"
      />
      <ConfirmActionDialog
        confirmLabel="Перейти без збереження"
        description="На цій вкладці є незбережені зміни. Якщо перейти до іншої ролі, вони зникнуть."
        destructive
        error={null}
        onCancel={role.cancelPendingTab}
        onConfirm={role.confirmPendingTab}
        open={role.pendingTab !== null}
        submitting={false}
        title="Незбережені зміни"
      />
      <Snackbar autoHideDuration={4000} onClose={onCloseSuccess} open={successMessage !== null}>
        <Alert onClose={onCloseSuccess} severity="success" variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
