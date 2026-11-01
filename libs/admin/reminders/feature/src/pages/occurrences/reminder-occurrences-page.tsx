import { useGetReminderOccurrencesQuery } from '@admin/reminders/data-access';
import { kyivToday } from '@admin/reminders/model';
import {
  ReminderFilterChips,
  ReminderNoticeSnackbar,
  ReminderOccurrenceHistoryDialog,
  ReminderOccurrencesTable,
  RemindersLoadState,
  RemindersPageHeader,
} from '@admin/reminders/ui';
import { Box, Card, Stack } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { ReminderOccurrenceMetrics } from '../../components/occurrences/reminder-occurrence-metrics';
import { reminderError } from '../../errors/reminder-error';
import { useReminderNotice } from '../../hooks/notice/use-reminder-notice';
import { useReminderOccurrenceActions } from '../../hooks/occurrences/use-reminder-occurrence-actions';
import { readOccurrenceFilters, writeOccurrenceFilters } from '../../model/occurrence-filters';

import type { OccurrenceStatusFilter } from '../../model/occurrence-filters';

const statusOptions = [
  { value: 'open' as OccurrenceStatusFilter, label: 'Активні' },
  { value: 'done' as OccurrenceStatusFilter, label: 'Виконані' },
  { value: 'all' as OccurrenceStatusFilter, label: 'Усі' },
];

export default function ReminderOccurrencesPage() {
  const [params, setParams] = useSearchParams();
  const filters = readOccurrenceFilters(params);
  const today = kyivToday();
  const notice = useReminderNotice();
  const actions = useReminderOccurrenceActions(notice);
  const query = useGetReminderOccurrencesQuery({
    status: filters.status === 'all' ? undefined : filters.status,
    page: filters.page,
    pageSize: filters.pageSize,
  });

  return (
    <Box sx={{ p: { xs: 2, sm: 3, lg: 3.5 }, minWidth: 0 }}>
      <Stack spacing={2}>
        <RemindersPageHeader
          title="Періоди"
          subtitle="Кожен місяць, квартал або рік задачі: хто і коли закрив, що перенесли."
        />
        <ReminderOccurrenceMetrics today={today} />
        <RemindersLoadState
          loading={query.isLoading}
          error={query.error ? reminderError(query.error, 'Не вдалося завантажити періоди.') : null}
          empty={false}
          emptyText=""
          loadingLabel="Завантаження періодів"
          onRetry={() => void query.refetch()}
        />
        {query.currentData && (
          <Card variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={2}>
              <ReminderFilterChips
                label="Статус"
                options={statusOptions}
                value={filters.status}
                onChange={(status) =>
                  setParams(writeOccurrenceFilters({ ...filters, status, page: 1 }))
                }
              />
              <ReminderOccurrencesTable
                rows={query.currentData.items}
                total={query.currentData.total}
                today={today}
                loading={query.isFetching}
                busyId={actions.busyId}
                pagination={{ page: filters.page - 1, pageSize: filters.pageSize }}
                onPaginationChange={(model) =>
                  setParams(
                    writeOccurrenceFilters({
                      ...filters,
                      page: model.page + 1,
                      pageSize: model.pageSize,
                    }),
                  )
                }
                onClose={(occurrence) => void actions.closeOccurrence(occurrence)}
                onReopen={(occurrence) => void actions.reopenOccurrence(occurrence)}
                onHistory={actions.showHistory}
              />
            </Stack>
          </Card>
        )}
      </Stack>
      <ReminderOccurrenceHistoryDialog occurrence={actions.history} onClose={actions.hideHistory} />
      <ReminderNoticeSnackbar notice={notice.notice} onClose={notice.close} />
    </Box>
  );
}
