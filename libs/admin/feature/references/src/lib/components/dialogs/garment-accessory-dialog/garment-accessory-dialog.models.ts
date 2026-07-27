import type {
  ReferenceDialogSaveHandler,
  ReferenceDialogSaveResult,
} from '../reference-dialog-save.models';

export interface GarmentAccessoryDialogDraft {
  id: number;
  name: string;
  price: number | null;
  supplierId: number;
  supplierName: string;
}

export type GarmentAccessoryDialogFieldName = 'id' | 'name' | 'price' | 'supplierName' | 'root';

export type GarmentAccessoryDialogSaveResult = ReferenceDialogSaveResult;

export type GarmentAccessoryDialogSaveHandler =
  ReferenceDialogSaveHandler<GarmentAccessoryDialogDraft>;
