/** `2026-11-09` → `09.11.2026`. Returns the input unchanged when it is not an ISO date. */
export function formatReminderDate(value: string | null | undefined): string {
  if (!value) return '—';
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : value;
}

const kyivDateTime = new Intl.DateTimeFormat('uk-UA', {
  timeZone: 'Europe/Kyiv',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/** ISO date-time → `09.11.2026, 09:14` in Kyiv time. */
export function formatReminderDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : kyivDateTime.format(date);
}

const kyivDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Europe/Kyiv',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Today's date in Kyiv as `yyyy-MM-dd`, the calendar the backend uses. */
export function kyivToday(now: Date = new Date()): string {
  return kyivDate.format(now);
}
