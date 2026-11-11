import {
  adjustmentTargetError,
  formTextError,
  noteError,
  operationDateError,
  parseStockMeters,
  positiveMetersError,
  stockReasonError,
} from '../../validators/stock-operations/stock-operation-rules';

import type {
  AdjustFabricStockBody,
  IssueFabricBody,
  OpenFabricStockBody,
  ReceiveFabricBody,
} from '../../entities/operations/stock-operation';
import type { FabricStockPair } from '../../entities/stock/fabric-stock';

type Errors<T> = Partial<Record<keyof T, string>>;

const optional = (value: string) => value.trim() || null;
const compact = <T extends object>(errors: Errors<T>) =>
  Object.fromEntries(Object.entries(errors).filter(([, value]) => value)) as Errors<T>;

export const hasStockFormErrors = (errors: object) => Object.keys(errors).length > 0;

// «Початковий залишок»

export interface FabricOpeningFormValues {
  fabricId: number | null;
  color: string;
  meters: string;
  operationDate: string;
}
export type FabricOpeningErrors = Errors<FabricOpeningFormValues>;

export const createFabricOpeningValues = (today: string): FabricOpeningFormValues => ({
  fabricId: null,
  color: '',
  meters: '',
  operationDate: today,
});

export function validateFabricOpening(values: FabricOpeningFormValues): FabricOpeningErrors {
  const meters = parseStockMeters(values.meters);
  return compact<FabricOpeningFormValues>({
    fabricId: values.fabricId === null ? 'Оберіть тканину.' : undefined,
    color: values.color.trim() ? undefined : 'Оберіть колір.',
    meters:
      meters === null || meters < 0 ? 'Метри — число від 0, до двох знаків після коми.' : undefined,
    operationDate: operationDateError(values.operationDate),
  });
}

export const fabricOpeningBody = (
  values: FabricOpeningFormValues,
  operationId: string,
): OpenFabricStockBody => ({
  operationId,
  fabricId: values.fabricId ?? 0,
  color: values.color.trim(),
  meters: parseStockMeters(values.meters) ?? 0,
  operationDate: values.operationDate,
});

// «Прихід»

export interface FabricReceiptFormValues {
  fabricId: number | null;
  color: string;
  meters: string;
  operationDate: string;
  supplierName: string;
  document: string;
  note: string;
}
export type FabricReceiptErrors = Errors<FabricReceiptFormValues>;

export const createFabricReceiptValues = (today: string): FabricReceiptFormValues => ({
  fabricId: null,
  color: '',
  meters: '',
  operationDate: today,
  supplierName: '',
  document: '',
  note: '',
});

/** After a saved receipt the next one keeps the fabric, colour, date and supplier. */
export const nextFabricReceiptValues = (
  values: FabricReceiptFormValues,
): FabricReceiptFormValues => ({ ...values, meters: '', document: '' });

export function validateFabricReceipt(values: FabricReceiptFormValues): FabricReceiptErrors {
  return compact<FabricReceiptFormValues>({
    fabricId: values.fabricId === null ? 'Оберіть тканину.' : undefined,
    color: values.color.trim() ? undefined : 'Оберіть колір.',
    meters: positiveMetersError(values.meters),
    operationDate: operationDateError(values.operationDate),
    supplierName: formTextError(values.supplierName),
    document: formTextError(values.document),
    note: noteError(values.note),
  });
}

export const fabricReceiptBody = (
  values: FabricReceiptFormValues,
  operationId: string,
): ReceiveFabricBody => ({
  operationId,
  fabricId: values.fabricId ?? 0,
  color: values.color.trim(),
  meters: parseStockMeters(values.meters) ?? 0,
  operationDate: values.operationDate,
  supplierName: optional(values.supplierName),
  document: optional(values.document),
  note: optional(values.note),
});

// «Разова витрата / без замовлення»

export interface FabricIssueFormValues {
  /** Canonical code of a fabric the stock holds. */
  fabricCode: string | null;
  colorKey: string | null;
  meters: string;
  operationDate: string;
  destination: string;
  note: string;
}
export type FabricIssueErrors = Errors<FabricIssueFormValues>;

export const createFabricIssueValues = (today: string): FabricIssueFormValues => ({
  fabricCode: null,
  colorKey: null,
  meters: '',
  operationDate: today,
  destination: '',
  note: '',
});

export function validateFabricIssue(
  values: FabricIssueFormValues,
  pair: FabricStockPair | null,
): FabricIssueErrors {
  return compact<FabricIssueFormValues>({
    fabricCode: values.fabricCode ? undefined : 'Оберіть тканину зі складу.',
    colorKey: values.fabricCode && !pair ? 'Оберіть колір зі складу.' : undefined,
    meters: positiveMetersError(values.meters),
    operationDate: operationDateError(values.operationDate),
    destination: formTextError(values.destination),
    note: noteError(values.note),
  });
}

/** The balance the pair would show after this issue; may be below zero. */
export function balanceAfterIssue(values: FabricIssueFormValues, pair: FabricStockPair | null) {
  const meters = parseStockMeters(values.meters);
  if (!pair || meters === null || meters <= 0) return null;
  return Math.round((pair.color.meters - meters) * 100) / 100;
}

export const fabricIssueBody = (
  values: FabricIssueFormValues,
  pair: FabricStockPair,
  operationId: string,
): IssueFabricBody => ({
  operationId,
  fabricCode: pair.fabric.fabricCode,
  color: pair.color.color,
  expectedVersion: pair.color.version,
  meters: parseStockMeters(values.meters) ?? 0,
  operationDate: values.operationDate,
  destination: optional(values.destination),
  note: optional(values.note),
});

// «Уточнити»

export interface FabricAdjustmentFormValues {
  targetMeters: string;
  operationDate: string;
  reason: string;
}
export type FabricAdjustmentErrors = Errors<FabricAdjustmentFormValues>;

export const createFabricAdjustmentValues = (
  today: string,
  current: number,
): FabricAdjustmentFormValues => ({
  targetMeters: String(current).replace('.', ','),
  operationDate: today,
  reason: '',
});

export function validateFabricAdjustment(
  values: FabricAdjustmentFormValues,
  current: number,
): FabricAdjustmentErrors {
  return compact<FabricAdjustmentFormValues>({
    targetMeters: adjustmentTargetError(values.targetMeters, current),
    operationDate: operationDateError(values.operationDate),
    reason: stockReasonError(values.reason),
  });
}

/** The change «Уточнити» will record: 15,00 → 12,25 is −2,75. */
export function adjustmentDelta(values: FabricAdjustmentFormValues, current: number) {
  const target = parseStockMeters(values.targetMeters);
  return target === null ? null : Math.round((target - current) * 100) / 100;
}

export const fabricAdjustmentBody = (
  values: FabricAdjustmentFormValues,
  pair: FabricStockPair,
  operationId: string,
): AdjustFabricStockBody => ({
  operationId,
  fabricCode: pair.fabric.fabricCode,
  color: pair.color.color,
  expectedVersion: pair.color.version,
  targetMeters: parseStockMeters(values.targetMeters) ?? 0,
  operationDate: values.operationDate,
  reason: values.reason.trim(),
});
