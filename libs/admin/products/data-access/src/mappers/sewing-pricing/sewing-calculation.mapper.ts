import { ensurePricing } from '../../validators/pricing/pricing-values';
import { validateSewingCalculation } from '../../validators/sewing-pricing/validate-sewing-calculation';

import type { SewingCostKind, SewingPriceCalculation } from '@admin/products/model';

const costKinds: SewingCostKind[] = [
  'materials',
  'otherCosts',
  'seamstress',
  'cutting',
  'master',
  'manager',
  'bonus',
  'overhead',
];

export function mapSewingCalculation(
  value: unknown,
  scope: { productId: number; articleId: number; calculationId?: string; requestId?: string },
): SewingPriceCalculation {
  const dto = validateSewingCalculation(value);
  const snapshot = dto.snapshot;
  ensurePricing(
    snapshot.productId === scope.productId &&
      snapshot.articleId === scope.articleId &&
      (!scope.calculationId || dto.id === scope.calculationId) &&
      (!scope.requestId || dto.requestId === scope.requestId),
  );
  const calculation = snapshot.calculation;
  const cost = calculation.breakdown;
  return {
    id: dto.id,
    productId: snapshot.productId,
    articleId: snapshot.articleId,
    saleSku: snapshot.saleSku,
    createdAt: dto.createdAt,
    compositionVersion: snapshot.compositionVersion,
    settingsVersionId: snapshot.settingsVersionId,
    settingsRevision: snapshot.settings?.revision ?? null,
    referenceVersionIds: [...snapshot.referenceVersionIds],
    calculated: calculation.isCalculated,
    costs: cost ? costKinds.map((kind) => ({ kind, amount: cost[kind] })) : [],
    minutes: cost?.totalMinutes ?? null,
    minuteCost: cost?.minuteCost ?? null,
    fullCost: cost?.fullCost ?? null,
    prices: calculation.prices
      ? {
          retail: calculation.prices.retail,
          wholesale: calculation.prices.wholesale,
          largeWholesale: calculation.prices.largeWholesale,
        }
      : null,
    blockers: calculation.blockers.map((item) => ({ code: item.code, inputKey: item.inputKey })),
  };
}
