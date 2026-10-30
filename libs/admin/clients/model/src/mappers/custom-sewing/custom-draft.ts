import type { CustomConfiguration } from '../../entities/custom-sewing/custom-configuration';

export function emptyCustomConfiguration(): CustomConfiguration {
  return {
    name: '',
    productType: '',
    season: 'summer',
    description: '',
    clientComment: '',
    internalNote: '',
    fabrics: [],
    accessories: [],
    operations: [],
    applications: [],
    delivery: 0,
    packaging: 0,
  };
}

export function customFabricAlternative(configuration: CustomConfiguration): CustomConfiguration {
  return {
    ...configuration,
    name: `${configuration.name} — інша тканина`.slice(0, 300),
    fabrics: configuration.fabrics.map((row) => ({ ...row })),
    accessories: configuration.accessories.map((row) => ({ ...row })),
    operations: configuration.operations.map((row) => ({ ...row })),
    applications: configuration.applications.map((row) => ({ ...row, artworkFileId: null })),
  };
}
