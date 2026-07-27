import type {
  ReferenceDialogSaveHandler,
  ReferenceDialogSaveResult,
} from '../reference-dialog-save.models';

export interface GarmentPartOperationDialogDraft {
  id: number;
  garmentPartName: string;
  name: string;
  min: number | null;
}

export type GarmentPartOperationDialogFieldName =
  'id' | 'garmentPartName' | 'name' | 'min' | 'root';

export type GarmentPartOperationDialogSaveResult = ReferenceDialogSaveResult;

export type GarmentPartOperationDialogSaveHandler =
  ReferenceDialogSaveHandler<GarmentPartOperationDialogDraft>;
