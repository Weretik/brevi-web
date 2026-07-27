import {
  GarmentPartOperationsApi,
  GarmentPartOperationsStore,
  GarmentPartsApi,
  GarmentPartsStore,
} from '@admin/data-access';
import { dialogSaveFailure, dialogSaveSuccess, mapValidationSaveError } from '@admin/util';
import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import type {
  GarmentPartDialogDraft,
  GarmentPartDialogSaveResult,
} from '../../components/dialogs/garment-part-dialog/garment-part-dialog.models';
import type {
  GarmentPartOperationDialogDraft,
  GarmentPartOperationDialogSaveResult,
} from '../../components/dialogs/garment-part-operation-dialog/garment-part-operation-dialog.models';
import type {
  CreateGarmentPartOperationRequest,
  CreateGarmentPartRequest,
  UpdateGarmentPartOperationRequest,
  UpdateGarmentPartRequest,
} from '@admin/contracts';
import type { GarmentPartOperationRow, GarmentPartRow } from '@admin/data-access';
import type { ReferenceDialogMode } from '@admin/util';

@Injectable()
export class GarmentPartOperationPageFacade {
  private readonly garmentPartsStore = inject(GarmentPartsStore);
  private readonly garmentPartOperationsStore = inject(GarmentPartOperationsStore);
  private readonly garmentPartsApi = inject(GarmentPartsApi);
  private readonly garmentPartOperationsApi = inject(GarmentPartOperationsApi);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  selectedGarmentParts: GarmentPartRow[] = [];
  selectedGarmentPartOperations: GarmentPartOperationRow[] = [];

  readonly garmentParts = this.garmentPartsStore.garmentParts;
  readonly garmentPartOperations = this.garmentPartOperationsStore.garmentPartOperations;

  private _garmentPartDrawerVisible = false;
  garmentPartDrawerMode: ReferenceDialogMode = 'create';
  garmentPartDrawerDraft: GarmentPartDialogDraft = this.createEmptyGarmentPartDraft();
  private garmentPartDrawerOriginalId: number | null = null;

  private _garmentPartOperationDrawerVisible = false;
  garmentPartOperationDrawerMode: ReferenceDialogMode = 'create';
  garmentPartOperationDrawerDraft: GarmentPartOperationDialogDraft =
    this.createEmptyGarmentPartOperationDraft();
  private garmentPartOperationDrawerOriginalId: number | null = null;

  get garmentPartDrawerVisible(): boolean {
    return this._garmentPartDrawerVisible;
  }

  set garmentPartDrawerVisible(visible: boolean) {
    this._garmentPartDrawerVisible = visible;

    if (!visible) {
      this.garmentPartDrawerMode = 'create';
      this.garmentPartDrawerDraft = this.createEmptyGarmentPartDraft();
      this.garmentPartDrawerOriginalId = null;
    }
  }

  get garmentPartOperationDrawerVisible(): boolean {
    return this._garmentPartOperationDrawerVisible;
  }

  set garmentPartOperationDrawerVisible(visible: boolean) {
    this._garmentPartOperationDrawerVisible = visible;

    if (!visible) {
      this.garmentPartOperationDrawerMode = 'create';
      this.garmentPartOperationDrawerDraft = this.createEmptyGarmentPartOperationDraft();
      this.garmentPartOperationDrawerOriginalId = null;
    }
  }

  openGarmentPartCreateDialog(): void {
    this.openGarmentPartDrawer('create', this.createEmptyGarmentPartDraft(), null);
  }

  openGarmentPartEditDialog(garmentPart: GarmentPartRow): void {
    this.openGarmentPartDrawer('edit', this.toGarmentPartDraft(garmentPart), garmentPart.id);
  }

  openGarmentPartViewDialog(garmentPart: GarmentPartRow): void {
    this.openGarmentPartDrawer('view', this.toGarmentPartDraft(garmentPart), garmentPart.id);
  }

  openGarmentPartOperationCreateDialog(): void {
    this.openGarmentPartOperationDrawer(
      'create',
      this.createEmptyGarmentPartOperationDraft(),
      null,
    );
  }

  openGarmentPartOperationEditDialog(operation: GarmentPartOperationRow): void {
    this.openGarmentPartOperationDrawer(
      'edit',
      this.toGarmentPartOperationDraft(operation),
      operation.id,
    );
  }

  openGarmentPartOperationViewDialog(operation: GarmentPartOperationRow): void {
    this.openGarmentPartOperationDrawer(
      'view',
      this.toGarmentPartOperationDraft(operation),
      operation.id,
    );
  }

  closeGarmentPartDrawer(): void {
    this.garmentPartDrawerVisible = false;
  }

  closeGarmentPartOperationDrawer(): void {
    this.garmentPartOperationDrawerVisible = false;
  }

  readonly saveGarmentPartDraft = async (
    draft: GarmentPartDialogDraft,
  ): Promise<GarmentPartDialogSaveResult> => {
    if (this.garmentPartDrawerMode === 'view') {
      return dialogSaveSuccess();
    }

    if (this.garmentPartDrawerMode === 'create') {
      const created = await this.createGarmentPart(draft);

      if (created.success) {
        this.closeGarmentPartDrawer();
      }

      return created;
    }

    const updated = await this.updateGarmentPart(
      this.garmentPartDrawerOriginalId ?? draft.id,
      draft,
    );

    if (updated.success) {
      this.closeGarmentPartDrawer();
    }

    return updated;
  };

  readonly saveGarmentPartOperationDraft = async (
    draft: GarmentPartOperationDialogDraft,
  ): Promise<GarmentPartOperationDialogSaveResult> => {
    if (this.garmentPartOperationDrawerMode === 'view') {
      return dialogSaveSuccess();
    }

    if (this.garmentPartOperationDrawerMode === 'create') {
      const created = await this.createGarmentPartOperation(draft);

      if (created.success) {
        this.closeGarmentPartOperationDrawer();
      }

      return created;
    }

    const updated = await this.updateGarmentPartOperation(
      this.garmentPartOperationDrawerOriginalId ?? draft.id,
      draft,
    );

    if (updated.success) {
      this.closeGarmentPartOperationDrawer();
    }

    return updated;
  };

  confirmDeleteGarmentParts(garmentParts: GarmentPartRow[]): void {
    if (!garmentParts.length) {
      return;
    }

    const selectedIds = garmentParts.map((garmentPart) => garmentPart.id);
    this.confirmationService.confirm({
      header: 'РџС–РґС‚РІРµСЂРґР¶РµРЅРЅСЏ РІРёРґР°Р»РµРЅРЅСЏ',
      message: `Р’Рё РІРїРµРІРЅРµРЅС–, С‰Рѕ С…РѕС‡РµС‚Рµ РІРёРґР°Р»РёС‚Рё ${this.formatDeletionCount(selectedIds.length)}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Р’РёРґР°Р»РёС‚Рё',
      rejectLabel: 'РЎРєР°СЃСѓРІР°С‚Рё',
      accept: () => {
        void this.deleteGarmentPartsByIds(selectedIds);
      },
    });
  }

  confirmDeleteGarmentPartOperations(operations: GarmentPartOperationRow[]): void {
    if (!operations.length) {
      return;
    }

    const selectedIds = operations.map((operation) => operation.id);
    this.confirmationService.confirm({
      header: 'РџС–РґС‚РІРµСЂРґР¶РµРЅРЅСЏ РІРёРґР°Р»РµРЅРЅСЏ',
      message: `Р’Рё РІРїРµРІРЅРµРЅС–, С‰Рѕ С…РѕС‡РµС‚Рµ РІРёРґР°Р»РёС‚Рё ${this.formatDeletionCount(selectedIds.length)}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Р’РёРґР°Р»РёС‚Рё',
      rejectLabel: 'РЎРєР°СЃСѓРІР°С‚Рё',
      accept: () => {
        void this.deleteGarmentPartOperationsByIds(selectedIds);
      },
    });
  }

  createEmptyGarmentPartDraft(): GarmentPartDialogDraft {
    return {
      id: this.getNextGarmentPartId(),
      name: '',
    };
  }

  toGarmentPartDraft(garmentPart: GarmentPartRow): GarmentPartDialogDraft {
    return {
      id: garmentPart.id,
      name: garmentPart.name,
    };
  }

  createEmptyGarmentPartOperationDraft(): GarmentPartOperationDialogDraft {
    const garmentParts = this.garmentParts.value();

    return {
      id: this.getNextGarmentPartOperationId(),
      garmentPartName: garmentParts[0]?.name ?? '',
      name: '',
      min: null,
    };
  }

  toGarmentPartOperationDraft(operation: GarmentPartOperationRow): GarmentPartOperationDialogDraft {
    return {
      id: operation.id,
      garmentPartName: operation.garmentPartName,
      name: operation.name,
      min: operation.min,
    };
  }

  private async createGarmentPart(
    draft: GarmentPartDialogDraft,
  ): Promise<GarmentPartDialogSaveResult> {
    const validationFailure = this.validateGarmentPartDraft(draft);

    if (validationFailure) {
      return validationFailure;
    }

    try {
      await firstValueFrom(this.garmentPartsApi.create(this.toCreateGarmentPartRequest(draft)));

      this.garmentParts.reload();
      this.messageService.add({
        severity: 'success',
        summary: 'Р—Р±РµСЂРµР¶РµРЅРѕ',
        detail: `Р”РµС‚Р°Р»СЊ в„–${draft.id} СЃС‚РІРѕСЂРµРЅРѕ.`,
      });

      return dialogSaveSuccess();
    } catch (error) {
      const validationResult = mapValidationSaveError(error);

      if (validationResult) {
        return validationResult;
      }

      this.messageService.add({
        severity: 'error',
        summary: 'РџРѕРјРёР»РєР° Р·Р±РµСЂРµР¶РµРЅРЅСЏ',
        detail: 'Р”РµС‚Р°Р»СЊ РЅРµ СЃС‚РІРѕСЂРµРЅРѕ.',
      });

      return dialogSaveFailure();
    }
  }

  private async updateGarmentPart(
    id: number,
    draft: GarmentPartDialogDraft,
  ): Promise<GarmentPartDialogSaveResult> {
    const validationFailure = this.validateGarmentPartDraft({ ...draft, id });

    if (validationFailure) {
      return validationFailure;
    }

    try {
      await firstValueFrom(this.garmentPartsApi.update(id, this.toUpdateGarmentPartRequest(draft)));

      this.garmentParts.reload();
      this.messageService.add({
        severity: 'success',
        summary: 'Р—Р±РµСЂРµР¶РµРЅРѕ',
        detail: `Р”РµС‚Р°Р»СЊ в„–${id} РѕРЅРѕРІР»РµРЅРѕ.`,
      });

      return dialogSaveSuccess();
    } catch (error) {
      const validationResult = mapValidationSaveError(error);

      if (validationResult) {
        return validationResult;
      }

      this.messageService.add({
        severity: 'error',
        summary: 'РџРѕРјРёР»РєР° Р·Р±РµСЂРµР¶РµРЅРЅСЏ',
        detail: `Р”РµС‚Р°Р»СЊ в„–${id} РЅРµ Р·Р±РµСЂРµР¶РµРЅРѕ.`,
      });

      return dialogSaveFailure();
    }
  }

  private async createGarmentPartOperation(
    draft: GarmentPartOperationDialogDraft,
  ): Promise<GarmentPartOperationDialogSaveResult> {
    const validationFailure = this.validateGarmentPartOperationDraft(draft);

    if (validationFailure) {
      return validationFailure;
    }

    try {
      await firstValueFrom(
        this.garmentPartOperationsApi.create(this.toCreateGarmentPartOperationRequest(draft)),
      );

      this.garmentPartOperations.reload();
      this.messageService.add({
        severity: 'success',
        summary: 'Р—Р±РµСЂРµР¶РµРЅРѕ',
        detail: `Р РѕР±РѕС‚Сѓ в„–${draft.id} СЃС‚РІРѕСЂРµРЅРѕ.`,
      });

      return dialogSaveSuccess();
    } catch (error) {
      const validationResult = mapValidationSaveError(error);

      if (validationResult) {
        return validationResult;
      }

      this.messageService.add({
        severity: 'error',
        summary: 'РџРѕРјРёР»РєР° Р·Р±РµСЂРµР¶РµРЅРЅСЏ',
        detail: 'Р РѕР±РѕС‚Сѓ РЅРµ СЃС‚РІРѕСЂРµРЅРѕ.',
      });

      return dialogSaveFailure();
    }
  }

  private async updateGarmentPartOperation(
    id: number,
    draft: GarmentPartOperationDialogDraft,
  ): Promise<GarmentPartOperationDialogSaveResult> {
    const validationFailure = this.validateGarmentPartOperationDraft({ ...draft, id });

    if (validationFailure) {
      return validationFailure;
    }

    try {
      await firstValueFrom(
        this.garmentPartOperationsApi.update(id, this.toUpdateGarmentPartOperationRequest(draft)),
      );

      this.garmentPartOperations.reload();
      this.messageService.add({
        severity: 'success',
        summary: 'Р—Р±РµСЂРµР¶РµРЅРѕ',
        detail: `Р РѕР±РѕС‚Сѓ в„–${id} РѕРЅРѕРІР»РµРЅРѕ.`,
      });

      return dialogSaveSuccess();
    } catch (error) {
      const validationResult = mapValidationSaveError(error);

      if (validationResult) {
        return validationResult;
      }

      this.messageService.add({
        severity: 'error',
        summary: 'РџРѕРјРёР»РєР° Р·Р±РµСЂРµР¶РµРЅРЅСЏ',
        detail: `Р РѕР±РѕС‚Сѓ в„–${id} РЅРµ Р·Р±РµСЂРµР¶РµРЅРѕ.`,
      });

      return dialogSaveFailure();
    }
  }

  private validateGarmentPartDraft(
    draft: GarmentPartDialogDraft,
  ): GarmentPartDialogSaveResult | null {
    const fieldErrors: Record<string, string[]> = {};

    if (!Number.isFinite(draft.id) || draft.id <= 0) {
      fieldErrors['id'] = ['Р’РєР°Р¶С–С‚СЊ РєРѕСЂРµРєС‚РЅРёР№ ID.'];
    }

    if (!draft.name.trim()) {
      fieldErrors['name'] = ['Р’РєР°Р¶С–С‚СЊ РЅР°Р·РІСѓ.'];
    }

    return Object.keys(fieldErrors).length ? dialogSaveFailure(fieldErrors) : null;
  }

  private validateGarmentPartOperationDraft(
    draft: GarmentPartOperationDialogDraft,
  ): GarmentPartOperationDialogSaveResult | null {
    const fieldErrors: Record<string, string[]> = {};

    if (!Number.isFinite(draft.id) || draft.id <= 0) {
      fieldErrors['id'] = ['Р’РєР°Р¶С–С‚СЊ РєРѕСЂРµРєС‚РЅРёР№ ID.'];
    }

    if (!draft.garmentPartName.trim()) {
      fieldErrors['garmentPartName'] = ['РћР±РµСЂС–С‚СЊ РµР»РµРјРµРЅС‚.'];
    }

    if (!draft.name.trim()) {
      fieldErrors['name'] = ['Р’РєР°Р¶С–С‚СЊ РЅР°Р·РІСѓ.'];
    }

    if (draft.min === null || !Number.isFinite(draft.min)) {
      fieldErrors['min'] = ['Р’РєР°Р¶С–С‚СЊ Р·РЅР°С‡РµРЅРЅСЏ Min.'];
    }

    return Object.keys(fieldErrors).length ? dialogSaveFailure(fieldErrors) : null;
  }

  private async deleteGarmentPartsByIds(selectedIds: number[]): Promise<void> {
    const results = await Promise.allSettled(
      selectedIds.map((id) => firstValueFrom(this.garmentPartsApi.delete(id))),
    );

    this.selectedGarmentParts = [];
    this.garmentParts.reload();

    const failedCount = results.filter((result) => result.status === 'rejected').length;
    this.messageService.add({
      severity: failedCount === 0 ? 'success' : 'error',
      summary: failedCount === 0 ? 'Р’РёРґР°Р»РµРЅРѕ' : 'РџРѕРјРёР»РєР° РІРёРґР°Р»РµРЅРЅСЏ',
      detail:
        failedCount === 0
          ? 'Р’РёР±СЂР°РЅС– РґРµС‚Р°Р»С– РІРёРґР°Р»РµРЅРѕ.'
          : `Р’РёРґР°Р»РµРЅРѕ ${selectedIds.length - failedCount} Р· ${selectedIds.length} РґРµС‚Р°Р»РµР№.`,
    });
  }

  private async deleteGarmentPartOperationsByIds(selectedIds: number[]): Promise<void> {
    const results = await Promise.allSettled(
      selectedIds.map((id) => firstValueFrom(this.garmentPartOperationsApi.delete(id))),
    );

    this.selectedGarmentPartOperations = [];
    this.garmentPartOperations.reload();

    const failedCount = results.filter((result) => result.status === 'rejected').length;
    this.messageService.add({
      severity: failedCount === 0 ? 'success' : 'error',
      summary: failedCount === 0 ? 'Р’РёРґР°Р»РµРЅРѕ' : 'РџРѕРјРёР»РєР° РІРёРґР°Р»РµРЅРЅСЏ',
      detail:
        failedCount === 0
          ? 'Р’РёР±СЂР°РЅС– СЂРѕР±РѕС‚Рё РІРёРґР°Р»РµРЅРѕ.'
          : `Р’РёРґР°Р»РµРЅРѕ ${selectedIds.length - failedCount} Р· ${selectedIds.length} СЂРѕР±С–С‚.`,
    });
  }

  private getNextGarmentPartId(): number {
    return this.getNextId(this.garmentParts.value());
  }

  private getNextGarmentPartOperationId(): number {
    return this.getNextId(this.garmentPartOperations.value());
  }

  private toCreateGarmentPartRequest(draft: GarmentPartDialogDraft): CreateGarmentPartRequest {
    return {
      id: Number(draft.id),
      name: draft.name,
    };
  }

  private toUpdateGarmentPartRequest(draft: GarmentPartDialogDraft): UpdateGarmentPartRequest {
    return {
      name: draft.name,
    };
  }

  private toCreateGarmentPartOperationRequest(
    draft: GarmentPartOperationDialogDraft,
  ): CreateGarmentPartOperationRequest {
    return {
      id: Number(draft.id),
      garmentPartName: draft.garmentPartName,
      name: draft.name,
      min: Number(draft.min),
    };
  }

  private toUpdateGarmentPartOperationRequest(
    draft: GarmentPartOperationDialogDraft,
  ): UpdateGarmentPartOperationRequest {
    return {
      garmentPartName: draft.garmentPartName,
      name: draft.name,
      min: Number(draft.min),
    };
  }

  private getNextId(items: Array<{ id: number }>): number {
    return items.reduce((currentMax, item) => Math.max(currentMax, item.id), 0) + 1;
  }

  private formatDeletionCount(count: number): string {
    return `${count} ${this.getPositionNoun(count)}`;
  }

  private getPositionNoun(count: number): string {
    const lastTwoDigits = count % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return 'РїРѕР·РёС†С–Р№';
    }

    const lastDigit = count % 10;

    if (lastDigit === 1) {
      return 'РїРѕР·РёС†С–СЋ';
    }

    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'РїРѕР·РёС†С–С—';
    }

    return 'РїРѕР·РёС†С–Р№';
  }

  private openGarmentPartDrawer(
    mode: ReferenceDialogMode,
    draft: GarmentPartDialogDraft,
    originalId: number | null,
  ): void {
    this.garmentPartDrawerMode = mode;
    this.garmentPartDrawerDraft = draft;
    this.garmentPartDrawerOriginalId = originalId;
    this.garmentPartDrawerVisible = true;
  }

  private openGarmentPartOperationDrawer(
    mode: ReferenceDialogMode,
    draft: GarmentPartOperationDialogDraft,
    originalId: number | null,
  ): void {
    this.garmentPartOperationDrawerMode = mode;
    this.garmentPartOperationDrawerDraft = draft;
    this.garmentPartOperationDrawerVisible = true;
    this.garmentPartOperationDrawerOriginalId = originalId;
  }
}
