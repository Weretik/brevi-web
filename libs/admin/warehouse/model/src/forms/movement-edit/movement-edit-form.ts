import { FABRIC_STOCK_REASON_MAX_LENGTH } from '../../entities/operations/stock-operation';
import { stockColorKey as colorKey } from '../../queries/stock/fabric-stock-search';
import {
  formTextError,
  operationDateError,
  parseStockMeters,
} from '../../validators/stock-operations/stock-operation-rules';

import type {
  FabricMovementKind,
  FabricMovementRow,
} from '../../entities/movements/fabric-movement';
import type { EditFabricMovementBody } from '../../entities/operations/stock-operation';
import type { FabricStockPair } from '../../entities/stock/fabric-stock';

/**
 * Edit of one movement. Receipt: another offer (fabricId, null keeps it) and colour. Issue: another held pair
 * (pairCode + pairColorKey, null keeps it). Opening and correction keep their line.
 */
export interface FabricMovementEditValues {
  operationDate: string;
  /** Without sign; a correction is signed. */
  meters: string;
  fabricId: number | null;
  color: string;
  pairCode: string | null;
  pairColorKey: string | null;
  supplierName: string;
  document: string;
  destination: string;
  reason: string;
}
export type FabricMovementEditErrors = Partial<Record<keyof FabricMovementEditValues, string>>;

const decimalText = (value: number) => String(value).replace('.', ',');
const optional = (value: string) => value.trim() || null;

export const createMovementEditValues = (row: FabricMovementRow): FabricMovementEditValues => ({
  operationDate: row.operationDate,
  meters: decimalText(row.kind === 'Adjustment' ? row.delta : Math.abs(row.delta)),
  fabricId: null,
  color: row.color,
  pairCode: null,
  pairColorKey: null,
  supplierName: row.supplierName ?? '',
  document: row.document ?? '',
  destination: row.destination ?? '',
  reason: '',
});

/** The signed change the kind allows for the amount typed, or null. */
export function movementEditDelta(kind: FabricMovementKind, meters: string): number | null {
  const value = parseStockMeters(meters);
  if (value === null) return null;
  switch (kind) {
    case 'Opening':
      return value >= 0 ? value : null;
    case 'Receipt':
      return value > 0 ? value : null;
    case 'Issue':
      return value > 0 ? -value : null;
    case 'Adjustment':
      return value !== 0 ? value : null;
    default:
      return null;
  }
}

const metersRule: Record<FabricMovementKind, string> = {
  Opening: 'Метри — число від 0, до двох знаків після коми.',
  Receipt: 'Метри — число більше нуля, до двох знаків після коми.',
  Issue: 'Метри — число більше нуля, до двох знаків після коми.',
  Adjustment: 'Зміна — число, не нуль, до двох знаків після коми (мінус — менше на складі).',
  Reversal: 'Сторно не редагують.',
};

export function validateMovementEdit(
  row: FabricMovementRow,
  values: FabricMovementEditValues,
): FabricMovementEditErrors {
  const errors: FabricMovementEditErrors = {
    meters: movementEditDelta(row.kind, values.meters) === null ? metersRule[row.kind] : undefined,
    operationDate: operationDateError(values.operationDate),
    color: row.kind === 'Receipt' && !values.color.trim() ? 'Оберіть колір.' : undefined,
    pairColorKey:
      row.kind === 'Issue' && values.pairCode !== null && values.pairColorKey === null
        ? 'Оберіть колір зі складу.'
        : undefined,
    supplierName: formTextError(values.supplierName),
    document: formTextError(values.document),
    destination: formTextError(values.destination),
    reason:
      values.reason.trim().length > FABRIC_STOCK_REASON_MAX_LENGTH
        ? `Не довше ${FABRIC_STOCK_REASON_MAX_LENGTH} символів.`
        : undefined,
  };
  if (!errors.meters && !movementEditChanged(row, values)) errors.meters = 'Нічого не змінено.';
  return Object.fromEntries(
    Object.entries(errors).filter(([, value]) => value),
  ) as FabricMovementEditErrors;
}

const receiptTargetChanged = (row: FabricMovementRow, values: FabricMovementEditValues) =>
  row.kind === 'Receipt' &&
  (values.fabricId !== null || colorKey(values.color) !== colorKey(row.color));

const issueTargetChanged = (row: FabricMovementRow, values: FabricMovementEditValues) =>
  row.kind === 'Issue' &&
  values.pairCode !== null &&
  (values.pairCode !== row.groupCode || values.pairColorKey !== colorKey(row.color));

export function movementEditChanged(row: FabricMovementRow, values: FabricMovementEditValues) {
  const receipt = row.kind === 'Receipt';
  return (
    values.operationDate !== row.operationDate ||
    movementEditDelta(row.kind, values.meters) !== row.delta ||
    receiptTargetChanged(row, values) ||
    issueTargetChanged(row, values) ||
    (receipt && optional(values.supplierName) !== row.supplierName) ||
    (receipt && optional(values.document) !== row.document) ||
    (row.kind === 'Issue' && optional(values.destination) !== row.destination)
  );
}

/**
 * What the edit does to the balance: the line keeps it (one change) or, when the target changes, the old pair
 * gets the old movement back and the new one takes the new movement.
 */
export function movementEditEffect(row: FabricMovementRow, values: FabricMovementEditValues) {
  const delta = movementEditDelta(row.kind, values.meters);
  if (delta === null) return null;
  const moves = receiptTargetChanged(row, values) || issueTargetChanged(row, values);
  return moves
    ? { moves: true as const, back: Math.round(-row.delta * 100) / 100, change: delta }
    : { moves: false as const, change: Math.round((delta - row.delta) * 100) / 100 };
}

export function movementEditBody(
  row: FabricMovementRow,
  values: FabricMovementEditValues,
  pair: FabricStockPair | null,
  operationId: string,
): EditFabricMovementBody {
  const receipt = row.kind === 'Receipt';
  const issue = row.kind === 'Issue';
  const receiptTarget = receiptTargetChanged(row, values);
  const issueTarget = issueTargetChanged(row, values) && pair !== null;
  return {
    operationId,
    expectedRevision: row.revision,
    operationDate: values.operationDate,
    meters: parseStockMeters(values.meters) ?? 0,
    fabricId: receiptTarget ? values.fabricId : null,
    fabricCode: issueTarget ? pair.fabric.fabricCode : null,
    color: receiptTarget ? values.color.trim() : issueTarget ? pair.color.color : null,
    supplierName: receipt ? optional(values.supplierName) : row.supplierName,
    document: receipt ? optional(values.document) : row.document,
    destination: issue ? optional(values.destination) : row.destination,
    reason: optional(values.reason),
  };
}
