import { Component, effect, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormField, FormRoot, FieldTree, form } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import type {
  FabricDialogDraft,
  FabricDialogFieldName,
  FabricDialogSaveHandler,
} from './fabric-dialog.models';
import type { ReferenceDialogMode, SupplierSelectOption } from '@admin/util';

type FabricDialogFieldKey = Exclude<FabricDialogFieldName, 'root'>;

const EMPTY_FABRIC_DRAFT: FabricDialogDraft = {
  id: 0,
  name: '',
  price: null,
  providerName: '',
};

@Component({
  selector: 'lib-fabric-dialog',
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
  templateUrl: './fabric-dialog.component.html',
})
export class FabricDialogComponent {
  protected readonly emptyValue = '—';

  readonly visible = model(false);
  readonly mode = model<ReferenceDialogMode>('create');
  readonly draft = input<FabricDialogDraft>(EMPTY_FABRIC_DRAFT);
  readonly suppliers = input<SupplierSelectOption[]>([]);
  readonly saveDraft = input.required<FabricDialogSaveHandler>();
  readonly fabricModel = signal<FabricDialogDraft>({ ...EMPTY_FABRIC_DRAFT });
  readonly serverFieldErrors = signal<Record<string, string[]>>({});
  readonly isSaving = signal(false);
  readonly fabricForm: FieldTree<FabricDialogDraft> = form(this.fabricModel);

  constructor() {
    effect(() => {
      this.fabricModel.set({ ...this.draft() });
    });
  }

  protected get isViewMode(): boolean {
    return this.mode() === 'view';
  }

  protected get header(): string {
    if (this.mode() === 'view') {
      return 'Перегляд тканини';
    }

    if (this.mode() === 'edit') {
      return 'Редагування тканини';
    }

    return 'Нова тканина';
  }

  protected get fabricTitle(): string {
    return this.fabricModel().name.trim() || 'Тканина';
  }

  protected get fabricInitials(): string {
    return this.fabricTitle.charAt(0).toUpperCase();
  }

  protected get formattedPrice(): string {
    const value = this.fabricModel().price ?? 0;

    return `${new Intl.NumberFormat('uk-UA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)} грн`;
  }

  protected get selectedSupplierName(): string {
    return (
      this.suppliers().find((supplier) => supplier.name === this.fabricModel().providerName)
        ?.name ||
      this.fabricModel().providerName.trim() ||
      this.emptyValue
    );
  }

  protected close(): void {
    this.visible.set(false);
  }

  protected enableEditing(): void {
    this.mode.set('edit');
  }

  protected setProviderName(providerName: string): void {
    this.fabricModel.update((draft) => ({
      ...draft,
      providerName,
    }));
  }

  protected async save(): Promise<void> {
    if (this.mode() === 'view' || this.isSaving()) {
      return;
    }

    this.serverFieldErrors.set({});
    this.isSaving.set(true);

    try {
      const result = await this.saveDraft()({ ...this.fabricModel() });

      if (!result.success) {
        this.serverFieldErrors.set(result.fieldErrors);
      }
    } finally {
      this.isSaving.set(false);
    }
  }

  protected fieldServerErrors(field: FabricDialogFieldKey): string[] {
    const fieldErrors = this.serverFieldErrors();
    const requestField = `Request.${field.charAt(0).toUpperCase()}${field.slice(1)}`;

    return fieldErrors[field] ?? fieldErrors[requestField] ?? [];
  }

  protected rootServerErrors(): string[] {
    return this.serverFieldErrors()['root'] ?? [];
  }
}
