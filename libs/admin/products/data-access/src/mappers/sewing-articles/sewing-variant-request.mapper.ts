import type { SewingVariantInput } from '@admin/products/model';
import type { operations } from '@admin/shared/contracts';

export function mapCreateSewingArticleRequest(
  input: SewingVariantInput,
): operations['createSewingArticle']['requestBody']['content']['application/json'] {
  return {
    saleSku: input.saleSku,
    active: input.active,
    sortOrder: input.sortOrder,
    fabricId: input.fabricId,
    fabricQuantity: input.fabricQuantity,
    expectedVersion: input.expectedVersion,
  };
}

export function mapUpdateSewingArticleRequest(
  input: SewingVariantInput,
): operations['updateSewingArticle']['requestBody']['content']['application/json'] {
  return {
    saleSku: input.saleSku,
    active: input.active,
    fabricId: input.fabricId,
    fabricQuantity: input.fabricQuantity,
    expectedVersion: input.expectedVersion,
  };
}
