import { isAdminApiError } from '@admin/shared/api-client';

export function pricingErrorMessage(error: unknown, fallback: string): string {
  return isAdminApiError(error) ? error.message : fallback;
}
