import { quoteChangedModelSubtitle, quoteItemSubtitles } from '../models/quote-draft';

import type { QuoteItemLine, QuoteItemLineKind, QuoteTier } from '../entities/quote';
import type {
  QuoteCustomSewingPrice,
  QuoteCustomSewingPriceRequest,
  QuoteModelComposition,
} from '../entities/quote-custom-sewing';
import type {
  QuoteCustomFabricDraft,
  QuoteCustomLineDraft,
  QuoteCustomSewingDraft,
} from '../models/quote-custom-sewing-draft';
import type { QuoteItemDraft, QuoteOptionDraft } from '../models/quote-draft';

let sequence = 0;
const nextKey = (prefix: string) => `custom-${prefix}-${++sequence}`;

const tiers: readonly QuoteTier[] = ['retail', 'wholesale', 'large'];

/** «1,25» for an input; empty for null. */
const numberText = (value: number | null): string =>
  value === null ? '' : String(value).replace('.', ',');

/** A positive quantity with up to 4 decimals («1,25», «0.375»); null otherwise. */
export function parseCustomQuantity(text: string): number | null {
  const normalized = text.replace(/\s/g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,4})?$/.test(normalized)) return null;
  const value = Number(normalized);
  return value > 0 && value <= 10_000 ? value : null;
}

/**
 * «Змінити склад» of a Catalog model: its texts, the Catalog fabric of each variant already in the КП (all active
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
    fabrics: fabrics
      .filter((x, index) => fabrics.findIndex((y) => y.fabricId === x.fabricId) === index)
      .map((x) => ({
        key: nextKey('fabric'),
        fabricId: x.fabricId,
        name: x.name ?? 'Тканина',
        meters: numberText(x.meters),
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
  if (!item) return { name: '', description: '', fabrics: [], lines: [] };
  if (model && item.kind === 'Sewing') return modelDraft(item, model);
  return {
    name: item.name,
    description: item.description,
    fabrics: item.options
      .filter((option) => option.fabricId !== null)
      .map((option) => ({
        key: nextKey('fabric'),
        fabricId: option.fabricId!,
        name: option.title,
        meters: numberText(option.fabricMeters),
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

export function addCustomFabric(
  draft: QuoteCustomSewingDraft,
  fabric: { readonly id: number; readonly name: string },
): QuoteCustomSewingDraft {
  if (draft.fabrics.some((x) => x.fabricId === fabric.id)) return draft;
  const meters = draft.fabrics.at(-1)?.meters ?? '';
  const row: QuoteCustomFabricDraft = {
    key: nextKey('fabric'),
    fabricId: fabric.id,
    name: fabric.name,
    meters,
  };
  return { ...draft, fabrics: [...draft.fabrics, row] };
}

export function addCustomLine(
  draft: QuoteCustomSewingDraft,
  line: {
    readonly kind: QuoteItemLineKind;
    readonly referenceId: number;
    readonly name: string;
    readonly unit: string;
    readonly needsMinutes: boolean;
  },
): QuoteCustomSewingDraft {
  const row: QuoteCustomLineDraft = {
    key: nextKey('line'),
    ...line,
    quantity: '1',
    minutes: '',
    costCode: null,
  };
  return { ...draft, lines: [...draft.lines, row] };
}

const amount = parseCustomQuantity;

/**
 * What the server prices; null while something is not filled in (a fabric without metres, a quantity, minutes,
 * no fabric or no operation).
 */
export function customSewingPriceRequest(
  draft: QuoteCustomSewingDraft,
): QuoteCustomSewingPriceRequest | null {
  const fabrics = draft.fabrics.map((x) => ({ fabricId: x.fabricId, meters: amount(x.meters) }));
  const lines = draft.lines.map((x) => ({
    kind: x.kind,
    referenceId: x.referenceId,
    quantity: amount(x.quantity),
    manualMinutes: x.needsMinutes ? amount(x.minutes) : null,
    costCode: x.costCode,
  }));
  if (fabrics.length === 0 || !lines.some((x) => x.kind === 'Operation')) return null;
  if (fabrics.some((x) => x.meters === null)) return null;
  if (
    lines.some(
      (x, index) =>
        x.quantity === null || (draft.lines[index].needsMinutes && x.manualMinutes === null),
    )
  )
    return null;
  return {
    fabrics: fabrics.map((x) => ({ fabricId: x.fabricId, meters: x.meters! })),
    lines: lines.map((x) => ({ ...x, quantity: x.quantity! })),
  };
}

/** What is missing before the item can go into the КП, in the order the panel shows it. */
export function customSewingErrors(draft: QuoteCustomSewingDraft): readonly string[] {
  const errors: string[] = [];
  if (!draft.name.trim()) errors.push('Вкажіть назву виробу.');
  if (draft.fabrics.length === 0) errors.push('Додайте хоча б одну тканину.');
  if (draft.fabrics.some((x) => amount(x.meters) === null))
    errors.push('Вкажіть метраж кожної тканини.');
  if (!draft.lines.some((x) => x.kind === 'Operation'))
    errors.push('Додайте хоча б одну операцію.');
  if (draft.lines.some((x) => amount(x.quantity) === null))
    errors.push('Кількість кожного рядка має бути більше нуля.');
  if (draft.lines.some((x) => x.needsMinutes && amount(x.minutes) === null))
    errors.push('Вкажіть хвилини операцій без норми.');
  return errors;
}

/**
 * The КП item of a priced composition. A saved fabric row keeps its id so the server can match it; prices shown
 * here come from the preview and the server prices the item again on save.
 */
export function customSewingItemDraft(
  draft: QuoteCustomSewingDraft,
  request: QuoteCustomSewingPriceRequest,
  price: QuoteCustomSewingPrice,
  previous?: QuoteItemDraft,
): QuoteItemDraft {
  const lines: QuoteItemLine[] = request.lines.map((line, index) => ({
    kind: line.kind,
    referenceId: line.referenceId,
    name: price.lines[index]?.name ?? draft.lines[index].name,
    unit: price.lines[index]?.unit ?? draft.lines[index].unit,
    quantity: line.quantity,
    manualMinutes: line.manualMinutes,
    costCode: line.costCode,
  }));
  // A changed Catalog model is a new item: its Sewing rows cannot be matched to fabric rows.
  const same = previous?.kind === 'CustomSewing' ? previous : undefined;
  const model = previous?.productId != null ? previous : undefined;
  const options: QuoteOptionDraft[] = request.fabrics.map((fabric, index) => {
    const priced = price.fabrics[index];
    const saved = same?.options.find((x) => x.fabricId === fabric.fabricId);
    return {
      key: saved?.key ?? nextKey('option'),
      id: saved?.id ?? null,
      articleId: null,
      title: priced?.name ?? draft.fabrics[index].name,
      details: priced?.details ?? null,
      fabricInfo: `${numberText(fabric.meters)} м на виріб`,
      isRecommended: saved?.isRecommended ?? false,
      prices: Object.fromEntries(
        tiers.map((tier) => [
          tier,
          {
            source: priced?.prices?.[tier] ?? null,
            manual: '',
            shown: saved?.prices[tier].shown ?? true,
          },
        ]),
      ) as QuoteOptionDraft['prices'],
      manualReason: '',
      manualBy: null,
      fabricId: fabric.fabricId,
      fabricMeters: fabric.meters,
    };
  });
  return {
    key: previous?.key ?? nextKey('item'),
    id: same?.id ?? null,
    kind: 'CustomSewing',
    productId: model?.productId ?? null,
    code: model?.code ?? null,
    name: draft.name.trim(),
    subtitle: model ? quoteChangedModelSubtitle : quoteItemSubtitles.CustomSewing,
    description: draft.description,
    siteUrl: model?.siteUrl ?? null,
    photoUrl: previous?.photoUrl ?? null,
    season: model?.season ?? null,
    supplierUrl: '',
    options,
    lines,
  };
}
