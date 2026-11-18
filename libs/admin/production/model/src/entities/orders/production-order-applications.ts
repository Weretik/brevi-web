export type ItemApplicationKind = 'Embroidery' | 'Print';

export const itemApplicationKindLabels: Record<ItemApplicationKind, string> = {
  Embroidery: 'Вишивка',
  Print: 'Друк',
};

export const PRODUCTION_ORDER_MAX_ADDITIONAL_COLORS = 2;
export const PRODUCTION_ORDER_MAX_APPLICATIONS = 10;

/** A saved «Ціна вишивки» calculation to pick for an embroidery; no prices. */
export interface ProductionEmbroideryChoice {
  id: number;
  /** «ВШ-0042». */
  number: string;
  name: string;
  customerName: string | null;
  quantity: number;
  stitchesPerUnit: number;
  hoopLabel: string;
  mockupThumbnailUrl: string | null;
}

export type ProductionEmbroideryMode = 'Garment' | 'Chevron';

/** The linked calculation as it is now, for the workshop. Materials are shown only. */
export interface ProductionEmbroidery extends ProductionEmbroideryChoice {
  mode: ProductionEmbroideryMode;
  hoopings: number;
  /** Флізелін to cut, metres. */
  stabilizerMetres: number | null;
  /** Fabric under the chevrons, metres; null on a garment. */
  fabricMetres: number | null;
  mockupUrl: string | null;
}

export interface ItemApplication {
  kind: ItemApplicationKind;
  place: string | null;
  description: string | null;
  color: string | null;
  embroideryCalculationId: number | null;
  /** «ВШ-0042», kept even when the calculation was removed. */
  embroideryNumber: string | null;
  /** Null when there is none or it was removed. */
  embroidery: ProductionEmbroidery | null;
}

/** An application as the save body sends it. */
export interface ItemApplicationInput {
  kind: ItemApplicationKind;
  place: string | null;
  description: string | null;
  color: string | null;
  embroideryCalculationId: number | null;
}
