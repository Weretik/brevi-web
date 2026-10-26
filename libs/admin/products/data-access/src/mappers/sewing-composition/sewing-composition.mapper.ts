import { validateSewingCompositionResponse } from '../../validators/sewing-composition/validate-sewing-composition-response';

import type { SewingCompositionView } from '@admin/products/model';

export function mapSewingComposition(value: unknown): SewingCompositionView {
  const dto = validateSewingCompositionResponse(value);
  return {
    productId: dto.productId,
    articleId: dto.articleId,
    modelCode: dto.modelCode,
    version: dto.version,
    materials: dto.materials.map((line) => ({ ...line })),
    operations: dto.operations.map((line) => ({ ...line })),
    blockers: [...dto.blockers],
  };
}
