import { useSetWorkshopEmployeeActiveMutation } from '@admin/production/data-access';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { WorkshopEmployee } from '@admin/production/model';

/** Asks before archiving a worker or returning one, then reports the result. */
export function useWorkshopEmployeeActivation(onMessage: (message: string) => void) {
  const [pending, setPending] = useState<WorkshopEmployee | null>(null);
  const [setActive, state] = useSetWorkshopEmployeeActiveMutation();

  async function confirm() {
    if (!pending) return;
    const isActive = !pending.isActive;
    try {
      await setActive({ id: pending.id, isActive }).unwrap();
      onMessage(
        isActive ? `${pending.fullName} знову в цеху.` : `${pending.fullName} перенесено в архів.`,
      );
    } catch (error) {
      onMessage(adminApiErrorMessage(error, 'Не вдалося змінити працівника.'));
    }
    setPending(null);
  }

  return {
    pending,
    busy: state.isLoading,
    request: setPending,
    cancel: () => setPending(null),
    confirm,
  };
}
