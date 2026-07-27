import { Component, effect, input, model, signal } from '@angular/core';
import { FormField, FormRoot, FieldTree, form } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';

import type {
  SupplierDialogDraft,
  SupplierDialogFieldName,
  SupplierDialogMode,
  SupplierDialogSaveHandler,
} from './supplier-dialog.models';

type SupplierDialogFieldKey = Exclude<SupplierDialogFieldName, 'root'>;

const EMPTY_SUPPLIER_DRAFT: SupplierDialogDraft = {
  id: 0,
  name: '',
  link: '',
  contactPerson: '',
  phoneNumber: '',
  notes: '',
};

@Component({
  selector: 'lib-supplier-dialog',
  standalone: true,
  imports: [ButtonModule, DrawerModule, FormField, FormRoot, InputTextModule],
  templateUrl: './supplier-dialog.component.html',
})
export class SupplierDialogComponent {
  protected readonly notesMaxLength = 500;
  protected readonly emptyValue = '—';

  readonly visible = model(false);
  readonly mode = model<SupplierDialogMode>('create');
  readonly draft = input<SupplierDialogDraft>(EMPTY_SUPPLIER_DRAFT);
  readonly saveDraft = input.required<SupplierDialogSaveHandler>();
  readonly supplierModel = signal<SupplierDialogDraft>({ ...EMPTY_SUPPLIER_DRAFT });
  readonly serverFieldErrors = signal<Record<string, string[]>>({});
  readonly isSaving = signal(false);
  readonly supplierForm: FieldTree<SupplierDialogDraft> = form(this.supplierModel);

  constructor() {
    effect(() => {
      this.supplierModel.set({ ...this.draft() });
    });
  }

  protected get header(): string {
    if (this.mode() === 'view') {
      return 'Перегляд постачальника';
    }

    if (this.mode() === 'edit') {
      return 'Редагування постачальника';
    }

    return 'Нова позиція';
  }

  protected get isViewMode(): boolean {
    return this.mode() === 'view';
  }

  protected get supplierName(): string {
    return this.supplierModel().name.trim() || 'Постачальник';
  }

  protected get supplierInitials(): string {
    return this.supplierName.charAt(0).toUpperCase();
  }

  protected get supplierLink(): string {
    return this.supplierModel().link.trim();
  }

  protected get supplierLinkHref(): string | null {
    if (!this.supplierLink) {
      return null;
    }

    return /^https?:\/\//i.test(this.supplierLink)
      ? this.supplierLink
      : `https://${this.supplierLink}`;
  }

  protected close(): void {
    this.visible.set(false);
  }

  protected enableEditing(): void {
    this.mode.set('edit');
  }

  protected async save(): Promise<void> {
    if (this.mode() === 'view' || this.isSaving()) {
      return;
    }

    this.serverFieldErrors.set({});
    this.isSaving.set(true);

    try {
      const result = await this.saveDraft()({ ...this.supplierModel() });

      if (!result.success) {
        this.serverFieldErrors.set(result.fieldErrors);
      }
    } finally {
      this.isSaving.set(false);
    }
  }

  protected fieldServerErrors(field: SupplierDialogFieldKey): string[] {
    const fieldErrors = this.serverFieldErrors();
    const requestField = `Request.${field.charAt(0).toUpperCase()}${field.slice(1)}`;

    return fieldErrors[field] ?? fieldErrors[requestField] ?? [];
  }

  protected rootServerErrors(): string[] {
    return this.serverFieldErrors()['root'] ?? [];
  }
}
