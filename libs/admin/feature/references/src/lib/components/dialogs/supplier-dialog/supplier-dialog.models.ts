import type {
  ReferenceDialogSaveHandler,
  ReferenceDialogSaveResult,
} from '../reference-dialog-save.models';
import type { ReferenceDialogMode } from '@admin/util';

export interface SupplierDialogDraft {
  id: number;
  name: string;
  link: string;
  contactPerson: string;
  phoneNumber: string;
  notes: string;
}

export type SupplierDialogMode = ReferenceDialogMode;

export type SupplierDialogFieldName =
  'id' | 'name' | 'link' | 'contactPerson' | 'phoneNumber' | 'notes' | 'root';

export type SupplierDialogSaveResult = ReferenceDialogSaveResult;

export type SupplierDialogSaveHandler = ReferenceDialogSaveHandler<SupplierDialogDraft>;
