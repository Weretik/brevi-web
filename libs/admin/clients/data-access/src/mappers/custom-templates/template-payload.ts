import type { CustomTemplateSelections } from '@admin/clients/model';
import type { operations } from '@admin/shared/contracts';

type Selections =
  operations['createCrmQuoteTemplate']['requestBody']['content']['application/json']['selections'];
export function templatePayload(value: CustomTemplateSelections): Selections {
  return {
    name: value.name,
    productType: value.productType,
    season: value.season,
    description: value.description,
    clientComment: value.clientComment,
    fabrics: value.fabrics.map(({ referenceId, quantity, unit }) => ({
      referenceId,
      quantity,
      unit,
    })),
    accessories: value.accessories.map(({ referenceId, quantity, unit }) => ({
      referenceId,
      quantity,
      unit,
    })),
    operations: value.operations.map(({ referenceId, quantity, manualMinutes }) => ({
      referenceId,
      quantity,
      manualMinutes,
    })),
    applications: value.applications.map(({ kind, location }) => ({ kind, location })),
  };
}
