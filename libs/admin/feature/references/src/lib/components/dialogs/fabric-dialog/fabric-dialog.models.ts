import type {
  ReferenceDialogSaveHandler,
  ReferenceDialogSaveResult,
} from '../reference-dialog-save.models';

export interface FabricDialogDraft {
  id: number;
  name: string;
  price: number | null;
  providerName: string;
}

export type FabricDialogFieldName = 'id' | 'name' | 'price' | 'providerName' | 'root';

export type FabricDialogSaveResult = ReferenceDialogSaveResult;

export type FabricDialogSaveHandler = ReferenceDialogSaveHandler<FabricDialogDraft>;
