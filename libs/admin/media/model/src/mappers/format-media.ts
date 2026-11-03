const sizeFormat = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 1 });
const dateFormat = new Intl.DateTimeFormat('uk-UA', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatMediaFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${sizeFormat.format(bytes / 1024)} КБ`;
  return `${sizeFormat.format(bytes / (1024 * 1024))} МБ`;
}

export function formatMediaDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : dateFormat.format(date);
}

export function formatMediaDimensions(width: number | null, height: number | null): string | null {
  return width && height ? `${width} × ${height}` : null;
}

/** «1 фото», «3 фото» — the word does not change; kept here so wording stays in one place. */
export function formatMediaCount(count: number): string {
  return `${count} фото`;
}
