import { Component, effect, input, model, signal } from '@angular/core';
import { FieldTree, FormField, FormRoot, form } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';

import type {
  GarmentPartDialogDraft,
  GarmentPartDialogFieldName,
  GarmentPartDialogSaveHandler,
} from './garment-part-dialog.models';
import type { ReferenceDialogMode } from '@admin/util';

type GarmentPartDialogFieldKey = Exclude<GarmentPartDialogFieldName, 'root'>;

const EMPTY_GARMENT_PART_DRAFT: GarmentPartDialogDraft = {
  id: 0,
  name: '',
};

@Component({
  selector: 'lib-garment-part-dialog',
  standalone: true,
  imports: [ButtonModule, DrawerModule, FormField, FormRoot, InputTextModule],
  templateUrl: './garment-part-dialog.component.html',
})
export class GarmentPartDialogComponent {
  protected readonly emptyValue = '—';

  readonly visible = model(false);
  readonly mode = model<ReferenceDialogMode>('create');
  readonly draft = input<GarmentPartDialogDraft>(EMPTY_GARMENT_PART_DRAFT);
  readonly saveDraft = input.required<GarmentPartDialogSaveHandler>();
  readonly garmentPartModel = signal<GarmentPartDialogDraft>({ ...EMPTY_GARMENT_PART_DRAFT });
  readonly garmentPartForm: FieldTree<GarmentPartDialogDraft> = form(this.garmentPartModel);
  readonly serverFieldErrors = signal<Record<string, string[]>>({});
  readonly isSaving = signal(false);

  constructor() {
    effect(() => {
      this.garmentPartModel.set({ ...this.draft() });
    });
  }

  protected get isViewMode(): boolean {
    return this.mode() === 'view';
  }

  protected get header(): string {
    if (this.mode() === 'view') {
      return 'Перегляд деталі';
    }

    if (this.mode() === 'edit') {
      return 'Редагування деталі';
    }

    return 'Нова деталь';
  }

  protected get title(): string {
    return this.garmentPartModel().name.trim() || 'Деталь';
  }

  protected get initials(): string {
    return this.title.charAt(0).toUpperCase();
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
      const result = await this.saveDraft()({ ...this.garmentPartModel() });

      if (!result.success) {
        this.serverFieldErrors.set(result.fieldErrors);
      }
    } finally {
      this.isSaving.set(false);
    }
  }

  protected fieldServerErrors(field: GarmentPartDialogFieldKey): string[] {
    const fieldErrors = this.serverFieldErrors();
    const requestField = `Request.${field.charAt(0).toUpperCase()}${field.slice(1)}`;

    return fieldErrors[field] ?? fieldErrors[requestField] ?? [];
  }

  protected rootServerErrors(): string[] {
    return this.serverFieldErrors()['root'] ?? [];
  }
}
