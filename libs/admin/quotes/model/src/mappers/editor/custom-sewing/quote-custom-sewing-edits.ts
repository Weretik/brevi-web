import { emptyVariant, fabricDraft, nextKey } from './quote-custom-sewing-draft';

import type { QuoteItemLineKind } from '../../../entities/quote/quote';
import type {
  QuoteCustomLineDraft,
  QuoteCustomSewingDraft,
  QuoteCustomVariantDraft,
} from '../../../forms/editor/quote-custom-sewing-draft';

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
