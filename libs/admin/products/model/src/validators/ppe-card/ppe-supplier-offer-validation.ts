export interface PpeSupplierOfferFormValues {
  supplierId: number | '';
  supplierSku: string;
  supplierUrl: string;
  supplierPrice: string;
  allowManualPrice: boolean;
  ruleCode: string;
  unit: string;
}

export type PpeSupplierOfferField = keyof PpeSupplierOfferFormValues;
export type PpeSupplierOfferFieldErrors = Partial<Record<PpeSupplierOfferField, string>>;

/** Limits shared with BreviERP `Product.PpeSupplier`. */
export const ppeSupplierOfferLimits = { supplierSku: 200, supplierUrl: 2048, unit: 40 } as const;

const pricePattern = /^\d+([.,]\d{1,2})?$/;

function isWebUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

/** The supplier price as a number, or null when the field is empty. */
export function parsePpeSupplierPrice(value: string): number | null {
  const text = value.trim();
  return text ? Number(text.replace(',', '.')) : null;
}

export function validatePpeSupplierOffer(
  values: PpeSupplierOfferFormValues,
): PpeSupplierOfferFieldErrors {
  const errors: PpeSupplierOfferFieldErrors = {};
  if (values.supplierId === '') errors.supplierId = 'Оберіть постачальника.';
  if (values.supplierSku.trim().length > ppeSupplierOfferLimits.supplierSku)
    errors.supplierSku = `Не більше ${ppeSupplierOfferLimits.supplierSku} символів.`;
  const url = values.supplierUrl.trim();
  if (url && (url.length > ppeSupplierOfferLimits.supplierUrl || !isWebUrl(url)))
    errors.supplierUrl = 'Посилання має починатися з https://.';
  const price = values.supplierPrice.trim();
  if (price && (!pricePattern.test(price) || Number(price.replace(',', '.')) <= 0))
    errors.supplierPrice = 'Ціна більше 0, до 2 знаків після коми.';
  if (values.unit.trim().length > ppeSupplierOfferLimits.unit)
    errors.unit = `Не більше ${ppeSupplierOfferLimits.unit} символів.`;
  return errors;
}
