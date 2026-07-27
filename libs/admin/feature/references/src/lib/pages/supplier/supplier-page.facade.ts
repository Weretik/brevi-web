import { SuppliersApi, SuppliersStore } from '@admin/data-access';
import { dialogSaveFailure, dialogSaveSuccess, mapValidationSaveError } from '@admin/util';
import { inject, Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

import type {
  SupplierDialogDraft,
  SupplierDialogMode,
  SupplierDialogSaveResult,
} from '../../components/dialogs/supplier-dialog/supplier-dialog.models';
import type { CreateSupplierRequest, UpdateSupplierRequest } from '@admin/contracts';
import type { SupplierRow } from '@admin/data-access';

@Injectable()
export class SupplierPageFacade {
  private readonly supplierPageStore = inject(SuppliersStore);
  private readonly suppliersApi = inject(SuppliersApi);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);

  selectedSuppliers: SupplierRow[] = [];

  readonly suppliers = this.supplierPageStore.suppliers;

  private _supplierDrawerVisible = false;
  supplierDrawerMode: SupplierDialogMode = 'create';
  supplierDrawerDraft: SupplierDialogDraft = this.createEmptySupplierDraft();
  private supplierDrawerOriginalId: number | null = null;

  get supplierDrawerVisible(): boolean {
    return this._supplierDrawerVisible;
  }

  set supplierDrawerVisible(visible: boolean) {
    this._supplierDrawerVisible = visible;

    if (!visible) {
      this.supplierDrawerMode = 'create';
      this.supplierDrawerDraft = this.createEmptySupplierDraft();
      this.supplierDrawerOriginalId = null;
    }
  }

  openSupplierCreateDialog(): void {
    this.openSupplierDrawer('create', this.createEmptySupplierDraft(), null);
  }

  openSupplierEditDialog(supplier: SupplierRow): void {
    this.openSupplierDrawer('edit', this.toSupplierDraft(supplier), supplier.id);
  }

  openSupplierViewDialog(supplier: SupplierRow): void {
    this.openSupplierDrawer('view', this.toSupplierDraft(supplier), supplier.id);
  }

  closeSupplierDrawer(): void {
    this.supplierDrawerVisible = false;
  }

  async saveSupplierDraft(draft: SupplierDialogDraft): Promise<SupplierDialogSaveResult> {
    if (this.supplierDrawerMode === 'view') {
      return dialogSaveSuccess();
    }

    if (this.supplierDrawerMode === 'create') {
      return this.createSupplier(draft);
    }

    if (this.supplierDrawerMode === 'edit') {
      return this.updateSupplier(this.supplierDrawerOriginalId ?? draft.id, draft);
    }

    return dialogSaveSuccess();
  }

  confirmDeleteSuppliers(suppliers: SupplierRow[]): void {
    if (!suppliers.length) {
      return;
    }

    const selectedIds = suppliers.map((supplier) => supplier.id);
    this.confirmationService.confirm({
      header: 'РџС–РґС‚РІРµСЂРґР¶РµРЅРЅСЏ РІРёРґР°Р»РµРЅРЅСЏ',
      message: `Р’Рё РІРїРµРІРЅРµРЅС–, С‰Рѕ С…РѕС‡РµС‚Рµ РІРёРґР°Р»РёС‚Рё ${this.formatDeletionCount(selectedIds.length)}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Р’РёРґР°Р»РёС‚Рё',
      rejectLabel: 'РЎРєР°СЃСѓРІР°С‚Рё',
      accept: () => {
        void this.deleteSuppliersByIds(selectedIds);
      },
    });
  }

  private async createSupplier(draft: SupplierDialogDraft): Promise<SupplierDialogSaveResult> {
    return this.saveSupplier({
      action: () => firstValueFrom(this.suppliersApi.create(this.toCreateSupplierRequest(draft))),
      successDetail: `РџРѕСЃС‚Р°С‡Р°Р»СЊРЅРёРєР° в„–${draft.id} СЃС‚РІРѕСЂРµРЅРѕ.`,
      errorDetail: 'РџРѕСЃС‚Р°С‡Р°Р»СЊРЅРёРєР° РЅРµ СЃС‚РІРѕСЂРµРЅРѕ.',
    });
  }

  private async updateSupplier(
    id: number,
    draft: SupplierDialogDraft,
  ): Promise<SupplierDialogSaveResult> {
    return this.saveSupplier({
      action: () =>
        firstValueFrom(this.suppliersApi.update(id, this.toUpdateSupplierRequest(draft))),
      successDetail: `РџРѕСЃС‚Р°С‡Р°Р»СЊРЅРёРєР° в„–${id} РѕРЅРѕРІР»РµРЅРѕ.`,
      errorDetail: `РџРѕСЃС‚Р°С‡Р°Р»СЊРЅРёРєР° в„–${id} РЅРµ Р·Р±РµСЂРµР¶РµРЅРѕ.`,
    });
  }

  private async saveSupplier(options: {
    action: () => Promise<unknown>;
    successDetail: string;
    errorDetail: string;
  }): Promise<SupplierDialogSaveResult> {
    try {
      await options.action();

      this.suppliers.reload();
      this.messageService.add({
        severity: 'success',
        summary: 'Р—Р±РµСЂРµР¶РµРЅРѕ',
        detail: options.successDetail,
      });
      this.closeSupplierDrawer();

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

  private async deleteSuppliersByIds(selectedIds: number[]): Promise<void> {
    const results = await Promise.allSettled(
      selectedIds.map((id) => firstValueFrom(this.suppliersApi.delete(id))),
    );

    this.selectedSuppliers = [];
    this.suppliers.reload();

    const failedCount = results.filter((result) => result.status === 'rejected').length;
    this.messageService.add({
      severity: failedCount === 0 ? 'success' : 'error',
      summary: failedCount === 0 ? 'Р’РёРґР°Р»РµРЅРѕ' : 'РџРѕРјРёР»РєР° РІРёРґР°Р»РµРЅРЅСЏ',
      detail:
        failedCount === 0
          ? 'Р’РёР±СЂР°РЅРёС… РїРѕСЃС‚Р°С‡Р°Р»СЊРЅРёРєС–РІ РІРёРґР°Р»РµРЅРѕ.'
          : `Р’РёРґР°Р»РµРЅРѕ ${selectedIds.length - failedCount} Р· ${selectedIds.length} РїРѕСЃС‚Р°С‡Р°Р»СЊРЅРёРєС–РІ.`,
    });
  }

  private getNextSupplierId(): number {
    const maxId = this.suppliers
      .value()
      .reduce((currentMax, supplier) => Math.max(currentMax, supplier.id), 0);

    return maxId + 1;
  }

  private createEmptySupplierDraft(): SupplierDialogDraft {
    return {
      id: this.getNextSupplierId(),
      name: '',
      link: '',
      contactPerson: '',
      phoneNumber: '',
      notes: '',
    };
  }

  private toSupplierDraft(supplier: SupplierRow): SupplierDialogDraft {
    return {
      id: supplier.id,
      name: supplier.name,
      link: supplier.link ?? '',
      contactPerson: supplier.contactPerson ?? '',
      phoneNumber: supplier.phoneNumber ?? '',
      notes: supplier.notes ?? '',
    };
  }

  private toCreateSupplierRequest(draft: SupplierDialogDraft): CreateSupplierRequest {
    return {
      id: Number(draft.id),
      ...this.toUpdateSupplierRequest(draft),
    };
  }

  private toUpdateSupplierRequest(draft: SupplierDialogDraft): UpdateSupplierRequest {
    return {
      name: draft.name,
      link: draft.link || null,
      contactPerson: draft.contactPerson || null,
      phoneNumber: draft.phoneNumber || null,
      notes: draft.notes || null,
    };
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

  private openSupplierDrawer(
    mode: SupplierDialogMode,
    draft: SupplierDialogDraft,
    originalId: number | null,
  ): void {
    this.supplierDrawerMode = mode;
    this.supplierDrawerDraft = draft;
    this.supplierDrawerOriginalId = originalId;
    this.supplierDrawerVisible = true;
  }
}
