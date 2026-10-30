import type { CustomConfiguration } from '../../entities/custom-sewing/custom-configuration';
import type { CustomSuggestions } from '../../entities/custom-suggestions/custom-suggestions';

export function applyCustomSuggestions(
  configuration: CustomConfiguration,
  suggestions: CustomSuggestions,
): CustomConfiguration {
  if (
    configuration.productType !== suggestions.productType ||
    configuration.season !== suggestions.season ||
    suggestions.sourceLimitReached ||
    suggestions.sampleSize < 2 ||
    !suggestions.norms.length
  )
    throw new Error('Підказки застарілі або неповні. Оновіть вибір.');
  return {
    ...configuration,
    applications: configuration.applications.map((row) => ({
      ...row,
      artworkFileId: null,
      saleApproved: false,
    })),
    accessories: suggestions.norms
      .filter((row) => row.kind === 'accessory')
      .map(({ referenceId, quantity, unit }) => ({ referenceId, quantity, unit })),
    operations: suggestions.norms
      .filter((row) => row.kind === 'operation')
      .map(({ referenceId, quantity, manualMinutes }) => ({
        referenceId,
        quantity,
        manualMinutes,
      })),
  };
}
