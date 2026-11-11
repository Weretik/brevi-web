import { useChangeSiteRequestMutation, useListSiteRequestsQuery } from '@admin/leads/data-access';
import { siteRequestActions } from '@admin/leads/model';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { useState } from 'react';

import type { SiteRequestAction, SiteRequestScope, SiteRequestViewer } from '@admin/leads/model';
import type { GridPaginationModel } from '@mui/x-data-grid';

const done: Record<SiteRequestAction, string> = {
  Take: 'Заявка тепер ваша',
  Done: 'Заявку закрито',
  Spam: 'Позначено «Не заявка»',
  Reopen: 'Заявка знову нова',
};

/** «Заявки з сайту» (LEAD-002): the tab, the server page and the side panel of one request. */
export function useSiteRequests(viewer: SiteRequestViewer, notify: (message: string) => void) {
  const [scope, setScopeValue] = useState<SiteRequestScope>('Open');
  const [pagination, setPagination] = useState<GridPaginationModel>({ page: 0, pageSize: 50 });
  const [openId, setOpenId] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const query = useListSiteRequestsQuery({
    scope,
    page: pagination.page + 1,
    pageSize: pagination.pageSize,
  });
  const [change, changing] = useChangeSiteRequestMutation();
  const request = query.data?.items.find((item) => item.id === openId) ?? null;

  return {
    scope,
    setScope: (value: SiteRequestScope) => {
      setScopeValue(value);
      setPagination((current) => ({ ...current, page: 0 }));
    },
    pagination,
    setPagination,
    page: query.data,
    loading: query.isFetching,
    error: query.isError
      ? adminApiErrorMessage(query.error, 'Не вдалося завантажити заявки.')
      : null,
    retry: () => void query.refetch(),
    panel: {
      request,
      actions: request ? siteRequestActions(request, viewer) : [],
      note,
      setNote,
      error,
      busy: changing.isLoading,
      open: (id: number) => {
        setError(null);
        setNote('');
        setOpenId(id);
      },
      close: () => setOpenId(null),
      run: async (action: SiteRequestAction) => {
        if (!request) return;
        setError(null);
        try {
          await change({
            id: request.id,
            action,
            version: request.version,
            note: action === 'Done' || action === 'Spam' ? note : null,
          }).unwrap();
          notify(done[action]);
          if (action !== 'Take') setOpenId(null);
        } catch (failure) {
          setError(adminApiErrorMessage(failure, 'Не вдалося змінити заявку.'));
        }
      },
    },
  };
}

export type SiteRequestPanel = ReturnType<typeof useSiteRequests>['panel'];
