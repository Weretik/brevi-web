import type { QuoteModelComposition } from '../../../entities/items/quote-custom-sewing';
import type { QuoteTier } from '../../../entities/quote/quote';
import type {
  QuoteCustomFabricDraft,
  QuoteCustomSewingDraft,
  QuoteCustomVariantDraft,
} from '../../../forms/editor/quote-custom-sewing-draft';
import type { QuoteItemDraft } from '../../../forms/editor/quote-draft';

let sequence = 0;
export const nextKey = (prefix: string) => `custom-${prefix}-${++sequence}`;

export const tiers: readonly QuoteTier[] = ['retail', 'wholesale', 'large'];

/** «1,25» for an input; empty for null. */
export const numberText = (value: number | null): string =>
  value === null ? '' : String(value).replace('.', ',');

/** A positive quantity with up to 4 decimals («1,25», «0.375»); null otherwise. */
export function parseCustomQuantity(text: string): number | null {
  const normalized = text.replace(/\s/g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,4})?$/.test(normalized)) return null;
  const value = Number(normalized);
  return value > 0 && value <= 10_000 ? value : null;
}

export const fabricDraft = (
  fabricId: number,
  name: string,
  meters: number | null,
): QuoteCustomFabricDraft => ({
  key: nextKey('fabric'),
  fabricId,
  name,
  meters: numberText(meters),
});

/** A new variant without fabrics yet. */
export const emptyVariant = (): QuoteCustomVariantDraft => ({
  key: nextKey('option'),
  isRecommended: false,
  fabrics: [],
});

/**
 * «Змінити склад» of a Catalog model: its texts, one variant per Catalog fabric already in the КП (all active
 * variants when none matches) and its shared lines.
 */
function modelDraft(item: QuoteItemDraft, model: QuoteModelComposition): QuoteCustomSewingDraft {
  const chosen = item.options
    .map((option) => model.fabrics.find((x) => x.articleId === option.articleId))
    .filter((x) => x !== undefined);
  const fabrics = chosen.length > 0 ? chosen : model.fabrics.filter((x) => x.isActive);
  return {
    name: item.name,
    description: item.description,
    variants: fabrics
      .filter((x, index) => fabrics.findIndex((y) => y.fabricId === x.fabricId) === index)
      .map((x) => ({
        key: nextKey('option'),
        isRecommended: item.options.some((o) => o.articleId === x.articleId && o.isRecommended),
        fabrics: [fabricDraft(x.fabricId, x.name ?? 'Тканина', x.meters)],
      })),
    lines: model.lines.map((line) => ({
      key: nextKey('line'),
      kind: line.kind,
      referenceId: line.referenceId,
      name: line.name ?? (line.kind === 'Operation' ? 'Операція' : 'Матеріал'),
      unit: line.unit,
      quantity: numberText(line.quantity),
      minutes: numberText(line.manualMinutes),
      needsMinutes: line.manualMinutes !== null,
      costCode: line.costCode,
    })),
  };
}

/**
 * The panel state: empty for a new item, the saved composition of a «Виріб з нуля», or the Catalog composition of a
 * model being changed.
 */
export function customSewingDraft(
  item?: QuoteItemDraft,
  model?: QuoteModelComposition,
): QuoteCustomSewingDraft {
  if (!item) return { name: '', description: '', variants: [emptyVariant()], lines: [] };
  if (model && item.kind === 'Sewing') return modelDraft(item, model);
  return {
    name: item.name,
    description: item.description,
    variants: item.options
      .filter((option) => option.fabrics.length > 0)
      .map((option) => ({
        key: option.key,
        isRecommended: option.isRecommended,
        fabrics: option.fabrics.map((x) => fabricDraft(x.fabricId, x.name, x.meters)),
      })),
    lines: item.lines.map((line) => ({
      key: nextKey('line'),
      kind: line.kind,
      referenceId: line.referenceId,
      name: line.name,
      unit: line.unit,
      quantity: numberText(line.quantity),
      minutes: numberText(line.manualMinutes),
      needsMinutes: line.manualMinutes !== null,
      costCode: line.costCode,
    })),
  };
}
