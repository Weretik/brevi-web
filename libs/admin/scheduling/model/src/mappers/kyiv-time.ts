const zone = 'Europe/Kyiv';

const display = new Intl.DateTimeFormat('uk-UA', {
  timeZone: zone,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const parts = new Intl.DateTimeFormat('en-CA', {
  timeZone: zone,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** «16.11.2026, 09:00» in Kyiv time; «—» when there is no time. */
export function formatKyivDateTime(value: string | null): string {
  return value ? display.format(new Date(value)) : '—';
}

/** Kyiv wall time of an instant as `YYYY-MM-DDTHH:mm`, the value of a datetime-local field. */
export function toKyivInput(value: string | null): string {
  if (!value) return '';
  const found = Object.fromEntries(
    parts.formatToParts(new Date(value)).map((part) => [part.type, part.value]),
  );
  return `${found['year']}-${found['month']}-${found['day']}T${found['hour']}:${found['minute']}`;
}

const offsetAt = (instant: number) => {
  const local = toKyivInput(new Date(instant).toISOString());
  return Date.parse(`${local}:00Z`) - instant;
};

/** The instant (ISO, UTC) of a Kyiv wall time `YYYY-MM-DDTHH:mm`; null when the text is not one. */
export function fromKyivInput(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return null;
  const wall = Date.parse(`${value}:00Z`);
  if (Number.isNaN(wall)) return null;
  const first = wall - offsetAt(wall);
  return new Date(wall - offsetAt(first)).toISOString();
}
