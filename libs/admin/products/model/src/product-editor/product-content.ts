export interface ProductInformationBlock {
  titleUk: string;
  titleRu: string;
  textUk: string;
  textRu: string;
  sortOrder: number;
}

export interface ProductCharacteristicRow {
  labelUk: string;
  labelRu: string;
  valueUk: string;
  valueRu: string;
  sortOrder: number;
}

export interface ProductCharacteristicTable {
  titleUk: string;
  titleRu: string;
  sortOrder: number;
  rows: ProductCharacteristicRow[];
}
