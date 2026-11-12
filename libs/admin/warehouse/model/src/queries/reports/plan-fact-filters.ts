import type { PlanFactModel, PlanFactSummary } from '../../entities/reports/stock-reports';

const squash = (value: string) => value.normalize('NFC').toLocaleLowerCase('uk-UA').trim();

/** Overspending above this many per cent of the plan is marked red; below it is only a number. */
export const PLAN_FACT_OVERRUN_PERCENT = 5;

/** «План і факт» chips; only problems get their own chip. */
export const planFactViews = ['all', 'overrun', 'uncomparable'] as const;
export type PlanFactView = (typeof planFactViews)[number];

export const planFactViewLabels: Record<PlanFactView, string> = {
  all: 'Усі',
  overrun: `Перевитрата понад ${PLAN_FACT_OVERRUN_PERCENT}%`,
  uncomparable: 'Не порівняти',
};

/** Fact against plan per product, in per cent; null when it cannot be compared. */
export function planFactDeviation(summary: PlanFactSummary): number | null {
  if (summary.differencePerProduct === null || !summary.planPerProduct) return null;
  return (summary.differencePerProduct / summary.planPerProduct) * 100;
}

/** Overspending worth a look: above {@link PLAN_FACT_OVERRUN_PERCENT}. */
export const isPlanFactOverrun = (summary: PlanFactSummary) => {
  const deviation = planFactDeviation(summary);
  return deviation !== null && deviation > PLAN_FACT_OVERRUN_PERCENT;
};

const isUncomparable = (summary: PlanFactSummary) => planFactDeviation(summary) === null;

export const planFactViewCounts = (
  models: readonly PlanFactModel[],
): Record<PlanFactView, number> => ({
  all: models.length,
  overrun: models.filter((x) => isPlanFactOverrun(x.summary)).length,
  uncomparable: models.filter((x) => isUncomparable(x.summary)).length,
});

/** A model found by its name or code, a client, or a planned or issued fabric or colour. */
const matches = (model: PlanFactModel, term: string) =>
  [model.modelName, model.modelCode ?? ''].some((x) => squash(x).includes(term)) ||
  model.items.some(
    (item) =>
      squash(item.clientName).includes(term) ||
      String(item.orderNumber) === term ||
      item.materials.some((m) =>
        [m.planFabricCode, m.planFabricName, m.planColor, ...m.used].some(
          (x) => x !== null && squash(x).includes(term),
        ),
      ),
  );

/**
 * Models of a chip found by the search, the largest overspending first; models that cannot be compared last, by
 * name.
 */
export function filterPlanFact(
  models: readonly PlanFactModel[],
  view: PlanFactView,
  search: string,
): PlanFactModel[] {
  const term = squash(search).replace(/^(ц-|№)\s*/u, '');
  return models
    .filter(
      (model) =>
        (view === 'all' ||
          (view === 'overrun'
            ? isPlanFactOverrun(model.summary)
            : isUncomparable(model.summary))) &&
        (!term || matches(model, term)),
    )
    .sort((a, b) => {
      const x = planFactDeviation(a.summary);
      const y = planFactDeviation(b.summary);
      if (x === null || y === null)
        return (
          (x === null ? 1 : 0) - (y === null ? 1 : 0) ||
          a.modelName.localeCompare(b.modelName, 'uk')
        );
      return y - x;
    });
}
