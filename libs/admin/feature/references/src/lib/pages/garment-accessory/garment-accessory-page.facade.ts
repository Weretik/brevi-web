import {
  FabricsApi,
  FabricsStore,
  GarmentAccessoriesApi,
  GarmentAccessoriesStore,
  SuppliersStore,
} from '@admin/data-access';
import { dialogSaveFailure, dialogSaveSuccess, mapValidationSaveError } from '@admin/util';
import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import type {
  FabricDialogDraft,
  FabricDialogSaveResult,
} from '../../components/dialogs/fabric-dialog/fabric-dialog.models';
import type {
  GarmentAccessoryDialogDraft,
  GarmentAccessoryDialogSaveResult,
} from '../../components/dialogs/garment-accessory-dialog/garment-accessory-dialog.models';
import type {
  CreateFabricRequest,
  CreateGarmentAccessoryRequest,
  UpdateFabricRequest,
  UpdateGarmentAccessoryRequest,
} from '@admin/contracts';
import type { FabricRow, GarmentAccessoryRow } from '@admin/data-access';
import type { ReferenceDialogMode } from '@admin/util';

@Injectable()
export class GarmentAccessoryPageFacade {
  private readonly fabricsStore = inject(FabricsStore);
  private readonly garmentAccessoriesStore = inject(GarmentAccessoriesStore);
  private readonly fabricsApi = inject(FabricsApi);
  private readonly garmentAccessoriesApi = inject(GarmentAccessoriesApi);
  private readonly suppliersStore = inject(SuppliersStore);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  selectedFabrics: FabricRow[] = [];
  selectedGarmentAccessories: GarmentAccessoryRow[] = [];

  readonly fabrics = this.fabricsStore.fabrics;
  readonly garmentAccessories = this.garmentAccessoriesStore.garmentAccessories;
  readonly suppliers = this.suppliersStore.suppliers;

  private _fabricDrawerVisible = false;
  fabricDrawerMode: ReferenceDialogMode = 'create';
  fabricDrawerDraft: FabricDialogDraft = this.createEmptyFabricDraft();
  private fabricDrawerOriginalId: number | null = null;

  private _garmentAccessoryDrawerVisible = false;
  garmentAccessoryDrawerMode: ReferenceDialogMode = 'create';
  garmentAccessoryDrawerDraft: GarmentAccessoryDialogDraft =
    this.createEmptyGarmentAccessoryDraft();
  private garmentAccessoryDrawerOriginalId: number | null = null;

  get fabricDrawerVisible(): boolean {
    return this._fabricDrawerVisible;
  }

  set fabricDrawerVisible(visible: boolean) {
    this._fabricDrawerVisible = visible;

    if (!visible) {
      this.fabricDrawerMode = 'create';
      this.fabricDrawerDraft = this.createEmptyFabricDraft();
      this.fabricDrawerOriginalId = null;
    }
  }

  get garmentAccessoryDrawerVisible(): boolean {
    return this._garmentAccessoryDrawerVisible;
  }

  set garmentAccessoryDrawerVisible(visible: boolean) {
    this._garmentAccessoryDrawerVisible = visible;

    if (!visible) {
      this.garmentAccessoryDrawerMode = 'create';
      this.garmentAccessoryDrawerDraft = this.createEmptyGarmentAccessoryDraft();
      this.garmentAccessoryDrawerOriginalId = null;
    }
  }

  openFabricCreateDialog(): void {
    this.openFabricDrawer('create', this.createEmptyFabricDraft(), null);
  }

  openFabricEditDialog(fabric: FabricRow): void {
    this.openFabricDrawer('edit', this.toFabricDraft(fabric), fabric.id);
  }

  openFabricViewDialog(fabric: FabricRow): void {
    this.openFabricDrawer('view', this.toFabricDraft(fabric), fabric.id);
  }

  openGarmentAccessoryCreateDialog(): void {
    this.openGarmentAccessoryDrawer('create', this.createEmptyGarmentAccessoryDraft(), null);
  }

  openGarmentAccessoryEditDialog(accessory: GarmentAccessoryRow): void {
    this.openGarmentAccessoryDrawer('edit', this.toGarmentAccessoryDraft(accessory), accessory.id);
  }

  openGarmentAccessoryViewDialog(accessory: GarmentAccessoryRow): void {
    this.openGarmentAccessoryDrawer('view', this.toGarmentAccessoryDraft(accessory), accessory.id);
  }

  closeFabricDrawer(): void {
    this.fabricDrawerVisible = false;
  }

  closeGarmentAccessoryDrawer(): void {
    this.garmentAccessoryDrawerVisible = false;
  }

  async saveFabricDraft(draft: FabricDialogDraft): Promise<FabricDialogSaveResult> {
    if (this.fabricDrawerMode === 'view') {
      return dialogSaveSuccess();
    }

    if (this.fabricDrawerMode === 'create') {
      return this.createFabric(draft);
    }

    if (this.fabricDrawerMode === 'edit') {
      return this.updateFabric(this.fabricDrawerOriginalId ?? draft.id, draft);
    }

    return dialogSaveSuccess();
  }

  async saveGarmentAccessoryDraft(
    draft: GarmentAccessoryDialogDraft,
  ): Promise<GarmentAccessoryDialogSaveResult> {
    if (this.garmentAccessoryDrawerMode === 'view') {
      return dialogSaveSuccess();
    }

    if (this.garmentAccessoryDrawerMode === 'create') {
      return this.createGarmentAccessory(draft);
    }

    if (this.garmentAccessoryDrawerMode === 'edit') {
      return this.updateGarmentAccessory(this.garmentAccessoryDrawerOriginalId ?? draft.id, draft);
    }

    return dialogSaveSuccess();
  }

  confirmDeleteFabrics(fabrics: FabricRow[]): void {
    this.confirmDeleteReferences(fabrics, (selectedIds) => this.deleteFabricsByIds(selectedIds));
  }

  confirmDeleteGarmentAccessories(accessories: GarmentAccessoryRow[]): void {
    this.confirmDeleteReferences(accessories, (selectedIds) =>
      this.deleteGarmentAccessoriesByIds(selectedIds),
    );
  }

  private confirmDeleteReferences(
    items: Array<{ id: number }>,
    deleteByIds: (selectedIds: number[]) => Promise<void>,
  ): void {
    if (!items.length) {
      return;
    }

    const selectedIds = items.map((item) => item.id);
    this.confirmationService.confirm({
      header: 'РџС–РґС‚РІРµСЂРґР¶РµРЅРЅСЏ РІРёРґР°Р»РµРЅРЅСЏ',
      message: `Р’Рё РІРїРµРІРЅРµРЅС–, С‰Рѕ С…РѕС‡РµС‚Рµ РІРёРґР°Р»РёС‚Рё ${this.formatDeletionCount(selectedIds.length)}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Р’РёРґР°Р»РёС‚Рё',
      rejectLabel: 'РЎРєР°СЃСѓРІР°С‚Рё',
      accept: () => {
        void deleteByIds(selectedIds);
      },
    });
  }

  createEmptyFabricDraft(): FabricDialogDraft {
    return {
      id: this.getNextFabricId(),
      name: '',
      price: null,
      providerName: '',
    };
  }

  toFabricDraft(fabric: FabricRow): FabricDialogDraft {
    return {
      id: fabric.id,
      name: fabric.name,
      price: fabric.price,
      providerName: fabric.providerName,
    };
  }

  createEmptyGarmentAccessoryDraft(): GarmentAccessoryDialogDraft {
    return {
      id: this.getNextGarmentAccessoryId(),
      name: '',
      price: null,
      supplierId: this.suppliers.value()[0]?.id ?? 0,
      supplierName: this.suppliers.value()[0]?.name ?? '',
    };
  }

  toGarmentAccessoryDraft(accessory: GarmentAccessoryRow): GarmentAccessoryDialogDraft {
    return {
      id: accessory.id,
      name: accessory.name,
      price: accessory.price,
      supplierId: accessory.supplierId,
      supplierName: accessory.supplierName,
    };
  }

  private async createFabric(draft: FabricDialogDraft): Promise<FabricDialogSaveResult> {
    return this.saveReference({
      action: () => firstValueFrom(this.fabricsApi.create(this.toCreateFabricRequest(draft))),
      reload: () => this.fabrics.reload(),
      close: () => this.closeFabricDrawer(),
      successDetail: `РўРєР°РЅРёРЅСѓ в„–${draft.id} СЃС‚РІРѕСЂРµРЅРѕ.`,
      errorDetail: 'РўРєР°РЅРёРЅСѓ РЅРµ СЃС‚РІРѕСЂРµРЅРѕ.',
    });
  }

  private async updateFabric(
    id: number,
    draft: FabricDialogDraft,
  ): Promise<FabricDialogSaveResult> {
    return this.saveReference({
      action: () => firstValueFrom(this.fabricsApi.update(id, this.toUpdateFabricRequest(draft))),
      reload: () => this.fabrics.reload(),
      close: () => this.closeFabricDrawer(),
      successDetail: `РўРєР°РЅРёРЅСѓ в„–${id} РѕРЅРѕРІР»РµРЅРѕ.`,
      errorDetail: `РўРєР°РЅРёРЅСѓ в„–${id} РЅРµ Р·Р±РµСЂРµР¶РµРЅРѕ.`,
    });
  }

  private async createGarmentAccessory(
    draft: GarmentAccessoryDialogDraft,
  ): Promise<GarmentAccessoryDialogSaveResult> {
    return this.saveReference({
      action: () =>
        firstValueFrom(
          this.garmentAccessoriesApi.create(this.toCreateGarmentAccessoryRequest(draft)),
        ),
      reload: () => this.garmentAccessories.reload(),
      close: () => this.closeGarmentAccessoryDrawer(),
      successDetail: `Р¤СѓСЂРЅС–С‚СѓСЂСѓ в„–${draft.id} СЃС‚РІРѕСЂРµРЅРѕ.`,
      errorDetail: 'Р¤СѓСЂРЅС–С‚СѓСЂСѓ РЅРµ СЃС‚РІРѕСЂРµРЅРѕ.',
    });
  }

  private async updateGarmentAccessory(
    id: number,
    draft: GarmentAccessoryDialogDraft,
  ): Promise<GarmentAccessoryDialogSaveResult> {
    return this.saveReference({
      action: () =>
        firstValueFrom(
          this.garmentAccessoriesApi.update(id, this.toUpdateGarmentAccessoryRequest(draft)),
        ),
      reload: () => this.garmentAccessories.reload(),
      close: () => this.closeGarmentAccessoryDrawer(),
      successDetail: `Р¤СѓСЂРЅС–С‚СѓСЂСѓ в„–${id} РѕРЅРѕРІР»РµРЅРѕ.`,
      errorDetail: `Р¤СѓСЂРЅС–С‚СѓСЂСѓ в„–${id} РЅРµ Р·Р±РµСЂРµР¶РµРЅРѕ.`,
    });
  }

  private async saveReference(options: {
    action: () => Promise<unknown>;
    reload: () => void;
    close: () => void;
    successDetail: string;
    errorDetail: string;
  }): Promise<FabricDialogSaveResult | GarmentAccessoryDialogSaveResult> {
    try {
      await options.action();

      options.reload();
      this.messageService.add({
        severity: 'success',
        summary: 'Р—Р±РµСЂРµР¶РµРЅРѕ',
        detail: options.successDetail,
      });
      options.close();

      return dialogSaveSuccess();
    } catch (error) {
      const validationResult = mapValidationSaveError(error);

      if (validationResult) {
        return validationResult;
      }

      this.messageService.add({
        severity: 'error',
        summary: 'РџРѕРјРёР»РєР° Р·Р±РµСЂРµР¶РµРЅРЅСЏ',
        detail: options.errorDetail,
      });

      return dialogSaveFailure();
    }
  }

  private async deleteFabricsByIds(selectedIds: number[]): Promise<void> {
    const results = await Promise.allSettled(
      selectedIds.map((id) => firstValueFrom(this.fabricsApi.delete(id))),
    );

    this.selectedFabrics = [];
    this.fabrics.reload();

    const failedCount = results.filter((result) => result.status === 'rejected').length;
    this.messageService.add({
      severity: failedCount === 0 ? 'success' : 'error',
      summary: failedCount === 0 ? 'Р’РёРґР°Р»РµРЅРѕ' : 'РџРѕРјРёР»РєР° РІРёРґР°Р»РµРЅРЅСЏ',
      detail:
        failedCount === 0
          ? 'Р’РёР±СЂР°РЅС– С‚РєР°РЅРёРЅРё РІРёРґР°Р»РµРЅРѕ.'
          : `Р’РёРґР°Р»РµРЅРѕ ${selectedIds.length - failedCount} Р· ${selectedIds.length} С‚РєР°РЅРёРЅ.`,
    });
  }

  private async deleteGarmentAccessoriesByIds(selectedIds: number[]): Promise<void> {
    const results = await Promise.allSettled(
      selectedIds.map((id) => firstValueFrom(this.garmentAccessoriesApi.delete(id))),
    );

    this.selectedGarmentAccessories = [];
    this.garmentAccessories.reload();

    const failedCount = results.filter((result) => result.status === 'rejected').length;
    this.messageService.add({
      severity: failedCount === 0 ? 'success' : 'error',
      summary: failedCount === 0 ? 'Р’РёРґР°Р»РµРЅРѕ' : 'РџРѕРјРёР»РєР° РІРёРґР°Р»РµРЅРЅСЏ',
      detail:
        failedCount === 0
          ? 'Р’РёР±СЂР°РЅСѓ С„СѓСЂРЅС–С‚СѓСЂСѓ РІРёРґР°Р»РµРЅРѕ.'
          : `Р’РёРґР°Р»РµРЅРѕ ${selectedIds.length - failedCount} Р· ${selectedIds.length} РїРѕР·РёС†С–Р№ С„СѓСЂРЅС–С‚СѓСЂРё.`,
    });
  }

  private getNextFabricId(): number {
    return this.getNextId(this.fabrics.value());
  }

  private getNextGarmentAccessoryId(): number {
    return this.getNextId(this.garmentAccessories.value());
  }

  private getSupplierNameById(supplierId: number): string {
    return this.suppliers.value().find((supplier) => supplier.id === supplierId)?.name ?? '';
  }

  private getSupplierNameForDraft(draft: GarmentAccessoryDialogDraft): string {
    return this.getSupplierNameById(draft.supplierId) || draft.supplierName;
  }

  private toCreateFabricRequest(draft: FabricDialogDraft): CreateFabricRequest {
    return {
      id: Number(draft.id),
      ...this.toUpdateFabricRequest(draft),
    };
  }

  private toUpdateFabricRequest(draft: FabricDialogDraft): UpdateFabricRequest {
    return {
      name: draft.name,
      price: draft.price,
      providerName: draft.providerName,
    };
  }

  private toCreateGarmentAccessoryRequest(
    draft: GarmentAccessoryDialogDraft,
  ): CreateGarmentAccessoryRequest {
    return {
      id: Number(draft.id),
      ...this.toUpdateGarmentAccessoryRequest(draft),
    };
  }

  private toUpdateGarmentAccessoryRequest(
    draft: GarmentAccessoryDialogDraft,
  ): UpdateGarmentAccessoryRequest {
    return {
      name: draft.name,
      price: draft.price,
      supplierName: this.getSupplierNameForDraft(draft),
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

  private openFabricDrawer(
    mode: ReferenceDialogMode,
    draft: FabricDialogDraft,
    originalId: number | null,
  ): void {
    this.fabricDrawerMode = mode;
    this.fabricDrawerDraft = draft;
    this.fabricDrawerOriginalId = originalId;
    this.fabricDrawerVisible = true;
  }

  private openGarmentAccessoryDrawer(
    mode: ReferenceDialogMode,
    draft: GarmentAccessoryDialogDraft,
    originalId: number | null,
  ): void {
    this.garmentAccessoryDrawerMode = mode;
    this.garmentAccessoryDrawerDraft = draft;
    this.garmentAccessoryDrawerOriginalId = originalId;
    this.garmentAccessoryDrawerVisible = true;
  }
}
