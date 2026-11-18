import {
  ItemIssueFormValues,
  ItemIssueLineValues,
  comparisonPlan,
  issueLinePair,
  issueLinePart,
  planPartKey,
  products,
} from './item-issue-form';
import { parseStockMeters } from '../../validators/stock-operation-rules';

import type { CreateItemIssueBody, ItemFabric } from '../../entities/issues/item-fabric';
import type { FabricStockFabric } from '../../entities/stock/fabric-stock';

export const round = (value: number) => Math.round(value * 100) / 100;

export interface ItemIssuePreview {
  issuedQuantity: number;
  meters: number;
  /** Total metres per product, to three decimals. */
  perProduct: number;
  parts: {
    key: string;
    color: string;
    fabricCode: string;
    plan: number;
    actual: number;
    difference: number;
  }[];
  pairs: { key: string; fabricCode: string; color: string; before: number; after: number }[];
}

/** The check step before «Записати»: plan and fact by part and the pairs before and after. */
export function itemIssuePreview(
  values: ItemIssueFormValues,
  card: ItemFabric,
  fabrics: readonly FabricStockFabric[],
): ItemIssuePreview {
  const cut = products(values.issuedQuantity) ?? 1;
  const meters = (line: ItemIssueLineValues) => parseStockMeters(line.meters) ?? 0;
  const total = round(values.lines.reduce((sum, line) => sum + meters(line), 0));
  const parts = card.plan
    .filter((part) => values.lines.some((line) => line.partKey === planPartKey(part)))
    .map((part) => {
      const plan = comparisonPlan(part.planned, cut, Math.max(1, card.quantity));
      const actual = round(
        values.lines
          .filter((line) => line.partKey === planPartKey(part))
          .reduce((sum, line) => sum + meters(line), 0),
      );
      return {
        key: planPartKey(part),
        color: part.color,
        fabricCode: part.fabricCode,
        plan,
        actual,
        difference: round(actual - plan),
      };
    });
  const pairs = new Map<string, ItemIssuePreview['pairs'][number]>();
  for (const line of values.lines) {
    const pair = issueLinePair(line, fabrics);
    if (!pair) continue;
    const key = `${pair.fabric.fabricCode}|${pair.color.colorKey}`;
    const row = pairs.get(key) ?? {
      key,
      fabricCode: pair.fabric.fabricCode,
      color: pair.color.color,
      before: pair.color.meters,
      after: pair.color.meters,
    };
    pairs.set(key, { ...row, after: round(row.after - meters(line)) });
  }
  return {
    issuedQuantity: cut,
    meters: total,
    perProduct: Math.round((total / cut) * 1000) / 1000,
    parts,
    pairs: [...pairs.values()],
  };
}

export function itemIssueBody(
  values: ItemIssueFormValues,
  card: ItemFabric,
  fabrics: readonly FabricStockFabric[],
  operationId: string,
): CreateItemIssueBody | null {
  const lines: CreateItemIssueBody['lines'] = [];
  for (const line of values.lines) {
    const pair = issueLinePair(line, fabrics);
    if (!pair) return null;
    const part = issueLinePart(line, card);
    lines.push({
      fabricCode: pair.fabric.fabricCode,
      color: pair.color.color,
      expectedVersion: pair.color.version,
      meters: parseStockMeters(line.meters) ?? 0,
      planFabricCode: part?.fabricCode ?? null,
      planColorKey: part?.colorKey ?? null,
      layer: part ? null : line.layer,
      note: line.note.trim() || null,
    });
  }
  return {
    operationId,
    orderVersion: card.orderVersion,
    planVersion: card.planVersion,
    issuedOn: values.issuedOn,
    issuedQuantity: products(values.issuedQuantity) ?? 0,
    note: values.note.trim() || null,
    lines,
  };
}
