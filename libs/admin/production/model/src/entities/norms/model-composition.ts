/** Units of a «Товари» composition line. */
export type CompositionUnit = 'Metre' | 'Piece' | 'Service' | 'Kilogram';

export type CompositionLineKind = 'Fabric' | 'Accessory' | 'OtherCost';

/** Lining, insulation or fleece of a model: the materials besides the top fabric. */
export interface ModelLayer {
  purpose: string;
  code: string | null;
  name: string | null;
  quantity: number;
  unit: CompositionUnit;
}

/** A line of the full composition from «Товари»; `article` is the sale SKU of a fabric variant. */
export interface ModelCompositionLine {
  kind: CompositionLineKind;
  article: string | null;
  code: string | null;
  name: string | null;
  quantity: number;
  unit: CompositionUnit;
  comment: string | null;
}

/** A block of «Комплектація моделей»; read-only, edited in the model card of «Товари». */
export interface ModelComposition {
  modelCode: string;
  modelName: string;
  productId: number | null;
  season: string | null;
  modelIsActive: boolean;
  layers: ModelLayer[];
  lines: ModelCompositionLine[];
}

export const compositionUnits = [
  'Metre',
  'Piece',
  'Service',
  'Kilogram',
] as const satisfies readonly CompositionUnit[];
export const compositionLineKinds = [
  'Fabric',
  'Accessory',
  'OtherCost',
] as const satisfies readonly CompositionLineKind[];

export const compositionUnitLabels: Record<CompositionUnit, string> = {
  Metre: 'м',
  Piece: 'шт.',
  Service: 'послуга',
  Kilogram: 'кг',
};

export const compositionLineKindLabels: Record<CompositionLineKind, string> = {
  Fabric: 'Тканина',
  Accessory: 'Фурнітура',
  OtherCost: 'Інше',
};
