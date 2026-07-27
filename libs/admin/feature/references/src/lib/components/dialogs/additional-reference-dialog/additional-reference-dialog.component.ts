import { Component, inject, signal } from '@angular/core';
import { FieldTree, FormField, FormRoot, form } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';

import type {
  AdditionalReferenceDialogData,
  AdditionalReferenceDialogDraft,
  AdditionalReferenceDialogFieldName,
} from './additional-reference-dialog.models';

type AdditionalReferenceDialogFieldKey = Exclude<AdditionalReferenceDialogFieldName, 'root'>;

const EMPTY_ADDITIONAL_REFERENCE_DRAFT: AdditionalReferenceDialogDraft = {
  id: 0,
  name: '',
  key: '',
  value: null,
  unit: '',
  description: '',
};

@Component({
  selector: 'lib-additional-reference-dialog',
  standalone: true,
  imports: [ButtonModule, FormField, FormRoot, InputTextModule],
  templateUrl: './additional-reference-dialog.component.html',
})
export class AdditionalReferenceDialogComponent {
  private readonly ref = inject(DynamicDialogRef);
  protected readonly config = inject(DynamicDialogConfig) as DynamicDialogConfig & {
    data: AdditionalReferenceDialogData;
  };

  readonly additionalReferenceModel = signal<AdditionalReferenceDialogDraft>({
    ...EMPTY_ADDITIONAL_REFERENCE_DRAFT,
    ...this.config.data.draft,
  });
  readonly additionalReferenceForm: FieldTree<AdditionalReferenceDialogDraft> = form(
    this.additionalReferenceModel,
  );
  readonly serverFieldErrors = signal<Record<string, string[]>>({});
  readonly isSaving = signal(false);

  protected readonly isEditMode = this.config.data.mode === 'edit';

  protected cancel(): void {
    this.ref.close(null);
  }

  protected async save(): Promise<void> {
    if (this.isSaving()) {
      return;
    }

    this.serverFieldErrors.set({});
    this.isSaving.set(true);

    const draft = this.additionalReferenceModel();

    try {
      const result = await this.config.data.saveDraft({
        ...draft,
        value: Number(draft.value),
      });

      if (result.success) {
        this.ref.close(null);
        return;
      }

      this.serverFieldErrors.set(result.fieldErrors);
    } finally {
      this.isSaving.set(false);
    }
  }

  protected fieldServerErrors(field: AdditionalReferenceDialogFieldKey): string[] {
    const fieldErrors = this.serverFieldErrors();
    const requestField = `Request.${field.charAt(0).toUpperCase()}${field.slice(1)}`;

    return fieldErrors[field] ?? fieldErrors[requestField] ?? [];
  }

  protected rootServerErrors(): string[] {
    return this.serverFieldErrors()['root'] ?? [];
  }
}
