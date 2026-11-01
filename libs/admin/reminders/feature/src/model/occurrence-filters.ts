import type { ReminderOccurrenceStatus } from '@admin/reminders/model';

export type OccurrenceStatusFilter = ReminderOccurrenceStatus | 'all';

export const occurrencePageSizes = [25, 50, 100] as const;

export interface OccurrenceFilters {
  status: OccurrenceStatusFilter;
  page: number;
  pageSize: number;
}

/** Reads `?status=&page=&pageSize=`; anything unexpected falls back to open periods, page 1, 50 rows. */
export function readOccurrenceFilters(params: URLSearchParams): OccurrenceFilters {
  const status = params.get('status');
  const page = Number(params.get('page') ?? '1');
  const pageSize = Number(params.get('pageSize') ?? '50');
  return {
    status: status === 'done' || status === 'all' ? status : 'open',
    page: Number.isInteger(page) && page > 0 && page <= 100_000 ? page : 1,
    pageSize: (occurrencePageSizes as readonly number[]).includes(pageSize) ? pageSize : 50,
  };
}

export function writeOccurrenceFilters(filters: OccurrenceFilters): URLSearchParams {
  return new URLSearchParams({
    status: filters.status,
    page: String(filters.page),
    pageSize: String(filters.pageSize),
  });
}
