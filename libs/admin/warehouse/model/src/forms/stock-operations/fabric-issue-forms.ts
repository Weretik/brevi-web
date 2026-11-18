import { Errors, compact, optional } from './stock-operation-forms';
import {
  adjustmentTargetError,
  formTextError,
  noteError,
  operationDateError,
  parseStockMeters,
  positiveMetersError,
  stockReasonError,
} from '../../validators/stock-operation-rules';

import type {
  AdjustFabricStockBody,
  IssueFabricBody,
} from '../../entities/operations/stock-operation';
import type { FabricStockPair } from '../../entities/stock/fabric-stock';

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
