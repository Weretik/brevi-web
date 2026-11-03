import {
  ppeSupplierOfferLimits,
  validatePpeSupplierOffer,
} from '../ppe-card/ppe-supplier-offer-validation';
import { productOverviewLimits } from '../product-overview/product-overview-validation';

import type {
  PpeCreateFieldErrors,
  PpeCreateFormValues,
} from '../../forms/ppe-create/ppe-create-form';

/** Limits shared with BreviERP `CreateCatalogProductRequest`. */
export const ppeCreateLimits = { name: 200, supplierPrice: 10_000_000 } as const;

const httpsMessage = 'Посилання має починатися з https://.';

function isHttpsUrl(value: string, maxLength: number) {
  if (value.length > maxLength) return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export const ppeCodeTakenMessage = (productName: string | null) =>
  `Такий артикул уже є: «${productName ?? 'інший товар'}». Вкажіть інший.`;

/** Every rule of the page «Новий ЗІЗ», required fields included. */
export function validatePpeCreate(values: PpeCreateFormValues): PpeCreateFieldErrors {
  const offer = validatePpeSupplierOffer(values);
  const errors: PpeCreateFieldErrors = {
    supplierSku: offer.supplierSku,
    supplierPrice: offer.supplierPrice,
    unit: offer.unit,
  };
  const name = values.name.trim();
  if (!name) errors.name = 'Вкажіть назву.';
  else if (name.length > ppeCreateLimits.name)
    errors.name = `Не більше ${ppeCreateLimits.name} символів.`;
  const code = values.code.trim();
  if (!code) errors.code = 'Вкажіть артикул на сайті.';
  else if (code.length > productOverviewLimits.code)
    errors.code = `Не більше ${productOverviewLimits.code} символів.`;
  if (values.sectionId === '') errors.sectionId = 'Оберіть розділ.';
  if (!values.unit.trim()) errors.unit = 'Вкажіть одиницю.';
  const siteUrl = values.currentSiteUrl.trim();
  if (siteUrl && !isHttpsUrl(siteUrl, productOverviewLimits.currentSiteUrl))
    errors.currentSiteUrl = httpsMessage;
  if (values.supplierId === '') errors.supplierId = 'Оберіть постачальника зі списку.';
  const supplierUrl = values.supplierUrl.trim();
  if (!supplierUrl) errors.supplierUrl = 'Вкажіть посилання на товар постачальника.';
  else if (!isHttpsUrl(supplierUrl, ppeSupplierOfferLimits.supplierUrl))
    errors.supplierUrl = httpsMessage;
  const price = values.supplierPrice.trim();
  if (!price) errors.supplierPrice = 'Вкажіть ціну постачальника.';
  else if (
    !errors.supplierPrice &&
    Number(price.replace(',', '.')) >= ppeCreateLimits.supplierPrice
  )
    errors.supplierPrice = 'Ціна має бути менше 10 000 000 ₴.';
  if (!values.ruleCode) errors.ruleCode = 'Оберіть правило націнки.';
  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message !== undefined),
  ) as PpeCreateFieldErrors;
}
