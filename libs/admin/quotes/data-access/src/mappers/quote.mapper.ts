import type {
  Quote,
  QuoteCatalogPage,
  QuoteCatalogProduct,
  QuoteCustomSewingPrice,
  QuoteItem,
  QuoteOption,
  QuotePage,
  QuotePrice,
  QuoteRepriceReport,
  QuoteStaff,
  QuoteTierPrices,
} from '@admin/quotes/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const price = (value: Schemas['CrmQuotePrice']): QuotePrice => ({
  amount: value.amount ?? null,
  source: value.source ?? null,
  isManual: value.isManual,
  shown: value.shown,
});

const option = (value: Schemas['CrmQuoteOption']): QuoteOption => ({
  id: value.id,
  articleId: value.articleId ?? null,
  fabricId: value.fabricId ?? null,
  title: value.title,
  details: value.details ?? null,
  isRecommended: value.isRecommended,
  prices: {
    retail: price(value.retail),
    wholesale: price(value.wholesale),
    large: price(value.large),
  },
  manualReason: value.manualReason ?? null,
  manualByName: value.manualByName ?? null,
  manualAt: value.manualAt ?? null,
  pricesTakenAt: value.pricesTakenAt ?? null,
  fabricMeters: value.fabricMeters ?? null,
});

const item = (value: Schemas['CrmQuoteItem']): QuoteItem => ({
  id: value.id,
  kind: value.kind,
  productId: value.productId ?? null,
  code: value.code ?? null,
  name: value.name,
  subtitle: value.subtitle ?? null,
  description: value.description ?? null,
  siteUrl: value.siteUrl ?? null,
  photoUrl: value.photoUrl ?? null,
  season: value.season ?? null,
  supplierUrl: value.supplierUrl ?? null,
  options: value.options.map(option),
  lines: value.lines.map((line) => ({
    kind: line.kind,
    referenceId: line.referenceId,
    name: line.name,
    unit: line.unit,
    quantity: line.quantity,
    manualMinutes: line.manualMinutes ?? null,
  })),
});

export const mapQuote = (value: Schemas['CrmQuote']): Quote => ({
  id: value.id,
  number: value.number,
  kind: value.kind,
  status: value.status,
  internalName: value.internalName,
  customerId: value.customerId ?? null,
  recipientName: value.recipientName ?? null,
  companyName: value.companyName ?? null,
  clientComment: value.clientComment ?? null,
  managerNote: value.managerNote ?? null,
  author: value.author,
  responsible: value.responsible,
  createdAt: value.createdAt,
  updatedAt: value.updatedAt,
  lastSentAt: value.lastSentAt ?? null,
  version: value.version,
  items: value.items.map(item),
  introduction: value.introduction
    ? {
        layout: value.introduction.layout,
        recipientEmail: value.introduction.recipientEmail ?? null,
        letterName: value.introduction.letterName ?? null,
      }
    : null,
});

export const mapQuotePage = (value: Schemas['CrmQuotePage']): QuotePage => ({
  items: value.items.map((row) => ({
    id: row.id,
    number: row.number,
    kind: row.kind,
    status: row.status,
    internalName: row.internalName,
    companyName: row.companyName ?? null,
    responsible: row.responsible,
    itemsCount: row.itemsCount,
    updatedAt: row.updatedAt,
    lastSentAt: row.lastSentAt ?? null,
  })),
  page: value.page,
  pageSize: value.pageSize,
  total: value.total,
});

const tierPrices = (
  value: Schemas['CrmQuoteTierPrices'] | null | undefined,
): QuoteTierPrices | null =>
  value
    ? {
        retail: value.retail ?? null,
        wholesale: value.wholesale ?? null,
        large: value.large ?? null,
      }
    : null;

export const mapQuoteCatalogProduct = (
  value: Schemas['CrmQuoteCatalogProduct'],
): QuoteCatalogProduct => ({
  productId: value.productId,
  kind: value.kind,
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
    prices: tierPrices(variant.prices),
    problem: variant.problem ?? null,
  })),
});

export const mapQuoteCatalogPage = (value: Schemas['CrmQuoteCatalogPage']): QuoteCatalogPage => ({
  items: value.items.map(mapQuoteCatalogProduct),
  page: value.page,
  pageSize: value.pageSize,
  total: value.total,
});

export const mapQuoteRepriceReport = (
  value: Schemas['CrmQuoteRepriceReport'],
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

export const mapQuoteStaff = (value: Schemas['CrmQuoteStaff'][]): QuoteStaff[] =>
  value.map((member) => ({
    userId: member.userId,
    name: member.name,
    email: member.email ?? null,
  }));

export const mapQuoteCustomSewingPrice = (
  value: Schemas['CrmQuoteCustomSewingPrice'],
): QuoteCustomSewingPrice => ({
  lines: value.lines.map((line) => ({
    kind: line.kind,
    referenceId: line.referenceId,
    name: line.name ?? null,
    unit: line.unit ?? null,
    unitValue: line.unitValue ?? null,
    isActive: line.isActive,
  })),
  fabrics: value.fabrics.map((fabric) => ({
    fabricId: fabric.fabricId,
    meters: fabric.meters,
    name: fabric.name ?? null,
    details: fabric.details ?? null,
    pricePerMeter: fabric.pricePerMeter ?? null,
    minutes: fabric.minutes ?? null,
    laborCost: fabric.laborCost ?? null,
    fullCost: fabric.fullCost ?? null,
    prices: fabric.prices
      ? {
          retail: fabric.prices.retail ?? null,
          wholesale: fabric.prices.wholesale ?? null,
          large: fabric.prices.large ?? null,
        }
      : null,
    problems: fabric.problems,
  })),
});
