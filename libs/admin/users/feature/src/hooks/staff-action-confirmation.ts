import { staffRoleLabels } from '@admin/users/model';

import type { StaffAccount } from '@admin/users/model';
import type { StaffAccountAction } from '@admin/users/ui';

/** Text of the confirmation dialog for a role change or blocking. */
export type ConfirmableAction = Extract<StaffAccountAction, { type: 'changeRole' | 'setBlocked' }>;

export interface PendingConfirmation {
  account: StaffAccount;
  action: ConfirmableAction;
  title: string;
  description: string;
  confirmLabel: string;
  destructive: boolean;
}

export const describeConfirmation = (
  account: StaffAccount,
  action: ConfirmableAction,
): PendingConfirmation => {
  if (action.type === 'changeRole') {
    return {
      account,
      action,
      title: 'Змінити роль?',
      description: `${account.email} отримає роль «${staffRoleLabels[action.role]}». Нова роль діятиме протягом 5 хвилин.`,
      confirmLabel: 'Змінити роль',
      destructive: false,
    };
  }

  return action.blocked
    ? {
        account,
        action,
        title: 'Заблокувати користувача?',
        description: `${account.email} більше не зможе увійти, а його сесії завершаться.`,
        confirmLabel: 'Заблокувати',
        destructive: true,
      }
    : {
        account,
        action,
        title: 'Розблокувати користувача?',
        description: `${account.email} знову зможе входити до кабінету.`,
        confirmLabel: 'Розблокувати',
        destructive: false,
      };
};
