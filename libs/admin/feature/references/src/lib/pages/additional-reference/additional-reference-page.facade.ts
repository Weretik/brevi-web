import {
  AdditionalReferencesApi,
  AdditionalReferencesStore,
  type AdditionalReferenceRow,
} from '@admin/data-access';
import { dialogSaveFailure, dialogSaveSuccess, mapValidationSaveError } from '@admin/util';
import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { firstValueFrom } from 'rxjs';

import {
  AdditionalReferenceDialogComponent,
  type AdditionalReferenceDialogData,
  type AdditionalReferenceDialogDraft,
  type AdditionalReferenceDialogSaveResult,
} from '../../components';

@Injectable()
export class AdditionalReferencePageFacade {
  private readonly store = inject(AdditionalReferencesStore);
  private readonly additionalReferencesApi = inject(AdditionalReferencesApi);
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);

  readonly additionalReferences = this.store.additionalReferences;

  async openAdditionalReferenceEditDialog(item: AdditionalReferenceRow): Promise<void> {
    this.openAdditionalReferenceDialog({
      mode: 'edit',
      draft: {
        id: item.id,
        name: item.name,
        key: item.key,
        value: item.value,
        unit: item.unit,
        description: item.description ?? '',
      },
      saveDraft: (draft) => this.updateAdditionalReference(item.id, draft),
    });
  }

  private openAdditionalReferenceDialog(data: AdditionalReferenceDialogData): void {
    this.dialogService.open(AdditionalReferenceDialogComponent, {
      data,
      header: data.mode === 'create' ? 'Нова позиція' : 'Редагування позиції',
      modal: true,
      draggable: false,
      resizable: false,
      width: '36rem',
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
    });
  }

  private async updateAdditionalReference(
    id: number,
    draft: AdditionalReferenceDialogDraft,
  ): Promise<AdditionalReferenceDialogSaveResult> {
    try {
      await firstValueFrom(
        this.additionalReferencesApi.update(id, {
          name: draft.name,
          key: draft.key,
          value: Number(draft.value),
          unit: draft.unit,
          description: draft.description || null,
        }),
      );

      this.store.additionalReferences.reload();
      this.messageService.add({
        severity: 'success',
        summary: 'Збережено',
        detail: `Додатковий довідник №${id} оновлено.`,
      });

      return dialogSaveSuccess();
    } catch (error) {
      const validationResult = mapValidationSaveError(error);

      if (validationResult) {
        return validationResult;
      }

      this.messageService.add({
        severity: 'error',
        summary: 'Помилка збереження',
        detail: `Додатковий довідник №${id} не збережено.`,
      });

      return dialogSaveFailure();
    }
  }
}
