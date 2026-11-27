import type {
  Quote,
  QuoteEvent,
  QuoteEventKind,
  QuoteItem,
  QuoteIntroLayout,
  QuoteItemKind,
  QuoteItemLineKind,
  QuoteKind,
  QuoteOption,
  QuotePage,
  QuotePeriod,
  QuotePrice,
  QuoteStatus,
} from '@admin/quotes/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

const price = (value: Schemas['QuotePriceResponse']): QuotePrice => ({
  amount: value.amount ?? null,
  source: value.source ?? null,
  isManual: value.isManual,
  shown: value.shown,
});

const option = (value: Schemas['QuoteOptionResponse']): QuoteOption => ({
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
  fabrics: value.fabrics.map((fabric) => ({
    fabricId: fabric.fabricId,
    name: fabric.name,
    meters: fabric.meters,
  })),
});

const item = (value: Schemas['QuoteItemResponse']): QuoteItem => ({
  id: value.id,
  kind: value.kind as QuoteItemKind,
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
    kind: line.kind as QuoteItemLineKind,
    referenceId: line.referenceId,
    name: line.name,
    unit: line.unit,
    quantity: line.quantity,
    manualMinutes: line.manualMinutes ?? null,
    costCode: line.costCode ?? null,
  })),
});

export const mapQuote = (value: Schemas['QuoteResponse']): Quote => ({
  id: value.id,
  number: value.number,
  kind: value.kind as QuoteKind,
  status: value.status as QuoteStatus,
  internalName: value.internalName,
  customerPublicId: value.customerPublicId ?? null,
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
        layout: value.introduction.layout as QuoteIntroLayout,
        recipientEmail: value.introduction.recipientEmail ?? null,
        letterName: value.introduction.letterName ?? null,
        letterSubject: value.introduction.letterSubject ?? null,
        letterBody: value.introduction.letterBody ?? null,
      }
    : null,
});

export const mapQuoteEvent = (value: Schemas['QuoteEventResponse']): QuoteEvent => ({
  id: value.id,
  kind: value.kind as QuoteEventKind,
  at: value.at,
  actor: value.actor,
  details: value.details ?? null,
});

export const mapQuotePeriod = (value: Schemas['QuotePeriodResponse']): QuotePeriod => ({
  from: value.from,
  to: value.to,
  created: value.created,
  sent: value.sent,
  managers: value.managers.map((x) => ({ manager: x.manager, created: x.created, sent: x.sent })),
});

export const mapQuotePage = (value: Schemas['QuotePageResponse']): QuotePage => ({
  items: value.items.map((row) => ({
    id: row.id,
    number: row.number,
    kind: row.kind as QuoteKind,
    status: row.status as QuoteStatus,
    internalName: row.internalName,
    companyName: row.companyName ?? null,
    responsible: row.responsible,
    itemsCount: row.itemsCount,
    updatedAt: row.updatedAt,
    lastSentAt: row.lastSentAt ?? null,
    version: row.version,
  })),
  page: value.page,
  pageSize: value.pageSize,
  total: value.total,
});
