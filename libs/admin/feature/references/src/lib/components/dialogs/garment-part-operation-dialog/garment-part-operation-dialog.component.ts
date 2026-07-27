import { Component, effect, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import type {
  GarmentPartOperationDialogDraft,
  GarmentPartOperationDialogFieldName,
  GarmentPartOperationDialogSaveHandler,
} from './garment-part-operation-dialog.models';
import type { GarmentPartSelectOption, ReferenceDialogMode } from '@admin/util';

type GarmentPartOperationDialogFieldKey = Exclude<GarmentPartOperationDialogFieldName, 'root'>;

const EMPTY_GARMENT_PART_OPERATION_DRAFT: GarmentPartOperationDialogDraft = {
  id: 0,
  garmentPartName: '',
  name: '',
  min: null,
};

@Component({
  selector: 'lib-garment-part-operation-dialog',
  standalone: true,
  imports: [ButtonModule, DrawerModule, FormsModule, InputTextModule, SelectModule],
  templateUrl: './garment-part-operation-dialog.component.html',
})
export class GarmentPartOperationDialogComponent {
  protected readonly emptyValue = '—';
  protected draftState: GarmentPartOperationDialogDraft = { ...EMPTY_GARMENT_PART_OPERATION_DRAFT };

  readonly visible = model(false);
  readonly mode = model<ReferenceDialogMode>('create');
  readonly draft = input<GarmentPartOperationDialogDraft>(EMPTY_GARMENT_PART_OPERATION_DRAFT);
  readonly garmentParts = input<GarmentPartSelectOption[]>([]);
  readonly saveDraft = input.required<GarmentPartOperationDialogSaveHandler>();
  readonly serverFieldErrors = signal<Record<string, string[]>>({});
  readonly isSaving = signal(false);

  constructor() {
    effect(() => {
      this.draftState = { ...this.draft() };
    });
  }

  protected get isViewMode(): boolean {
    return this.mode() === 'view';
  }

  protected get header(): string {
    if (this.mode() === 'view') {
      return 'Перегляд роботи';
    }

    if (this.mode() === 'edit') {
      return 'Редагування роботи';
    }

    return 'Нова робота';
  }

  protected get title(): string {
    return this.draftState.name.trim() || 'Робота';
  }

  protected get initials(): string {
    return this.title.charAt(0).toUpperCase();
  }

  protected get selectedGarmentPartName(): string {
    return (
      this.garmentParts().find((item) => item.name === this.draftState.garmentPartName)?.name ??
      this.draftState.garmentPartName.trim() ??
      this.emptyValue
    );
  }

  protected close(): void {
    this.visible.set(false);
  }

  protected enableEditing(): void {
    this.mode.set('edit');
  }

  protected async submit(): Promise<void> {
    if (this.mode() === 'view' || this.isSaving()) {
      return;
    }

    this.serverFieldErrors.set({});
    this.isSaving.set(true);

    try {
      const result = await this.saveDraft()({ ...this.draftState });

      if (!result.success) {
        this.serverFieldErrors.set(result.fieldErrors);
      }
    } finally {
      this.isSaving.set(false);
    }
  }

  protected fieldServerErrors(field: GarmentPartOperationDialogFieldKey): string[] {
    const fieldErrors = this.serverFieldErrors();
    const requestField = `Request.${field.charAt(0).toUpperCase()}${field.slice(1)}`;

    return fieldErrors[field] ?? fieldErrors[requestField] ?? [];
  }

  protected rootServerErrors(): string[] {
    return this.serverFieldErrors()['root'] ?? [];
  }
}
