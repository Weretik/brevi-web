export const signed = (value: number | null, format: (x: number | null) => string) =>
  value === null ? '—' : `${value > 0 ? '+' : ''}${format(value)}`;
