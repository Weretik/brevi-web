import {
  formTextError,
  noteError,
  operationDateError,
  parseStockMeters,
  positiveMetersError,
} from '../../validators/stock-operation-rules';

import type {
  OpenFabricStockBody,
  ReceiveFabricBody,
} from '../../entities/operations/stock-operation';
import type { FabricStockChoices } from '../../entities/stock/fabric-stock-choices';

export type Errors<T> = Partial<Record<keyof T, string>>;

export const optional = (value: string) => value.trim() || null;
export const compact = <T extends object>(errors: Errors<T>) =>
  Object.fromEntries(Object.entries(errors).filter(([, value]) => value)) as Errors<T>;

export const hasStockFormErrors = (errors: object) => Object.keys(errors).length > 0;

// «Початковий залишок»

export interface FabricOpeningFormValues {
  fabricId: number | null;
  color: string;
  meters: string;
  operationDate: string;
}
export type FabricOpeningErrors = Errors<FabricOpeningFormValues>;

export const createFabricOpeningValues = (today: string): FabricOpeningFormValues => ({
  fabricId: null,
  color: '',
  meters: '',
  operationDate: today,
});

export function validateFabricOpening(values: FabricOpeningFormValues): FabricOpeningErrors {
  const meters = parseStockMeters(values.meters);
  return compact<FabricOpeningFormValues>({
    fabricId: values.fabricId === null ? 'Оберіть тканину.' : undefined,
    color: values.color.trim() ? undefined : 'Оберіть колір.',
    meters:
      meters === null || meters < 0 ? 'Метри — число від 0, до двох знаків після коми.' : undefined,
    operationDate: operationDateError(values.operationDate),
  });
}

export const fabricOpeningBody = (
  values: FabricOpeningFormValues,
  operationId: string,
): OpenFabricStockBody => ({
  operationId,
  fabricId: values.fabricId ?? 0,
  color: values.color.trim(),
  meters: parseStockMeters(values.meters) ?? 0,
  operationDate: values.operationDate,
});

// «Прихід»

export interface FabricReceiptFormValues {
  fabricId: number | null;
  color: string;
  meters: string;
  operationDate: string;
  supplierName: string;
  document: string;
  note: string;
}
export type FabricReceiptErrors = Errors<FabricReceiptFormValues>;

export const createFabricReceiptValues = (today: string): FabricReceiptFormValues => ({
  fabricId: null,
  color: '',
  meters: '',
  operationDate: today,
  supplierName: '',
  document: '',
  note: '',
});

/** A pair a receipt starts from: «+ Прихід» on a row of «Що замовити». */
export interface FabricReceiptPreset {
  fabricCode: string;
  color: string;
  supplier: string | null;
}

/**
 * The receipt form filled from a pair: the offer with that code (or of that group), the colour as the list spells
 * it and the supplier. A fabric that is no longer offered is left to choose.
 */
export function presetFabricReceiptValues(
  values: FabricReceiptFormValues,
  choices: FabricStockChoices,
  preset: FabricReceiptPreset,
): FabricReceiptFormValues {
  const fabric =
    choices.fabrics.find((x) => x.code === preset.fabricCode) ??
    choices.fabrics.find((x) => x.groupCode === preset.fabricCode);
  const key = preset.color.trim().toLocaleLowerCase('uk-UA');
  const color = choices.colors.find((x) => x.toLocaleLowerCase('uk-UA') === key) ?? preset.color;
  return {
    ...values,
    fabricId: fabric?.id ?? values.fabricId,
    color,
    supplierName: preset.supplier ?? fabric?.supplier ?? values.supplierName,
  };
}

/** After a saved receipt the next one keeps the fabric, colour, date and supplier. */
export const nextFabricReceiptValues = (
  values: FabricReceiptFormValues,
): FabricReceiptFormValues => ({ ...values, meters: '', document: '' });

export function validateFabricReceipt(values: FabricReceiptFormValues): FabricReceiptErrors {
  return compact<FabricReceiptFormValues>({
    fabricId: values.fabricId === null ? 'Оберіть тканину.' : undefined,
    color: values.color.trim() ? undefined : 'Оберіть колір.',
    meters: positiveMetersError(values.meters),
    operationDate: operationDateError(values.operationDate),
    supplierName: formTextError(values.supplierName),
    document: formTextError(values.document),
    note: noteError(values.note),
  });
}

export const fabricReceiptBody = (
  values: FabricReceiptFormValues,
  operationId: string,
): ReceiveFabricBody => ({
  operationId,
  fabricId: values.fabricId ?? 0,
  color: values.color.trim(),
  meters: parseStockMeters(values.meters) ?? 0,
  operationDate: values.operationDate,
  supplierName: optional(values.supplierName),
  document: optional(values.document),
  note: optional(values.note),
});

// «Разова витрата / без замовлення»

// «Уточнити»
