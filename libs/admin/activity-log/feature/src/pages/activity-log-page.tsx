import { ReferenceListAlerts, ReferencePageHeader, ReferenceSearchBar } from '@admin/references/ui';
import { Box } from '@mui/material';

import { useActivityLog } from './use-activity-log';
import { ActivityEntryPanel } from '../components/activity-entry-panel';
import { ActivityFilterRow } from '../components/activity-filter-row';
import { ActivityTable } from '../components/activity-table';

/**
 * «Адміністрування › Журнал дій»: who created, changed or deleted what and when, managers by
 * default; a row opens the entry in full.
 */
export function ActivityLogPage() {
  const page = useActivityLog();
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Адміністрування"
        title="Журнал дій"
        subtitle="Хто, що і коли створив, змінив чи видалив. Нова дія з'являється тут протягом хвилини."
        actions={null}
      />
      <ReferenceSearchBar
        label="Пошук у журналі"
        placeholder="Знайти за номером, назвою об'єкта чи описом…"
        value={page.search}
        onChange={page.setSearch}
      />
      <ActivityFilterRow query={page.query} options={page.options} onChange={page.apply} />
      <ReferenceListAlerts
        error={page.error}
        loading={false}
        onRetry={() => void page.reload()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {!page.error && (
        <ActivityTable
          entries={page.entries}
          total={page.total}
          page={page.query.page}
          pageSize={page.query.pageSize}
          loading={page.loading}
          emptyText={page.emptyText}
          onPage={page.setPage}
          onOpen={page.open}
        />
      )}
      {page.openEntry && <ActivityEntryPanel entry={page.openEntry} onClose={page.close} />}
    </Box>
  );
}

export default ActivityLogPage;
