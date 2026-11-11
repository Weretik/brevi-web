import { siteRequestScopes } from '@admin/leads/model';
import { SiteRequestsTable } from '@admin/leads/ui';
import { ReferenceFilterChip, ReferenceFilterRow, ReferencePageHeader } from '@admin/references/ui';
import { Alert, Button } from '@mui/material';

import { LeadNotice } from '../../components/notice/lead-notice';
import { SiteRequestDrawer } from '../../components/site-requests/site-request-drawer';
import { useLeadNotice } from '../../hooks/notice/use-lead-notice';
import { useSiteRequests } from '../../hooks/site-requests/use-site-requests';

import type { SiteRequestViewer } from '@admin/leads/model';

/**
 * «Менеджер сервісу › Заявки з сайту» (LEAD-002): what visitors sent from the form «Заявка» on the site. The bot
 * also posts each request to the Telegram groups ticked on «Нагадування».
 */
export default function SiteRequestsPage({ viewer }: { viewer: SiteRequestViewer }) {
  const notice = useLeadNotice();
  const list = useSiteRequests(viewer, notice.notify);
  const page = list.page;

  return (
    <>
      <ReferencePageHeader
        overline="Менеджер сервісу · сайт"
        title="Заявки з сайту"
        subtitle="Візьміть нову заявку собі, зателефонуйте і закрийте її"
        actions={null}
      />
      <ReferenceFilterRow
        filters={siteRequestScopes.map((item) => (
          <ReferenceFilterChip
            key={item.scope}
            label={item.label}
            count={page ? item.count(page.counts) : undefined}
            selected={list.scope === item.scope}
            onClick={() => list.setScope(item.scope)}
          />
        ))}
        count={page?.total ?? 0}
        total={page?.total ?? 0}
        countLabel="Кількість заявок"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
      {list.error && (
        <Alert
          severity="error"
          sx={{ mb: 1.5 }}
          action={
            <Button color="inherit" onClick={list.retry}>
              Повторити
            </Button>
          }
        >
          {list.error}
        </Alert>
      )}
      <SiteRequestsTable
        rows={page?.items ?? []}
        rowCount={page?.total ?? 0}
        loading={list.loading}
        narrowed={list.scope !== 'All'}
        paginationModel={list.pagination}
        onPaginationModelChange={list.setPagination}
        onOpen={list.panel.open}
      />
      <SiteRequestDrawer panel={list.panel} />
      <LeadNotice message={notice.message} onClose={notice.close} />
    </>
  );
}
