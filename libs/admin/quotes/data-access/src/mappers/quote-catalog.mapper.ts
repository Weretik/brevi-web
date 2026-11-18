import type {
  QuoteCatalogPage,
  QuoteCatalogProduct,
  QuoteCustomSewingPrice,
  QuoteFabricFacts,
  QuoteItemLineKind,
  QuoteModelComposition,
  QuoteProductPhoto,
  QuoteRepriceReport,
  QuoteStaff,
  QuoteTierPrices,
} from '@admin/quotes/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const tierPrices = (
  value: Schemas['QuoteTierPricesResponse'] | null | undefined,
): QuoteTierPrices | null =>
  value
    ? {
        retail: value.retail ?? null,
        wholesale: value.wholesale ?? null,
        large: value.large ?? null,
      }
    : null;

export const mapQuoteCatalogProduct = (
  value: Schemas['QuoteCatalogProductResponse'],
): QuoteCatalogProduct => ({
  productId: value.productId,
  kind: value.kind as 'Sewing' | 'Ppe',
  code: value.code ?? null,
  name: value.name,
  season: value.season ?? null,
  photoUrl: value.photoUrl ?? null,
  description: value.description ?? null,
  prices: tierPrices(value.prices),
  problem: value.problem ?? null,
  variants: value.variants.map((variant) => ({
    articleId: variant.articleId,
    sku: variant.sku,
    title: variant.title,
    fabricInfo: variant.fabricInfo ?? null,
    fabricId: variant.fabricId ?? null,
    prices: tierPrices(variant.prices),
    problem: variant.problem ?? null,
  })),
});

export const mapQuoteCatalogPage = (
  value: Schemas['QuoteCatalogPageResponse'],
): QuoteCatalogPage => ({
  items: value.items.map(mapQuoteCatalogProduct),
  page: value.page,
  pageSize: value.pageSize,
  total: value.total,
});

export const mapQuoteRepriceReport = (
  value: Schemas['QuoteRepriceReport'],
): QuoteRepriceReport => ({
  applied: value.applied,
  version: value.version,
  changes: value.changes.map((change) => ({
    optionId: change.optionId,
    itemName: change.itemName,
    optionTitle: change.optionTitle,
    before: tierPrices(change.before) ?? { retail: null, wholesale: null, large: null },
    after: tierPrices(change.after) ?? { retail: null, wholesale: null, large: null },
  })),
  unavailable: value.unavailable,
});

export const mapQuoteStaff = (value: Schemas['QuoteStaffResponse'][]): QuoteStaff[] =>
  value.map((member) => ({
    userId: member.userId,
    name: member.name,
    email: member.email ?? null,
  }));

export const mapQuoteCustomSewingPrice = (
  value: Schemas['QuoteCustomSewingPriceResponse'],
): QuoteCustomSewingPrice => ({
  lines: value.lines.map((line) => ({
    kind: line.kind as QuoteItemLineKind,
    referenceId: line.referenceId,
    name: line.name ?? null,
    unit: line.unit ?? null,
    unitValue: line.unitValue ?? null,
    isActive: line.isActive,
    costCode: line.costCode ?? null,
  })),
  variants: value.variants.map((variant) => ({
    title: variant.title ?? null,
    fabrics: variant.fabrics.map((fabric) => ({
      fabricId: fabric.fabricId,
      meters: fabric.meters,
      name: fabric.name ?? null,
      details: fabric.details ?? null,
      pricePerMeter: fabric.pricePerMeter ?? null,
    })),
    minutes: variant.minutes ?? null,
    laborCost: variant.laborCost ?? null,
    fullCost: variant.fullCost ?? null,
    prices: variant.prices
      ? {
          retail: variant.prices.retail ?? null,
          wholesale: variant.prices.wholesale ?? null,
          large: variant.prices.large ?? null,
        }
      : null,
    problems: variant.problems,
  })),
});

export const mapQuoteModelComposition = (
  value: Schemas['QuoteModelCompositionResponse'],
): QuoteModelComposition => ({
  productId: value.productId,
  fabrics: value.fabrics.map((fabric) => ({
    articleId: fabric.articleId,
    fabricId: fabric.fabricId,
    name: fabric.name ?? null,
    meters: fabric.meters,
    isActive: fabric.isActive,
  })),
  lines: value.lines.map((line) => ({
    kind: line.kind as QuoteItemLineKind,
    referenceId: line.referenceId,
    costCode: line.costCode ?? null,
    name: line.name ?? null,
    unit: line.unit,
    quantity: line.quantity,
    manualMinutes: line.manualMinutes ?? null,
  })),
});

/** The product photos a КП item can show; files missing from the library are left out. */
export const mapQuoteProductPhotos = (value: Schemas['ProductPhotoList']): QuoteProductPhoto[] =>
  value.photos.flatMap((photo) =>
    !photo.missing && photo.url
      ? [
          {
            mediaFileId: photo.mediaFileId,
            url: photo.url,
            thumbnailUrl: photo.thumbnailUrl ?? null,
            isMain: photo.isMain,
          },
        ]
      : [],
  );

export const mapQuoteFabricFacts = (
  value: Schemas['QuoteFabricFactsResponse'][],
): QuoteFabricFacts[] =>
  value.map((fabric) => ({
    fabricId: fabric.fabricId,
    name: fabric.name,
    composition: fabric.composition ?? null,
    density: fabric.density ?? null,
    pricePerMeter: fabric.pricePerMeter,
    supplierId: fabric.supplierId ?? null,
    supplierName: fabric.supplierName ?? null,
  }));
