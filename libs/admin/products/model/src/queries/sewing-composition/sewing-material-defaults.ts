import type {
  SewingMaterialDraft,
  SewingMaterialKind,
  SewingMaterialUnit,
} from '../../entities/sewing-composition';

export function materialUnitForKind(kind: SewingMaterialKind): SewingMaterialUnit {
  switch (kind) {
    case 'Fabric':
      return 'Metre';
    case 'Accessory':
      return 'Piece';
    case 'OtherCost':
      return 'Service';
  }
}
export function emptySewingMaterial(
  kind: SewingMaterialKind,
  clientId: string,
  sortOrder: number,
): SewingMaterialDraft {
  return {
    clientId,
    kind,
    referenceId: null,
    costCode: null,
    quantity: 1,
    unit: materialUnitForKind(kind),
    required: true,
    sortOrder,
    reviewed: false,
  };
}
