import { PRODUCTION_ORDER_MAX_ADDITIONAL_COLORS } from '../entities/production-order';

import type { FabricNormValues } from '../entities/fabric-norm';
import type {
  ItemApplicationKind,
  ProductionItem,
  ProductionItemDetails,
} from '../entities/production-order';

/** The saved calculation an embroidery points to, as the form shows it. */
export interface ItemEmbroideryLink {
  id: number;
  number: string;
  name: string;
}

export interface ItemApplicationFormValues {
  kind: ItemApplicationKind;
  place: string;
  description: string;
  color: string;
  /** «Розрахунок вишивки»; only for an embroidery. */
  embroidery: ItemEmbroideryLink | null;
}

/** Text of the item inputs; «Розцінка» only for those who see it. */
export interface ProductionItemFormValues {
  quantity: string;
  dueDate: string;
  mainColor: string;
  additionalColors: string[];
  sizesText: string;
  technicalChanges: string;
  comment: string;
  applications: ItemApplicationFormValues[];
  sewingRate: string;
}

export type ProductionItemField = 'quantity' | 'dueDate' | 'mainColor' | 'sewingRate';
export type ProductionItemErrors = Partial<Record<ProductionItemField, string>>;

export const emptyItemApplication = (): ItemApplicationFormValues => ({
  kind: 'Embroidery',
  place: '',
  description: '',
  color: '',
  embroidery: null,
});

/** «ВШ-0042 · Логотип»; just the number when the name is not known. */
export const embroideryLinkLabel = (link: ItemEmbroideryLink) =>
  link.name ? `${link.number} · ${link.name}` : link.number;

export function createProductionItemFormValues(
  item: ProductionItem | null = null,
  dueDate = '',
): ProductionItemFormValues {
  return {
    quantity: item ? String(item.quantity) : '',
    dueDate: item?.dueDate ?? dueDate,
    mainColor: item?.mainColor ?? '',
    additionalColors: item?.additionalColors ?? [],
    sizesText: item?.sizesText ?? '',
    technicalChanges: item?.technicalChanges ?? '',
    comment: item?.comment ?? '',
    applications: (item?.applications ?? []).map((x) => ({
      kind: x.kind,
      place: x.place ?? '',
      description: x.description ?? '',
      color: x.color ?? '',
      embroidery:
        x.embroideryCalculationId !== null
          ? {
              id: x.embroideryCalculationId,
              number: x.embroidery?.number ?? x.embroideryNumber ?? '',
              name: x.embroidery?.name ?? '',
            }
          : null,
    })),
    sewingRate: item?.sewingRate == null ? '' : String(item.sewingRate),
  };
}

const optional = (value: string) => (value.trim() ? value.trim() : null);

export function parseQuantity(value: string): number | null {
  const text = value.trim();
  return /^\d+$/.test(text) && Number(text) >= 1 && Number(text) <= 100_000 ? Number(text) : null;
}

/** «343,25» or «343.25»; empty is null; undefined when it is not money. */
export function parseMoney(value: string): number | null | undefined {
  const text = value.trim().replace(',', '.').replace(/\s/g, '');
  if (!text) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return undefined;
  return Number(text);
}

export function validateProductionItem(
  values: ProductionItemFormValues,
  withRate = false,
): ProductionItemErrors {
  const errors: ProductionItemErrors = {};
  if (parseQuantity(values.quantity) === null) errors.quantity = 'Кількість — ціле число від 1.';
  if (!values.dueDate) errors.dueDate = 'Вкажіть «Готово до».';
  if (!values.mainColor.trim()) errors.mainColor = 'Вкажіть основний колір.';
  if (withRate && parseMoney(values.sewingRate) === undefined)
    errors.sewingRate = 'Розцінка — сума в гривнях, до двох знаків після коми.';
  return errors;
}

export function productionItemDetails(values: ProductionItemFormValues): ProductionItemDetails {
  return {
    quantity: parseQuantity(values.quantity) ?? 0,
    dueDate: values.dueDate,
    mainColor: values.mainColor.trim(),
    additionalColors: values.additionalColors
      .map((color) => color.trim())
      .filter(Boolean)
      .slice(0, PRODUCTION_ORDER_MAX_ADDITIONAL_COLORS),
    sizesText: optional(values.sizesText),
    technicalChanges: optional(values.technicalChanges),
    comment: optional(values.comment),
    applications: values.applications.map((x) => ({
      kind: x.kind,
      place: optional(x.place),
      description: optional(x.description),
      color: optional(x.color),
      embroideryCalculationId: x.kind === 'Embroidery' ? (x.embroidery?.id ?? null) : null,
    })),
  };
}

/**
 * Planned fabric as the server counts it: the norm for 1, 2 or 3 colours times the quantity,
 * rounded to 0.01 m. Null without a norm for that number of colours.
 */
export function plannedFabricMeters(
  norm: FabricNormValues | null,
  values: Pick<ProductionItemFormValues, 'quantity' | 'additionalColors'>,
): number | null {
  const quantity = parseQuantity(values.quantity);
  if (!norm || quantity === null) return null;
  const colors = Math.min(3, 1 + values.additionalColors.filter((x) => x.trim()).length);
  const sum = (...parts: (number | null)[]) =>
    parts.every((x) => x === null) ? null : parts.reduce<number>((a, b) => a + (b ?? 0), 0);
  const perItem =
    colors === 1
      ? norm.oneColor
      : colors === 2
        ? sum(norm.twoColorsMain, norm.twoColorsAdditional)
        : sum(norm.threeColorsMain, norm.threeColorsAdditional1, norm.threeColorsAdditional2);
  return perItem === null ? null : Math.round(perItem * quantity * 100) / 100;
}
