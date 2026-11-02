const uahFormat = new Intl.NumberFormat('uk-UA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 147.5 → «147,50 грн». */
export function formatUah(value: number): string {
  return `${uahFormat.format(value)} грн`;
}

/** ISO date «2026-08-30» → «30.08.2026»; empty → «—». */
export function formatIsoDate(value: string | null): string {
  const match = value ? /^(\d{4})-(\d{2})-(\d{2})/.exec(value) : null;
  return match ? `${match[3]}.${match[2]}.${match[1]}` : '—';
}
