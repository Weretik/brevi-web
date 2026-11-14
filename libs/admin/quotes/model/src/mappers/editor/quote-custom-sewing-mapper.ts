import { quoteChangedModelSubtitle, quoteItemSubtitles } from '../../forms/editor/quote-draft';

import type { QuoteItemLine, QuoteItemLineKind, QuoteTier } from '../../entities/quote';
import type {
  QuoteCustomSewingPrice,
  QuoteCustomSewingPriceRequest,
  QuoteCustomSewingVariantPrice,
  QuoteModelComposition,
} from '../../entities/quote-custom-sewing';
import type {
  QuoteCustomFabricDraft,
  QuoteCustomLineDraft,
  QuoteCustomSewingDraft,
  QuoteCustomVariantDraft,
} from '../../forms/editor/quote-custom-sewing-draft';
import type { QuoteItemDraft, QuoteOptionDraft } from '../../forms/editor/quote-draft';

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

const fabricDraft = (
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
const emptyVariant = (): QuoteCustomVariantDraft => ({
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

const mapVariant = (
  draft: QuoteCustomSewingDraft,
  key: string,
  change: (variant: QuoteCustomVariantDraft) => QuoteCustomVariantDraft,
): QuoteCustomSewingDraft => ({
  ...draft,
  variants: draft.variants.map((x) => (x.key === key ? change(x) : x)),
});

/** One more variant; it starts empty, the manager adds its fabrics. */
export function addCustomVariant(draft: QuoteCustomSewingDraft): QuoteCustomSewingDraft {
  return { ...draft, variants: [...draft.variants, emptyVariant()] };
}

export function removeCustomVariant(
  draft: QuoteCustomSewingDraft,
  key: string,
): QuoteCustomSewingDraft {
  return { ...draft, variants: draft.variants.filter((x) => x.key !== key) };
}

/** One recommended variant; choosing it again clears the mark. */
export function recommendCustomVariant(
  draft: QuoteCustomSewingDraft,
  key: string,
): QuoteCustomSewingDraft {
  return {
    ...draft,
    variants: draft.variants.map((x) => ({
      ...x,
      isRecommended: x.key === key ? !x.isRecommended : false,
    })),
  };
}

/** A fabric into one variant; the same fabric twice in a variant is ignored. */
export function addCustomFabric(
  draft: QuoteCustomSewingDraft,
  variantKey: string,
  fabric: { readonly id: number; readonly name: string },
): QuoteCustomSewingDraft {
  return mapVariant(draft, variantKey, (variant) =>
    variant.fabrics.some((x) => x.fabricId === fabric.id)
      ? variant
      : { ...variant, fabrics: [...variant.fabrics, fabricDraft(fabric.id, fabric.name, null)] },
  );
}

export function setCustomFabricMeters(
  draft: QuoteCustomSewingDraft,
  variantKey: string,
  fabricKey: string,
  meters: string,
): QuoteCustomSewingDraft {
  return mapVariant(draft, variantKey, (variant) => ({
    ...variant,
    fabrics: variant.fabrics.map((x) => (x.key === fabricKey ? { ...x, meters } : x)),
  }));
}

export function removeCustomFabric(
  draft: QuoteCustomSewingDraft,
  variantKey: string,
  fabricKey: string,
): QuoteCustomSewingDraft {
  return mapVariant(draft, variantKey, (variant) => ({
    ...variant,
    fabrics: variant.fabrics.filter((x) => x.key !== fabricKey),
  }));
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

/** «fabricId:metres|…» of a variant, to find two variants with the same fabrics. */
const variantSignature = (fabrics: readonly QuoteCustomFabricDraft[]) =>
  fabrics.map((x) => `${x.fabricId}:${parseCustomQuantity(x.meters)}`).join('|');

/**
 * What the server prices; null while something is not filled in (a variant without fabrics, a fabric without
 * metres, a quantity, minutes or no operation).
 */
export function customSewingPriceRequest(
  draft: QuoteCustomSewingDraft,
): QuoteCustomSewingPriceRequest | null {
  const variants = draft.variants.map((variant) =>
    variant.fabrics.map((x) => ({ fabricId: x.fabricId, meters: amount(x.meters) })),
  );
  const lines = draft.lines.map((x) => ({
    kind: x.kind,
    referenceId: x.referenceId,
    quantity: amount(x.quantity),
    manualMinutes: x.needsMinutes ? amount(x.minutes) : null,
    costCode: x.costCode,
  }));
  if (variants.length === 0 || !lines.some((x) => x.kind === 'Operation')) return null;
  if (variants.some((fabrics) => fabrics.length === 0 || fabrics.some((x) => x.meters === null)))
    return null;
  if (
    lines.some(
      (x, index) =>
        x.quantity === null || (draft.lines[index].needsMinutes && x.manualMinutes === null),
    )
  )
    return null;
  return {
    variants: variants.map((fabrics) => ({
      fabrics: fabrics.map((x) => ({ fabricId: x.fabricId, meters: x.meters! })),
    })),
    lines: lines.map((x) => ({ ...x, quantity: x.quantity! })),
  };
}

/** What is missing before the item can go into the КП, in the order the panel shows it. */
export function customSewingErrors(draft: QuoteCustomSewingDraft): readonly string[] {
  const errors: string[] = [];
  if (!draft.name.trim()) errors.push('Вкажіть назву виробу.');
  if (draft.variants.length === 0) errors.push('Додайте хоча б один варіант.');
  if (draft.variants.some((x) => x.fabrics.length === 0))
    errors.push('Додайте тканину в кожен варіант.');
  if (draft.variants.some((x) => x.fabrics.some((fabric) => amount(fabric.meters) === null)))
    errors.push('Вкажіть метраж кожної тканини.');
  const signatures = draft.variants
    .filter((x) => x.fabrics.length > 0)
    .map((x) => variantSignature(x.fabrics));
  if (new Set(signatures).size !== signatures.length)
    errors.push('Два варіанти мають однакові тканини й метраж.');
  if (!draft.lines.some((x) => x.kind === 'Operation'))
    errors.push('Додайте хоча б одну операцію.');
  if (draft.lines.some((x) => amount(x.quantity) === null))
    errors.push('Кількість кожного рядка має бути більше нуля.');
  if (draft.lines.some((x) => x.needsMinutes && amount(x.minutes) === null))
    errors.push('Вкажіть хвилини операцій без норми.');
  return errors;
}

/** «1,25 м на виріб» or «Саржа 1,2 м + Грета 0,5 м на виріб». */
const fabricInfoOf = (fabrics: readonly { name: string; meters: number }[]) =>
  fabrics.length === 1
    ? `${numberText(fabrics[0].meters)} м на виріб`
    : `${fabrics.map((x) => `${x.name} ${numberText(x.meters)} м`).join(' + ')} на виріб`;

/**
 * A КП row priced by the formula: a «Виріб з нуля» variant or a model row in another fabric. Prices shown here
 * come from the preview; the server prices it again on save.
 */
export function pricedOptionDraft(
  priced: QuoteCustomSewingVariantPrice | undefined,
  fabrics: readonly { fabricId: number; name: string; meters: number }[],
  row: {
    key?: string;
    id?: number | null;
    isRecommended?: boolean;
    saved?: QuoteOptionDraft;
  } = {},
): QuoteOptionDraft {
  const named = fabrics.map((x, index) => ({
    fabricId: x.fabricId,
    name: priced?.fabrics[index]?.name ?? x.name,
    meters: x.meters,
  }));
  return {
    key: row.key ?? nextKey('option'),
    id: row.id ?? null,
    articleId: null,
    fabricId: named[0]?.fabricId ?? null,
    title: priced?.title ?? named.map((x) => x.name).join(' + '),
    details:
      named.length === 1
        ? (priced?.fabrics[0]?.details ?? null)
        : priced?.fabrics
            .filter((x) => x.details)
            .map((x) => `${x.name}: ${x.details}`)
            .join('; ') || null,
    fabricInfo: fabricInfoOf(named),
    isRecommended: row.isRecommended ?? false,
    prices: Object.fromEntries(
      tiers.map((tier) => [
        tier,
        {
          source: priced?.prices?.[tier] ?? null,
          manual: '',
          shown: row.saved?.prices[tier].shown ?? true,
        },
      ]),
    ) as QuoteOptionDraft['prices'],
    manualReason: '',
    manualBy: null,
    fabrics: named,
  };
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
  const options: QuoteOptionDraft[] = request.variants.map((variant, index) => {
    const own = draft.variants[index];
    const saved = same?.options.find((x) => x.key === own.key);
    return pricedOptionDraft(
      price.variants[index],
      variant.fabrics.map((x, at) => ({ ...x, name: own.fabrics[at]?.name ?? 'Тканина' })),
      {
        key: saved?.key ?? own.key,
        id: saved?.id ?? null,
        isRecommended: own.isRecommended,
        saved,
      },
    );
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
