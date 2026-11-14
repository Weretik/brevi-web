/** «Графік роботи» (the old Google sheet, 2017–2026) or the old requests of the «Цех». */
export type WorkshopArchiveKind = 'Schedule' | 'Request';

export const workshopArchiveKindLabels: Record<WorkshopArchiveKind, string> = {
  Schedule: 'Графік роботи 2017–2026',
  Request: 'Старі заявки',
};

/** A read-only line of «Архів цеху». */
export interface WorkshopArchiveRow {
  id: number;
  sourceRow: number;
  /** yyyy-mm-dd; null when the old book had no readable date. */
  date: string | null;
  /** The date as written when it is not a date. */
  dateText: string | null;
  number: string | null;
  client: string | null;
  product: string | null;
  /** Free text such as «10+4». */
  quantity: string | null;
  fabric: string | null;
  status: string | null;
  notes: string | null;
  fields: { label: string; value: string }[];
  links: { label: string; url: string }[];
}

export interface WorkshopArchivePage {
  kind: WorkshopArchiveKind;
  page: number;
  pageSize: number;
  total: number;
  items: WorkshopArchiveRow[];
}

export interface WorkshopArchiveQuery {
  kind: WorkshopArchiveKind;
  search?: string;
  from?: string;
  to?: string;
  page: number;
  pageSize: number;
}

/** A line of workshop-archive.json; the server checks the values. */
export interface WorkshopArchiveImportRow {
  kind: WorkshopArchiveKind;
  sourceKey: string;
  sourceRow: number;
  date: string | null;
  dateText: string | null;
  number: string | null;
  client: string | null;
  product: string | null;
  quantity: string | null;
  fabric: string | null;
  status: string | null;
  notes: string | null;
  fields: { label: string; value: string }[];
  links: { label: string; url: string }[];
}
