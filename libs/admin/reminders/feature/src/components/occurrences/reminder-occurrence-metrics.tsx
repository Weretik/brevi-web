import { useGetReminderOccurrencesQuery } from '@admin/reminders/data-access';
import { reminderOccurrenceState } from '@admin/reminders/model';
import { ReminderMetricStrip } from '@admin/reminders/ui';

/** Counts over all open periods (the API allows 200 per page, far above the real number). */
export function ReminderOccurrenceMetrics({ today }: { today: string }) {
  const open = useGetReminderOccurrencesQuery({ status: 'open', page: 1, pageSize: 200 });
  if (!open.currentData) return null;
  const states = open.currentData.items.map((item) => reminderOccurrenceState(item, today));
  const dueToday = open.currentData.items.filter((item) => item.dueDate === today).length;
  const overdue = states.filter((state) => state === 'overdue').length;
  return (
    <ReminderMetricStrip
      metrics={[
        { label: 'Активні', value: open.currentData.total },
        {
          label: 'Прострочені',
          value: overdue,
          ...(overdue ? { note: 'потребують уваги', tone: 'error' as const } : {}),
        },
        { label: 'Термін сьогодні', value: dueToday },
        { label: 'Перенесені', value: states.filter((state) => state === 'postponed').length },
      ]}
    />
  );
}
