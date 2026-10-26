import {
  applySewingMaterialUpdate,
  applySewingOperationUpdate,
  emptySewingMaterial,
  emptySewingOperation,
  validateSewingMaterials,
  validateSewingOperations,
  validateSewingLookupReferences,
} from '@admin/products/model';
import { useRef, useState } from 'react';

import type { SewingCompositionEditorProps } from '../../forms/sewing-composition/sewing-composition-editor-props';
import type { SewingMaterialDraft, SewingOperationDraft } from '@admin/products/model';

type FormInputs = Pick<
  SewingCompositionEditorProps,
  | 'scope'
  | 'materials'
  | 'operations'
  | 'lookups'
  | 'errors'
  | 'onMaterialsChange'
  | 'onOperationsChange'
  | 'onSave'
>;

export function useSewingCompositionForm({
  scope,
  materials,
  operations,
  lookups,
  errors = {},
  onMaterialsChange,
  onOperationsChange,
  onSave,
}: FormInputs) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const nextKey = useRef(0);

  const materialsPath = scope === 'Model' ? 'modelMaterials' : 'articleMaterials';
  const materialError = (index: number, field: string) =>
    localErrors[`${materialsPath}.${index}.${field}`] ??
    errors[`${materialsPath}.${index}.${field}`];
  const operationError = (index: number, field: string) =>
    localErrors[`operations.${index}.${field}`] ?? errors[`operations.${index}.${field}`];
  const updateMaterial = (index: number, update: Partial<SewingMaterialDraft>) =>
    onMaterialsChange(
      materials.map((item, position) =>
        position === index ? applySewingMaterialUpdate(item, update) : item,
      ),
    );
  const updateOperation = (index: number, update: Partial<SewingOperationDraft>) =>
    onOperationsChange(
      operations.map((item, position) =>
        position === index ? applySewingOperationUpdate(item, update) : item,
      ),
    );
  const validate = () => {
    const nextErrors = {
      ...validateSewingMaterials(materials, scope),
      ...(scope === 'Model' ? validateSewingOperations(operations) : {}),
      ...validateSewingLookupReferences(materials, operations, scope, {
        fabrics: lookups.fabrics.map((item) => item.id),
        accessories: lookups.accessories.map((item) => item.id),
        operations: lookups.operations.map((item) => item.id),
      }),
    };
    setLocalErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onSave();
  };
  const addMaterial = () => {
    const key = `new-material-${nextKey.current++}`;
    onMaterialsChange([...materials, emptySewingMaterial('Fabric', key, materials.length)]);
  };
  const addOperation = () => {
    const key = `new-operation-${nextKey.current++}`;
    onOperationsChange([...operations, emptySewingOperation(key, operations.length)]);
  };

  return {
    materialError,
    operationError,
    updateMaterial,
    updateOperation,
    validate,
    addMaterial,
    addOperation,
  };
}
