import { CopyRolePanel, NewRolePanel, RenameRolePanel } from '@admin/users/ui';

import type { useAccessRightsActions } from '../hooks/access/use-access-rights-actions';
import type { useAccessRoleDraft } from '../hooks/access/use-access-role-draft';
import type { AccessRole } from '@admin/users/model';

/** Which side panel of «Права доступу» is open. */
export type AccessPanel = 'create' | 'rename' | 'copy' | null;

interface Props {
  panel: AccessPanel;
  roles: readonly AccessRole[];
  actions: ReturnType<typeof useAccessRightsActions>;
  draft: ReturnType<typeof useAccessRoleDraft>;
  onClose: () => void;
  onCreate: (title: string) => Promise<boolean>;
}

/** «Нова роль», «Перейменувати» and «Копіювати з ролі…», each in the side panel. */
export function AccessRightsPanels({ actions, draft, onClose, onCreate, panel, roles }: Props) {
  const role = draft.selectedRole;
  return (
    <>
      <NewRolePanel
        error={actions.createError}
        onClose={onClose}
        onSubmit={onCreate}
        open={panel === 'create'}
        submitting={actions.creating}
      />
      <RenameRolePanel
        currentTitle={panel === 'rename' && role ? role.title : null}
        error={actions.renameError}
        onClose={onClose}
        onSubmit={(title) => (role ? actions.rename(role, title) : Promise.resolve(false))}
        submitting={actions.renaming}
      />
      <CopyRolePanel
        onClose={onClose}
        onCopy={draft.copyFrom}
        open={panel === 'copy'}
        sources={roles.filter((item) => !item.locked && item.name !== role?.name)}
        targetTitle={role?.title ?? ''}
      />
    </>
  );
}
