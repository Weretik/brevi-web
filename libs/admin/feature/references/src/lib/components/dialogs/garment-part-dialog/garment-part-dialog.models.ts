import type {
  ReferenceDialogSaveHandler,
  ReferenceDialogSaveResult,
} from '../reference-dialog-save.models';

export interface GarmentPartDialogDraft {
  id: number;
  name: string;
}

export type GarmentPartDialogFieldName = 'id' | 'name' | 'root';

export type GarmentPartDialogSaveResult = ReferenceDialogSaveResult;

export type GarmentPartDialogSaveHandler = ReferenceDialogSaveHandler<GarmentPartDialogDraft>;
