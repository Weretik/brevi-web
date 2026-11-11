import {
  FABRIC_ISSUE_LINE_NOTE_MAX_LENGTH,
  FABRIC_ISSUE_MAX_LINES,
} from '../../entities/issues/item-fabric';
import { findStockPair } from '../../queries/stock/fabric-stock-search';
import {
  noteError,
  operationDateError,
  parseStockMeters,
  positiveMetersError,
} from '../../validators/stock-operations/stock-operation-rules';

import type {
  CreateItemIssueBody,
  FabricIssuePurpose,
  FabricLayer,
  FabricPlanPart,
  ItemFabric,
} from '../../entities/issues/item-fabric';
import type { FabricStockFabric, FabricStockPair } from '../../entities/stock/fabric-stock';

/** «FAB-023|темно-сірий»: the planned part a line covers. */
export const planPartKey = (part: Pick<FabricPlanPart, 'fabricCode' | 'colorKey'>) =>
  `${part.fabricCode}|${part.colorKey}`;

export interface ItemIssueLineValues {
  key: string;
  /** The planned part the line covers; null for fabric above the plan. */
  partKey: string | null;
  /** Canonical code and colour key of a pair the stock holds. */
  fabricCode: string | null;
  colorKey: string | null;
  meters: string;
  /** Role of an additional line. */
  layer: FabricLayer | null;
  note: string;
}

export interface ItemIssueFormValues {
  issuedQuantity: string;
  issuedOn: string;
  note: string;
  lines: ItemIssueLineValues[];
}

export interface ItemIssueErrors {
  issuedQuantity?: string;
  issuedOn?: string;
  note?: string;
  lines?: string;
  line: Record<string, Partial<Record<'fabricCode' | 'colorKey' | 'meters' | 'note', string>>>;
}

let nextKey = 0;
const lineKey = () => `issue-line-${++nextKey}`;

/** A line for a part: the planned pair when the stock holds it. */
export function issueLineFor(
  part: FabricPlanPart | null,
  fabrics: readonly FabricStockFabric[],
): ItemIssueLineValues {
  const pair = part ? findStockPair(fabrics, part.fabricCode, part.colorKey) : null;
  return {
    key: lineKey(),
    partKey: part ? planPartKey(part) : null,
    fabricCode: pair?.fabric.fabricCode ?? null,
    colorKey: pair?.color.colorKey ?? null,
    meters: '',
    layer: null,
    note: '',
  };
}

/** One line per part still missing; metres are what was really cut, so they start empty. */
export function createItemIssueValues(
  card: ItemFabric,
  fabrics: readonly FabricStockFabric[],
  today: string,
): ItemIssueFormValues {
  const parts = card.plan.filter((part) => part.missing > 0);
  return {
    issuedQuantity: '',
    issuedOn: today,
    note: '',
    lines: (parts.length ? parts : [null]).map((part) => issueLineFor(part, fabrics)),
  };
}

export const issueLinePair = (
  line: Pick<ItemIssueLineValues, 'fabricCode' | 'colorKey'>,
  fabrics: readonly FabricStockFabric[],
) => findStockPair(fabrics, line.fabricCode, line.colorKey);

export const issueLinePart = (line: Pick<ItemIssueLineValues, 'partKey'>, card: ItemFabric) =>
  line.partKey === null ? null : (card.plan.find((x) => planPartKey(x) === line.partKey) ?? null);

/** What the server will call the line: the planned pair is «планова», another pair «заміна». */
export function issueLinePurpose(
  part: FabricPlanPart | null,
  pair: FabricStockPair | null,
): FabricIssuePurpose {
  if (!part) return 'Additional';
  return pair &&
    pair.fabric.codes.includes(part.fabricCode) &&
    pair.color.colorKey === part.colorKey
    ? 'Planned'
    : 'Replacement';
}

/** The plan of a part for n of N products: P × n / N in hundredths, half up, as the server counts it. */
export function comparisonPlan(planned: number, cut: number, quantity: number) {
  const hundredths = Math.round(planned * 100);
  return Math.floor((hundredths * cut * 2 + quantity) / (2 * quantity)) / 100;
}

const products = (value: string) => (/^\d+$/.test(value.trim()) ? Number(value.trim()) : null);

export function validateItemIssue(
  values: ItemIssueFormValues,
  card: ItemFabric,
  fabrics: readonly FabricStockFabric[],
): ItemIssueErrors {
  const errors: ItemIssueErrors = { line: {} };
  const cut = products(values.issuedQuantity);
  if (cut === null || cut < 1 || cut > Math.max(1, card.quantity))
    errors.issuedQuantity = `Скільки виробів розкроєно: від 1 до ${Math.max(1, card.quantity)}.`;
  const date = operationDateError(values.issuedOn);
  if (date) errors.issuedOn = date;
  const note = noteError(values.note);
  if (note) errors.note = note;
  if (values.lines.length === 0 || values.lines.length > FABRIC_ISSUE_MAX_LINES)
    errors.lines = `Додайте від 1 до ${FABRIC_ISSUE_MAX_LINES} рядків.`;
  for (const line of values.lines) {
    const own: ItemIssueErrors['line'][string] = {};
    if (!line.fabricCode) own.fabricCode = 'Оберіть тканину зі складу.';
    else if (!issueLinePair(line, fabrics)) own.colorKey = 'Оберіть колір зі складу.';
    const meters = positiveMetersError(line.meters);
    if (meters) own.meters = meters;
    if (line.note.trim().length > FABRIC_ISSUE_LINE_NOTE_MAX_LENGTH)
      own.note = `Не довше ${FABRIC_ISSUE_LINE_NOTE_MAX_LENGTH} символів.`;
    if (Object.keys(own).length) errors.line[line.key] = own;
  }
  return errors;
}

export const hasItemIssueErrors = (errors: ItemIssueErrors) =>
  Boolean(
    errors.issuedQuantity ||
    errors.issuedOn ||
    errors.note ||
    errors.lines ||
    Object.keys(errors.line).length,
  );

const round = (value: number) => Math.round(value * 100) / 100;

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
