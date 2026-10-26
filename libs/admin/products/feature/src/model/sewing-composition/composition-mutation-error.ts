import { adminApiErrorMessage, isAdminApiError } from '@admin/shared/api-client';

import type { CompositionMutationError } from './composition-mutation-error.types';

export function compositionMutationError(
  cause: unknown,
  scope: 'Model' | 'Article',
): CompositionMutationError {
  if (!isAdminApiError(cause)) {
    return {
      message: adminApiErrorMessage(cause, 'Не вдалося зберегти склад.'),
      fieldErrors: {},
      stale: false,
    };
  }

  const fieldErrors: Record<string, string> = {};
  for (const [path, message] of Object.entries(cause.fieldErrors)) {
    const material = /^materials\[(\d+)\]\.(.+)$/.exec(path);
    const operation = /^operations\[(\d+)\]\.(.+)$/.exec(path);
    if (material) {
      const prefix = scope === 'Model' ? 'modelMaterials' : 'articleMaterials';
      fieldErrors[`${prefix}.${material[1]}.${material[2]}`] = message;
    } else if (operation) {
      fieldErrors[`operations.${operation[1]}.${operation[2]}`] = message;
    } else {
      fieldErrors[path] = message;
    }
  }
  return { message: cause.message, fieldErrors, stale: cause.status === 409 };
}
