import type { SewingCardMaterial } from '../../entities/sewing-card/sewing-article-summary';
import type { SewingMaterialKind, SewingMaterialUnit } from '../../entities/sewing-composition';

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

/** Draft key of a saved shared line; the side panel edits the draft line with the same key. */
export const sewingMaterialKey = (id: number) => `material-${id}`;
export const sewingOperationKey = (id: number) => `operation-${id}`;

/** Rows of the shared composition with the reference names and prices from the card response. */
export function sewingMaterialLines(
  materials: readonly SewingCardMaterial[],
): SewingMaterialLine[] {
  return [...materials]
    .sort((left, right) => left.sortOrder - right.sortOrder || left.id - right.id)
    .map((material) => ({
      key: sewingMaterialKey(material.id),
      kind: material.kind,
      kindLabel: sewingMaterialKindLabels[material.kind],
      name:
        material.kind === 'OtherCost'
          ? (material.costCode ?? '—')
          : (material.name ?? `${sewingMaterialKindLabels[material.kind]} ${material.referenceId}`),
      quantity: material.quantity,
      unitLabel: sewingMaterialUnitLabels[material.unit],
      price: material.unitPrice,
      total: material.unitPrice === null ? null : material.unitPrice * material.quantity,
      comment: material.comment,
    }));
}
