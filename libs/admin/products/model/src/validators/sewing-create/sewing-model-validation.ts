import { validateProductOverview } from '../product-overview/product-overview-validation';

import type { ProductCodeCheck } from '../../entities/product-create/product-create';
import type {
  SewingModelFieldErrors,
  SewingModelFormValues,
} from '../../forms/sewing-create/sewing-model-form';

export const sewingModelNameLimit = 200;

/** Message for a model code that another product already has. */
export function sewingModelCodeTakenMessage(check: ProductCodeCheck): string {
  return check.takenByProductName
    ? `Код уже має модель «${check.takenByProductName}».`
    : 'Цей код уже зайнятий.';
}

/**
 * Step 1 rules: code, name and section are required; the code must be free when the uniqueness
 * check has answered; the shared «Товари» limits apply to the code, link and quote text.
 */
export function validateSewingModel(
  values: SewingModelFormValues,
  codeCheck: ProductCodeCheck | null = null,
): SewingModelFieldErrors {
  const shared = validateProductOverview(
    { ...values, isActive: false, isVerified: false },
    'Sewing',
  );
  const errors: SewingModelFieldErrors = {
    ...(shared.code ? { code: shared.code } : {}),
    ...(shared.currentSiteUrl ? { currentSiteUrl: shared.currentSiteUrl } : {}),
    ...(shared.quoteDescription ? { quoteDescription: shared.quoteDescription } : {}),
  };
  const code = values.code.trim();
  if (!code) errors.code = 'Вкажіть код моделі.';
  else if (
    !errors.code &&
    codeCheck?.isAvailable === false &&
    codeCheck.code?.trim().toLowerCase() === code.toLowerCase()
  )
    errors.code = sewingModelCodeTakenMessage(codeCheck);
  const name = values.name.trim();
  if (!name) errors.name = 'Вкажіть назву моделі.';
  else if (name.length > sewingModelNameLimit)
    errors.name = `Не більше ${sewingModelNameLimit} символів.`;
  if (values.sectionId === '') errors.sectionId = 'Оберіть розділ.';
  return errors;
}
