import { quoteCustomLineKindLabels } from '../models/quote-custom-sewing-draft';

import type { QuoteItemLineKind } from '../entities/quote';
import type { QuoteModelComposition } from '../entities/quote-custom-sewing';
import type { QuoteItemDraft } from '../models/quote-draft';

export type QuoteModelChangeKind = 'added' | 'removed' | 'changed';

/** One difference of a changed model from its Catalog composition. */
export interface QuoteModelChange {
  readonly kind: QuoteModelChangeKind;
  readonly name: string;
  /** «було 2 шт. → стало 3 шт.» for a changed quantity, the amount for an added or removed row. */
  readonly detail: string;
}

/** The differences of one part of the composition: fabrics, accessories, operations… */
export interface QuoteModelChangeGroup {
  readonly title: string;
  readonly changes: readonly QuoteModelChange[];
}

const amount = (value: number) =>
  new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 3 }).format(value);

const groupOrder: readonly QuoteItemLineKind[] = ['Fabric', 'Accessory', 'Operation', 'Service'];

type Row = { name: string; unit: string; quantity: number; minutes: number | null };

const lineKey = (line: { kind: QuoteItemLineKind; referenceId: number; costCode: string | null }) =>
  `${line.kind}:${line.referenceId}:${line.costCode ?? ''}`;

const quantityText = (row: Row) =>
  row.minutes !== null ? `${amount(row.minutes)} хв` : `${amount(row.quantity)} ${row.unit}`.trim();

function diff(base: ReadonlyMap<string, Row>, next: ReadonlyMap<string, Row>): QuoteModelChange[] {
  const changes: QuoteModelChange[] = [];
  for (const [key, row] of next) {
    const was = base.get(key);
    if (!was) changes.push({ kind: 'added', name: row.name, detail: quantityText(row) });
    else if (was.quantity !== row.quantity || was.minutes !== row.minutes)
      changes.push({
        kind: 'changed',
        name: row.name,
        detail: `було ${quantityText(was)} → стало ${quantityText(row)}`,
      });
  }
  for (const [key, row] of base)
    if (!next.has(key))
      changes.push({ kind: 'removed', name: row.name, detail: quantityText(row) });
  return changes;
}

/**
 * «Що змінено»: what a changed model of the КП has different from its Catalog composition — fabric variants
 * added, removed or with other metres, then accessories, extra fabrics, operations and services added, removed
 * or with another quantity. Empty groups are left out.
 */
export function quoteModelChanges(
  item: QuoteItemDraft,
  base: QuoteModelComposition,
): QuoteModelChangeGroup[] {
  const fabricsBefore = new Map<string, Row>(
    base.fabrics.map((fabric) => [
      String(fabric.fabricId),
      { name: fabric.name ?? 'Тканина', unit: 'м', quantity: fabric.meters, minutes: null },
    ]),
  );
  const fabricsNow = new Map<string, Row>();
  for (const option of item.options)
    for (const fabric of option.fabrics)
      if (!fabricsNow.has(String(fabric.fabricId)))
        fabricsNow.set(String(fabric.fabricId), {
          name: fabric.name,
          unit: 'м',
          quantity: fabric.meters,
          minutes: null,
        });

  const groups: QuoteModelChangeGroup[] = [];
  const variants = diff(fabricsBefore, fabricsNow);
  if (variants.length > 0) groups.push({ title: 'Варіанти тканини', changes: variants });

  for (const kind of groupOrder) {
    const before = new Map<string, Row>(
      base.lines
        .filter((line) => line.kind === kind)
        .map((line) => [
          lineKey(line),
          {
            name: line.name ?? 'Позиція без назви',
            unit: line.unit,
            quantity: line.quantity,
            minutes: line.manualMinutes,
          },
        ]),
    );
    const now = new Map<string, Row>(
      item.lines
        .filter((line) => line.kind === kind)
        .map((line) => [
          lineKey(line),
          {
            name: line.name,
            unit: line.unit,
            quantity: line.quantity,
            minutes: line.manualMinutes,
          },
        ]),
    );
    const changes = diff(before, now);
    if (changes.length > 0) groups.push({ title: quoteCustomLineKindLabels[kind], changes });
  }
  return groups;
}
