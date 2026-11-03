import type { SewingOperationDraft } from '../../entities/sewing-composition/sewing-operation-draft';

export interface SewingLabourLine {
  key: string;
  operationId: number;
  name: string;
  quantity: number;
  /** Minutes per product: manual time when set, else the reference norm, times the quantity. */
  minutes: number | null;
  /** Seamstress pay for the line, as the sheet's «Вартість, грн»; null without a live price. */
  cost: number | null;
  manual: boolean;
  reviewed: boolean;
  comment: string;
}

interface OperationLookup {
  id: number;
  name: string;
  min: number | null;
}

/**
 * Rows of «Трудовитрати виробів». `seamstressPerMinute` is the seamstress pay of one minute
 * including assembly (the live calculation's seamstress amount divided by its minutes).
 */
export function sewingLabourLines(
  operations: readonly SewingOperationDraft[],
  lookups: readonly OperationLookup[],
  seamstressPerMinute: number | null,
): SewingLabourLine[] {
  return operations.map((operation) => {
    const lookup = lookups.find((item) => item.id === operation.operationId);
    const perUnit = operation.manualMinutes ?? lookup?.min ?? null;
    const minutes = perUnit === null ? null : perUnit * operation.quantity;
    return {
      key: operation.clientId,
      operationId: operation.operationId,
      name: lookup?.name ?? `Операція ${operation.operationId}`,
      quantity: operation.quantity,
      minutes,
      cost: minutes === null || seamstressPerMinute === null ? null : minutes * seamstressPerMinute,
      manual: operation.manualMinutes !== null,
      reviewed: operation.reviewed,
      comment: operation.comment,
    };
  });
}
