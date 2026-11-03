import type { GarmentPartOperation } from '../../entities/garment-part-operations/garment-part-operation';
import type { GarmentPartOperationFormValues } from '../../validators/garment-part-operations/garment-part-operation-validation';

export type GarmentPartOperationEditorMode = 'create' | 'view' | 'edit';

export function createGarmentPartOperationFormValues(
  operation: GarmentPartOperation | null,
  nextId: number,
): GarmentPartOperationFormValues {
  return {
    id: String(operation?.id ?? nextId),
    code: operation?.code ?? '',
    garmentPartName: operation?.garmentPartName ?? '',
    element: operation?.element ?? '',
    variant: operation?.variant ?? '',
    name: operation?.name ?? '',
    min: operation && !operation.minutesPerProduct ? String(operation.min) : '',
    minutesPerProduct: operation?.minutesPerProduct ?? false,
    isActive: operation?.isActive ?? true,
    notes: operation?.notes ?? '',
  };
}

const optional = (value: string) => value.trim() || null;

/** Body of the create/update request; the ID goes separately. */
export function garmentPartOperationRequestBody(values: GarmentPartOperationFormValues) {
  return {
    garmentPartName: values.garmentPartName.trim(),
    name: values.name.trim(),
    min: values.minutesPerProduct ? 0 : Number(values.min),
    code: optional(values.code),
    element: optional(values.element),
    variant: optional(values.variant),
    minutesPerProduct: values.minutesPerProduct,
    isActive: values.isActive,
    notes: optional(values.notes),
  };
}
