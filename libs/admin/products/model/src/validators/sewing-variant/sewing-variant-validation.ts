import { parseSewingMetres } from '../../forms/sewing-variant/sewing-variant-form';

import type {
  SewingVariantFieldErrors,
  SewingVariantFormValues,
} from '../../forms/sewing-variant/sewing-variant-form';

/** Rules of the «Тканина» panel; `otherSkus` are the sale SKUs of the model's other variants. */
export function validateSewingVariant(
  values: SewingVariantFormValues,
  otherSkus: readonly string[],
): SewingVariantFieldErrors {
  const errors: SewingVariantFieldErrors = {};
  if (!values.fabricId) errors.fabricId = 'Оберіть тканину.';
  const quantity = parseSewingMetres(values.fabricQuantity);
  if (!Number.isFinite(quantity) || quantity <= 0 || quantity > 1000)
    errors.fabricQuantity = 'Вкажіть розхід від 0 до 1000 м.';
  else if (Math.round(quantity * 1e6) / 1e6 !== quantity)
    errors.fabricQuantity = 'Не більше шести знаків після коми.';
  const sku = values.saleSku.trim();
  if (!sku) errors.saleSku = 'Вкажіть артикул для сайту.';
  else if (sku.length > 80) errors.saleSku = 'Не більше 80 символів.';
  else if (otherSkus.includes(sku)) errors.saleSku = 'Такий артикул уже є в моделі.';
  return errors;
}
