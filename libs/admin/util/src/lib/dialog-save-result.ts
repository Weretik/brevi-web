import { mapToApiError } from '@shared/util';

import type { DialogFieldErrors, DialogSaveResult } from './dialog-save.models';

export const dialogSaveSuccess = (): DialogSaveResult => ({ success: true });

export const dialogSaveFailure = (fieldErrors: DialogFieldErrors = {}): DialogSaveResult => ({
  success: false,
  fieldErrors,
});

export const mapValidationSaveError = (error: unknown): DialogSaveResult | null => {
  const apiError = mapToApiError(error);

  if (apiError.code !== 'Validation' || !apiError.fieldErrors) {
    return null;
  }

  return dialogSaveFailure(apiError.fieldErrors);
};
