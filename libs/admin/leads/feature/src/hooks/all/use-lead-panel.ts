import {
  useGetLeadQuery,
  useReleaseLeadMutation,
  useTakeLeadMutation,
} from '@admin/leads/data-access';
import { isLeadOpen } from '@admin/leads/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { LeadViewer } from '@admin/leads/model';

/** Side panel of «Усі ліди»: the lead card, «Взяти собі» and «Повернути у вільні». */
export function useLeadPanel(viewer: LeadViewer, notify: (message: string) => void) {
  const [openId, setOpenId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lead = useGetLeadQuery(openId ?? 0, { skip: openId === null });
  const [take, taking] = useTakeLeadMutation();
  const [release, releasing] = useReleaseLeadMutation();
  const detail = lead.data && lead.data.id === openId ? lead.data : undefined;

  const open = detail !== undefined && isLeadOpen(detail.stage);
  const mine = detail?.owner?.userId === viewer.userId && viewer.userId !== null;
  const canTake = viewer.canEdit && open && !detail?.owner;
  const canRelease = viewer.canEdit && open && detail?.owner !== null && (mine || viewer.isAdmin);

  async function run(action: () => Promise<unknown>, done: string, fallback: string) {
    setError(null);
    try {
      await action();
      notify(done);
    } catch (failure) {
      setError(adminApiErrorMessage(failure, fallback));
    }
  }

  return {
    openId,
    open: (id: number) => {
      setError(null);
      setOpenId(id);
    },
    close: () => setOpenId(null),
    lead: detail,
    loading: lead.isFetching && !detail,
    loadError: lead.isError ? adminApiErrorMessage(lead.error, 'Не вдалося відкрити лід.') : null,
    error,
    busy: taking.isLoading || releasing.isLoading,
    mine,
    canTake,
    canRelease,
    take: () =>
      detail &&
      run(
        () => take(detail.id).unwrap(),
        `${detail.company}: тепер у вашій черзі`,
        'Не вдалося взяти лід.',
      ),
    release: () =>
      detail &&
      run(
        () => release({ id: detail.id, version: detail.version }).unwrap(),
        `${detail.company}: повернуто у вільні`,
        'Не вдалося повернути лід.',
      ),
  };
}

export type LeadPanel = ReturnType<typeof useLeadPanel>;
