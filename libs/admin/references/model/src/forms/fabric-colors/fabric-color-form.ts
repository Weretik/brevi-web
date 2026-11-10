import type { FabricColor } from '../../entities/fabric-colors/fabric-color';
import type { FabricColorFormValues } from '../../validators/fabric-colors/fabric-color-validation';

export function createFabricColorFormValues(color: FabricColor | null): FabricColorFormValues {
  return { name: color?.name ?? '', isActive: color?.isActive ?? true };
}

/** Request fields of a create or update. */
export function fabricColorBody(values: FabricColorFormValues, sortOrder: number) {
  return { name: values.name.trim(), isActive: values.isActive, sortOrder };
}
