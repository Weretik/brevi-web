import type {
  SewingMaterialDraft,
  SewingMaterialKind,
  SewingMaterialUnit,
} from '../../entities/sewing-composition';

interface PricedLookup {
  id: number;
  name: string;
  price: number;
}

/** One row of «Комплектація», as the sheet «Комплектація виробів». */
export interface SewingMaterialLine {
  key: string;
  kind: SewingMaterialKind;
  kindLabel: string;
  name: string;
  quantity: number;
  unitLabel: string;
  /** Price of one unit from the reference; null for other costs and unknown references. */
  price: number | null;
  /** Price times quantity; null when the price is unknown. */
  total: number | null;
  comment: string;
}

export const sewingMaterialKindLabels: Record<SewingMaterialKind, string> = {
  Fabric: 'Тканина',
  Accessory: 'Фурнітура',
  OtherCost: 'Інша витрата',
};

export const sewingMaterialUnitLabels: Record<SewingMaterialUnit, string> = {
  Metre: 'м',
  Piece: 'шт.',
  Service: 'послуга',
  Kilogram: 'кг',
};

/** Rows of the shared composition with reference names and prices. */
export function sewingMaterialLines(
  materials: readonly SewingMaterialDraft[],
  fabrics: readonly PricedLookup[],
  accessories: readonly PricedLookup[],
): SewingMaterialLine[] {
  return materials.map((material) => {
    const source = material.kind === 'Fabric' ? fabrics : accessories;
    const lookup =
      material.kind === 'OtherCost'
        ? undefined
        : source.find((item) => item.id === material.referenceId);
    const price = lookup?.price ?? null;
    return {
      key: material.clientId,
      kind: material.kind,
      kindLabel: sewingMaterialKindLabels[material.kind],
      name:
        material.kind === 'OtherCost'
          ? (material.costCode ?? '—')
          : (lookup?.name ?? `${sewingMaterialKindLabels[material.kind]} ${material.referenceId}`),
      quantity: material.quantity,
      unitLabel: sewingMaterialUnitLabels[material.unit],
      price,
      total: price === null ? null : price * material.quantity,
      comment: material.comment,
    };
  });
}
