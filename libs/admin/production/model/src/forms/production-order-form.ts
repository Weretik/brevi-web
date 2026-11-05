import {
  createProductionItemFormValues,
  parseMoney,
  productionItemDetails,
  validateProductionItem,
} from './production-item-form';

import type { ProductionItemErrors, ProductionItemFormValues } from './production-item-form';
import type {
  CreateProductionOrderBody,
  ProductionOrder,
  ProductionQuoteDraft,
  ReportPriceTier,
  UpdateProductionOrderBody,
} from '../entities/production-order';

export interface ProductionOrderHeaderValues {
  clientName: string;
  orderDate: string;
  comment: string;
}

export type ProductionOrderHeaderErrors = Partial<Record<'clientName' | 'orderDate', string>>;

/** A КП item in the create form: whether it goes to the workshop and in which fabric. */
export interface CreateOrderLine {
  quoteItemId: number;
  include: boolean;
  optionId: number | null;
  values: ProductionItemFormValues;
}

export interface CreateOrderFormValues {
  header: ProductionOrderHeaderValues;
  priceTier: ReportPriceTier;
  lines: CreateOrderLine[];
}

export interface CreateOrderErrors {
  header: ProductionOrderHeaderErrors;
  lines: Record<number, ProductionItemErrors & { optionId?: string }>;
  form?: string;
}

/** yyyy-mm-dd in local time. */
export const todayIso = (now = new Date()) =>
  new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);

export function createOrderFormValues(
  draft: ProductionQuoteDraft,
  today: string,
): CreateOrderFormValues {
  return {
    header: { clientName: draft.clientName, orderDate: today, comment: '' },
    priceTier: 'Wholesale',
    lines: draft.items.map((item) => ({
      quoteItemId: item.quoteItemId,
      include: true,
      optionId: item.options.length === 1 ? item.options[0].optionId : null,
      values: {
        ...createProductionItemFormValues(),
        // The КП «Вишивка» rows go to every item; the manager removes what does not apply.
        applications: draft.embroideries.map(({ calculation }) => ({
          kind: 'Embroidery' as const,
          place: '',
          description: calculation.name,
          color: '',
          embroidery: { id: calculation.id, number: calculation.number, name: calculation.name },
        })),
      },
    })),
  };
}

export function validateOrderHeader(
  values: ProductionOrderHeaderValues,
): ProductionOrderHeaderErrors {
  const errors: ProductionOrderHeaderErrors = {};
  if (!values.clientName.trim()) errors.clientName = 'Вкажіть клієнта.';
  if (!values.orderDate) errors.orderDate = 'Вкажіть дату створення.';
  return errors;
}

export function validateCreateOrder(values: CreateOrderFormValues): CreateOrderErrors {
  const errors: CreateOrderErrors = { header: validateOrderHeader(values.header), lines: {} };
  const included = values.lines.filter((line) => line.include);
  if (included.length === 0) errors.form = 'Оберіть хоча б одну позицію.';
  for (const line of included) {
    const lineErrors: ProductionItemErrors & { optionId?: string } = validateProductionItem(
      line.values,
    );
    if (line.optionId === null) lineErrors.optionId = 'Оберіть тканину.';
    if (Object.keys(lineErrors).length > 0) errors.lines[line.quoteItemId] = lineErrors;
  }
  return errors;
}

export const hasCreateOrderErrors = (errors: CreateOrderErrors) =>
  Boolean(errors.form) ||
  Object.keys(errors.header).length > 0 ||
  Object.keys(errors.lines).length > 0;

export function createOrderBody(
  draft: ProductionQuoteDraft,
  values: CreateOrderFormValues,
  requestId: string,
): CreateProductionOrderBody {
  return {
    requestId,
    quoteId: draft.quoteId,
    clientName: values.header.clientName.trim(),
    orderDate: values.header.orderDate,
    comment: values.header.comment.trim() || null,
    priceTier: values.priceTier,
    items: values.lines
      .filter((line) => line.include && line.optionId !== null)
      .map((line) => ({
        quoteItemId: line.quoteItemId,
        quoteOptionId: line.optionId as number,
        details: productionItemDetails(line.values),
      })),
  };
}

export const orderHeaderValues = (order: ProductionOrder): ProductionOrderHeaderValues => ({
  clientName: order.clientName,
  orderDate: order.orderDate,
  comment: order.comment ?? '',
});

/** The whole order as a save body, with one item replaced by the edited values. */
export function updateOrderBody(
  order: ProductionOrder,
  header: ProductionOrderHeaderValues,
  edited: { itemId: number; values: ProductionItemFormValues } | null,
): UpdateProductionOrderBody {
  return {
    version: order.version,
    clientName: header.clientName.trim(),
    orderDate: header.orderDate,
    comment: header.comment.trim() || null,
    items: order.items.map((item) => {
      const values =
        edited?.itemId === item.id ? edited.values : createProductionItemFormValues(item);
      return {
        id: item.id,
        details: productionItemDetails(values),
        sewingRate: order.permissions.seesSewingRate
          ? (parseMoney(values.sewingRate) ?? null)
          : null,
      };
    }),
  };
}
