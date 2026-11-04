import type {
  PriceFileKind,
  PriceImportRow,
  PriceImportStatus,
  PriceSource,
  PriceSourceMethod,
} from '../../entities/price-import/price-source';

const methodLabels: Record<PriceSourceMethod, string> = {
  Website: 'Сайт постачальника',
  GoogleSheets: 'Google-таблиці',
  SupplierCabinet: 'Кабінет дилера',
  File: 'Файл',
};

export const priceSourceMethodLabel = (method: PriceSourceMethod): string => methodLabels[method];

/** What the staff member uploads: «3 XML-файли», «PDF-прайс»; null when no files. */
export function priceFileLabel(kind: PriceFileKind, count: number): string | null {
  if (kind === 'InsightYml') return `${count} XML-файли Insight`;
  if (kind === 'CemtoPdf') return 'PDF-прайс';
  return null;
}

/** Brevi reads this supplier's site, Google Sheets or cabinet itself, so «Оновити зараз» is offered. */
export const canRefreshPriceSource = (
  source: Pick<PriceSource, 'method' | 'automaticUpdateConnected'>,
): boolean => source.method !== 'File' && source.automaticUpdateConnected;

/** Accepted file types of the upload input. */
export function priceFileAccept(kind: PriceFileKind): string {
  return kind === 'CemtoPdf' ? '.pdf,application/pdf' : '.xml,text/xml,application/xml';
}

const statusLabels: Record<PriceImportStatus, string> = {
  Changed: 'Зміниться',
  Unchanged: 'Без змін',
  ManualPrice: 'Ручна ціна',
  Inactive: 'Неактивний',
  NotInFile: 'Не знайдено',
  Invalid: 'Ціну не змінено',
};

export const priceImportStatusLabel = (status: PriceImportStatus): string => statusLabels[status];

/** Rows the staff member must look at: not found or rejected. */
export const isPriceImportProblem = (row: Pick<PriceImportRow, 'status'>): boolean =>
  row.status === 'NotInFile' || row.status === 'Invalid';

/** Changed and problem rows first, then skipped, then unchanged; by code inside a group. */
export function sortPriceImportRows(rows: PriceImportRow[]): PriceImportRow[] {
  const rank = (row: PriceImportRow) =>
    row.status === 'Changed'
      ? 0
      : isPriceImportProblem(row)
        ? 1
        : row.status === 'Unchanged'
          ? 3
          : 2;
  return [...rows].sort(
    (a, b) =>
      rank(a) - rank(b) || (a.code ?? '').localeCompare(b.code ?? '', 'uk', { numeric: true }),
  );
}

const discountFormat = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

/** 22 → «22%», 0 → «без знижки». */
export function formatDiscount(percent: number): string {
  return percent === 0 ? 'без знижки' : `${discountFormat.format(percent)}%`;
}

const timeFormat = new Intl.DateTimeFormat('uk-UA', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Kyiv',
});

/** ISO time → «04.11.2026, 10:15» in Kyiv. */
export const formatImportTime = (value: string): string => timeFormat.format(new Date(value));
