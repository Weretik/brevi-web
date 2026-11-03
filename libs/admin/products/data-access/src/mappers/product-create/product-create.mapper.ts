import {
  validateCreatedCatalogProduct,
  validatePpePricePreview,
  validateProductCodeCheck,
} from '../../validators/product-create/validate-product-create';

import type { CreateCatalogProductBody } from '../../contracts/product-create/product-create.dto';
import type {
  CreateCatalogProductInput,
  CreatedCatalogProduct,
  PpePricePreview,
  ProductCodeCheck,
} from '@admin/products/model';

export const toCreateCatalogProductBody = (
  input: CreateCatalogProductInput,
): CreateCatalogProductBody => ({ ...input, ppe: input.ppe ? { ...input.ppe } : null });

export function mapCreatedCatalogProduct(value: unknown): CreatedCatalogProduct {
  const dto = validateCreatedCatalogProduct(value);
  return { id: dto.id, type: dto.type, code: dto.code, priceSaved: dto.priceSaved };
}

export function mapProductCodeCheck(value: unknown): ProductCodeCheck {
  const dto = validateProductCodeCheck(value);
  return {
    code: dto.code,
    isAvailable: dto.isAvailable,
    takenByProductId: dto.takenByProductId,
    takenByProductName: dto.takenByProductName,
    suggestedCode: dto.suggestedCode,
  };
}

export function mapPpePricePreview(value: unknown): PpePricePreview {
  const dto = validatePpePricePreview(value);
  return {
    prices: dto.prices
      ? {
          retail: dto.prices.retail,
          wholesale: dto.prices.wholesale,
          largeWholesale: dto.prices.largeWholesale,
        }
      : null,
    blockers: dto.blockers.map((blocker) => blocker.code),
  };
}
