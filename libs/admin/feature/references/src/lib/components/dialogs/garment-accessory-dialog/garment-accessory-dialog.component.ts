import { Component, effect, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormField, FormRoot, FieldTree, form } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import type {
  GarmentAccessoryDialogDraft,
  GarmentAccessoryDialogFieldName,
  GarmentAccessoryDialogSaveHandler,
} from './garment-accessory-dialog.models';
import type { ReferenceDialogMode, SupplierSelectOption } from '@admin/util';

type GarmentAccessoryDialogFieldKey = Exclude<GarmentAccessoryDialogFieldName, 'root'>;

const EMPTY_GARMENT_ACCESSORY_DRAFT: GarmentAccessoryDialogDraft = {
  id: 0,
  name: '',
  price: null,
  supplierId: 0,
  supplierName: '',
};

@Component({
  selector: 'lib-garment-accessory-dialog',
  standalone: true,
  imports: [
    ButtonModule,
    DrawerModule,
    FormField,
    FormRoot,
    FormsModule,
    InputTextModule,
    SelectModule,
  ],
  templateUrl: './garment-accessory-dialog.component.html',
})
export class GarmentAccessoryDialogComponent {
  protected readonly emptyValue = '—';

  readonly visible = model(false);
  readonly mode = model<ReferenceDialogMode>('create');
  readonly draft = input<GarmentAccessoryDialogDraft>(EMPTY_GARMENT_ACCESSORY_DRAFT);
  readonly suppliers = input<SupplierSelectOption[]>([]);
  readonly saveDraft = input.required<GarmentAccessoryDialogSaveHandler>();
  readonly accessoryModel = signal<GarmentAccessoryDialogDraft>({
    ...EMPTY_GARMENT_ACCESSORY_DRAFT,
  });
  readonly serverFieldErrors = signal<Record<string, string[]>>({});
  readonly isSaving = signal(false);
  readonly accessoryForm: FieldTree<GarmentAccessoryDialogDraft> = form(this.accessoryModel);

  constructor() {
    effect(() => {
      this.accessoryModel.set({ ...this.draft() });
    });
  }

  protected get isViewMode(): boolean {
    return this.mode() === 'view';
  }

  protected get header(): string {
    if (this.mode() === 'view') {
      return 'Перегляд фурнітури';
    }

    if (this.mode() === 'edit') {
      return 'Редагування фурнітури';
    }

    return 'Нова фурнітура';
  }

  protected get accessoryTitle(): string {
    return this.accessoryModel().name.trim() || 'Фурнітура';
  }

  protected get accessoryInitials(): string {
    return this.accessoryTitle.charAt(0).toUpperCase();
  }

  protected get formattedPrice(): string {
    const value = this.accessoryModel().price ?? 0;

    return `${new Intl.NumberFormat('uk-UA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)} грн`;
  }

  protected get selectedSupplierName(): string {
    const supplierName =
      this.suppliers().find((supplier) => supplier.id === this.accessoryModel().supplierId)?.name ??
      this.accessoryModel().supplierName.trim();

    return supplierName || this.emptyValue;
  }

  protected close(): void {
    this.visible.set(false);
  }

  protected enableEditing(): void {
    this.mode.set('edit');
  }

  protected setSupplierId(supplierId: number): void {
    const supplierName =
      this.suppliers().find((supplier) => supplier.id === supplierId)?.name ?? '';

    this.accessoryModel.update((draft) => ({
      ...draft,
      supplierId,
      supplierName,
    }));
  }

  protected async save(): Promise<void> {
    if (this.mode() === 'view' || this.isSaving()) {
      return;
    }

    this.serverFieldErrors.set({});
    this.isSaving.set(true);

    try {
      const result = await this.saveDraft()({ ...this.accessoryModel() });

      if (!result.success) {
        this.serverFieldErrors.set(result.fieldErrors);
      }
    } finally {
      this.isSaving.set(false);
    }
  }

  protected fieldServerErrors(field: GarmentAccessoryDialogFieldKey): string[] {
    const fieldErrors = this.serverFieldErrors();
    const requestField = `Request.${field.charAt(0).toUpperCase()}${field.slice(1)}`;

    return fieldErrors[field] ?? fieldErrors[requestField] ?? [];
  }

  protected rootServerErrors(): string[] {
    return this.serverFieldErrors()['root'] ?? [];
  }
}
