import type {
  ReferenceDialogSaveHandler,
  ReferenceDialogSaveResult,
} from '../reference-dialog-save.models';

export interface AdditionalReferenceDialogDraft {
  id: number;
  name: string;
  key: string;
  value: number | null;
  unit: string;
  description: string;
}

export interface AdditionalReferenceDialogData {
  mode: 'create' | 'edit';
  draft: AdditionalReferenceDialogDraft;
  saveDraft: AdditionalReferenceDialogSaveHandler;
}

export type AdditionalReferenceDialogFieldName =
  'id' | 'name' | 'key' | 'value' | 'unit' | 'description' | 'root';

export type AdditionalReferenceDialogSaveResult = ReferenceDialogSaveResult;

export type AdditionalReferenceDialogSaveHandler =
  ReferenceDialogSaveHandler<AdditionalReferenceDialogDraft>;
