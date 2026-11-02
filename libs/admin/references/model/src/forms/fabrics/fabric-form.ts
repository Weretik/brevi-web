import type { Fabric } from '../../entities/fabrics/fabric';
import type { FabricFormValues } from '../../validators/fabrics/fabric-validation';

export type FabricEditorMode = 'create' | 'view' | 'edit';

export function createFabricFormValues(fabric: Fabric | null, nextId: number): FabricFormValues {
  return {
    id: String(fabric?.id ?? nextId),
    code: fabric?.code ?? '',
    name: fabric?.name ?? '',
    nameRu: fabric?.nameRu ?? '',
    providerName: fabric?.providerName ?? '',
    composition: fabric?.composition ?? '',
    compositionRu: fabric?.compositionRu ?? '',
    density: fabric?.density ?? '',
    price: fabric ? String(fabric.price) : '',
    isActive: fabric?.isActive ?? true,
    comment: fabric?.comment ?? '',
    proposalDescription: fabric?.proposalDescription ?? '',
  };
}

/** Suggested КП text from composition and density, as the Calculator sheet builds it. */
export function suggestFabricProposalDescription(values: FabricFormValues): string {
  const parts = [
    values.composition.trim() && `Склад: ${values.composition.trim()}.`,
    values.density.trim() && `Щільність: ${values.density.trim()} г/м².`,
  ];
  return parts.filter(Boolean).join(' ');
}
