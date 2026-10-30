import type { CustomConfiguration } from '../../entities/custom-sewing/custom-configuration';
import type { CustomTemplateSelections } from '../../entities/custom-templates/custom-template-selections';

export function templateSelections(value: CustomConfiguration): CustomTemplateSelections {
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
