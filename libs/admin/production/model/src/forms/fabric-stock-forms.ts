import {
  FABRIC_ISSUE_MAX_LINES,
  FABRIC_STOCK_COLOR_MAX_LENGTH,
  FABRIC_STOCK_DOCUMENT_MAX_LENGTH,
  FABRIC_STOCK_MAX_METERS,
  FABRIC_STOCK_NOTE_MAX_LENGTH,
} from '../entities/fabric-stock';

import type {
  CorrectFabricStockBody,
  CreateFabricIssueBody,
  CreateFabricMovementBody,
  FabricIssuePurpose,
  FabricStockRow,
  ProductionItemFabric,
} from '../entities/fabric-stock';

/** The server's colour key: case and extra spaces do not matter. */
export const stockColorKey = (color: string) => color.trim().split(/\s+/).join(' ').toLowerCase();

const isDay = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

/** «12,5» or «12.5» as metres with at most two decimals; null when it is not such a number. */
export function parseStockMeters(value: string): number | null {
  const text = value.trim().replace(',', '.');
  if (!/^-?\d+(\.\d{1,2})?$/.test(text)) return null;
  const meters = Number(text);
  return Math.abs(meters) <= FABRIC_STOCK_MAX_METERS ? meters : null;
}

const noteError = (note: string, required: boolean) => {
  const value = note.trim();
  if (required && !value) return 'Вкажіть причину.';
  return value.length > FABRIC_STOCK_NOTE_MAX_LENGTH
    ? `Не довше ${FABRIC_STOCK_NOTE_MAX_LENGTH} символів.`
    : undefined;
};

export interface FabricReceiptFormValues {
  kind: 'Opening' | 'Receipt';
  fabricId: number | null;
  color: string;
  meters: string;
  operationDate: string;
  supplierId: number | null;
  document: string;
  note: string;
}

export type FabricReceiptErrors = Partial<Record<keyof FabricReceiptFormValues, string>>;

/** A receipt of today; from a line card the fabric and colour are already chosen. */
export const createFabricReceiptValues = (
  today: string,
  line: Pick<FabricStockRow, 'fabricId' | 'color'> | null,
): FabricReceiptFormValues => ({
  kind: 'Receipt',
  fabricId: line?.fabricId ?? null,
  color: line?.color ?? '',
  meters: '',
  operationDate: today,
  supplierId: null,
  document: '',
  note: '',
});

export function validateFabricReceipt(values: FabricReceiptFormValues): FabricReceiptErrors {
  const errors: FabricReceiptErrors = {};
  if (values.fabricId === null) errors.fabricId = 'Оберіть тканину.';
  if (!values.color.trim()) errors.color = 'Вкажіть колір.';
  else if (values.color.trim().length > FABRIC_STOCK_COLOR_MAX_LENGTH)
    errors.color = `Не довше ${FABRIC_STOCK_COLOR_MAX_LENGTH} символів.`;
  const meters = parseStockMeters(values.meters);
  if (meters === null || meters <= 0) errors.meters = 'Метри — число більше нуля, до двох знаків.';
  if (!isDay(values.operationDate)) errors.operationDate = 'Вкажіть дату.';
  if (values.document.trim().length > FABRIC_STOCK_DOCUMENT_MAX_LENGTH)
    errors.document = `Не довше ${FABRIC_STOCK_DOCUMENT_MAX_LENGTH} символів.`;
  const note = noteError(values.note, false);
  if (note) errors.note = note;
  return errors;
}

export const fabricReceiptBody = (
  values: FabricReceiptFormValues,
  version: number | null,
): CreateFabricMovementBody => ({
  kind: values.kind,
  fabricId: values.fabricId ?? 0,
  color: values.color.trim(),
  meters: parseStockMeters(values.meters) ?? 0,
  operationDate: values.operationDate,
  supplierId: values.kind === 'Receipt' ? values.supplierId : null,
  document: values.document.trim() || null,
  note: values.note.trim() || null,
  version,
});

export interface FabricCorrectionFormValues {
  countedMeters: string;
  operationDate: string;
  note: string;
}

export type FabricCorrectionErrors = Partial<Record<keyof FabricCorrectionFormValues, string>>;

export const createFabricCorrectionValues = (
  meters: number,
  today: string,
): FabricCorrectionFormValues => ({
  countedMeters: String(meters).replace('.', ','),
  operationDate: today,
  note: '',
});

export function validateFabricCorrection(
  values: FabricCorrectionFormValues,
  meters: number,
): FabricCorrectionErrors {
  const errors: FabricCorrectionErrors = {};
  const counted = parseStockMeters(values.countedMeters);
  if (counted === null || counted < 0) errors.countedMeters = 'Число від 0, до двох знаків.';
  else if (counted === meters) errors.countedMeters = 'Пораховано стільки ж, скільки на складі.';
  if (!isDay(values.operationDate)) errors.operationDate = 'Вкажіть дату.';
  const note = noteError(values.note, true);
  if (note) errors.note = note;
  return errors;
}

export const fabricCorrectionBody = (
  values: FabricCorrectionFormValues,
  version: number,
): CorrectFabricStockBody => ({
  version,
  countedMeters: parseStockMeters(values.countedMeters) ?? 0,
  operationDate: values.operationDate,
  note: values.note.trim(),
});

/** «Сторно» of a movement or of an issue needs a reason. */
export const validateStockReason = (reason: string) => noteError(reason, true) ?? null;

export interface FabricIssueLineValues {
  key: string;
  purpose: FabricIssuePurpose;
  planColorKey: string | null;
  fabricId: number | null;
  color: string;
  meters: string;
}

export interface FabricIssueFormValues {
  issuedOn: string;
  note: string;
  lines: FabricIssueLineValues[];
}

export interface FabricIssueErrors {
  issuedOn?: string;
  note?: string;
  lines?: string;
  line: Record<string, Partial<Record<'planColorKey' | 'fabricId' | 'color' | 'meters', string>>>;
}

let nextKey = 0;
const key = () => `line-${++nextKey}`;

/** An empty extra line of the item's fabric. */
export const emptyIssueLine = (fabricId: number | null): FabricIssueLineValues => ({
  key: key(),
  purpose: 'Additional',
  planColorKey: null,
  fabricId,
  color: '',
  meters: '',
});

/**
 * A planned line for every part still reserved, with its remaining metres, so issuing exactly the
 * plan is one press; an item without a plan starts with one extra line.
 */
export function createFabricIssueValues(
  fabric: ProductionItemFabric,
  fabricId: number | null,
  today: string,
): FabricIssueFormValues {
  const lines = fabric.plan
    .filter((part) => part.reserved > 0)
    .map<FabricIssueLineValues>((part) => ({
      key: key(),
      purpose: 'Planned',
      planColorKey: part.colorKey,
      fabricId,
      color: part.color,
      meters: String(part.reserved).replace('.', ','),
    }));
  return { issuedOn: today, note: '', lines: lines.length ? lines : [emptyIssueLine(fabricId)] };
}

export function validateFabricIssue(
  values: FabricIssueFormValues,
  fabric: ProductionItemFabric,
  fabricCodeOf: (fabricId: number | null) => string | null,
): FabricIssueErrors {
  const errors: FabricIssueErrors = { line: {} };
  if (!isDay(values.issuedOn)) errors.issuedOn = 'Вкажіть дату видачі.';
  const note = noteError(values.note, false);
  if (note) errors.note = note;
  if (values.lines.length === 0 || values.lines.length > FABRIC_ISSUE_MAX_LINES)
    errors.lines = `Додайте від 1 до ${FABRIC_ISSUE_MAX_LINES} рядків.`;
  for (const line of values.lines) {
    const own: FabricIssueErrors['line'][string] = {};
    const part = fabric.plan.find((x) => x.colorKey === line.planColorKey);
    if (line.purpose !== 'Additional' && !part) own.planColorKey = 'Оберіть плановий колір.';
    if (line.fabricId === null) own.fabricId = 'Оберіть тканину.';
    if (!line.color.trim()) own.color = 'Вкажіть колір.';
    else if (line.color.trim().length > FABRIC_STOCK_COLOR_MAX_LENGTH)
      own.color = `Не довше ${FABRIC_STOCK_COLOR_MAX_LENGTH} символів.`;
    if (
      line.purpose === 'Planned' &&
      part &&
      (fabricCodeOf(line.fabricId) !== part.fabricCode ||
        stockColorKey(line.color) !== part.colorKey)
    )
      own.color = 'Планова — це планова тканина й колір. Для іншої оберіть «Заміна».';
    const meters = parseStockMeters(line.meters);
    if (meters === null || meters <= 0) own.meters = 'Більше нуля, до двох знаків.';
    if (Object.keys(own).length) errors.line[line.key] = own;
  }
  return errors;
}

export const hasFabricIssueErrors = (errors: FabricIssueErrors) =>
  Boolean(errors.issuedOn || errors.note || errors.lines || Object.keys(errors.line).length);

export const fabricIssueBody = (
  values: FabricIssueFormValues,
  orderVersion: number,
): CreateFabricIssueBody => ({
  orderVersion,
  issuedOn: values.issuedOn,
  note: values.note.trim() || null,
  lines: values.lines.map((line) => ({
    purpose: line.purpose,
    planColorKey: line.purpose === 'Additional' ? null : line.planColorKey,
    fabricId: line.fabricId ?? 0,
    color: line.color.trim(),
    meters: parseStockMeters(line.meters) ?? 0,
  })),
});
