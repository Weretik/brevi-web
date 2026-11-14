import type {
  SewingMaterialKind,
  SewingMaterialUnit,
} from '../../entities/sewing-composition/composition/sewing-composition';

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
