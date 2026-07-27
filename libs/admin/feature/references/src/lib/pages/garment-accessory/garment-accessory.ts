import { DecimalPipe } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';

import { GarmentAccessoryPageFacade } from './garment-accessory-page.facade';
import { FabricDialogComponent, GarmentAccessoryDialogComponent } from '../../components';

import type {
  FabricDialogDraft,
  FabricDialogSaveResult,
} from '../../components/dialogs/fabric-dialog/fabric-dialog.models';
import type {
  GarmentAccessoryDialogDraft,
  GarmentAccessoryDialogSaveResult,
} from '../../components/dialogs/garment-accessory-dialog/garment-accessory-dialog.models';
import type { FabricRow, GarmentAccessoryRow } from '@admin/data-access';

@Component({
  selector: 'lib-garment-accessory',
  standalone: true,
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DecimalPipe,
    FabricDialogComponent,
    GarmentAccessoryDialogComponent,
    TableModule,
    TabsModule,
    ToastModule,
  ],
  templateUrl: './garment-accessory.html',
  styleUrl: './garment-accessory.css',
  providers: [ConfirmationService, GarmentAccessoryPageFacade, MessageService],
})
export class GarmentAccessory {
  @ViewChild('garmentAccessoryContextMenu')
  private garmentAccessoryContextMenu?: ContextMenu;

  @ViewChild('fabricContextMenu')
  private fabricContextMenu?: ContextMenu;

  protected readonly store = inject(GarmentAccessoryPageFacade);
  protected readonly garmentAccessoryMenuItems: MenuItem[] = [
    {
      label: 'Переглянути',
      icon: 'pi pi-eye',
      command: () => {
        if (!this.activeGarmentAccessory) {
          return;
        }

        this.openGarmentAccessoryViewDialog(this.activeGarmentAccessory);
      },
    },
    {
      label: 'Редагувати',
      icon: 'pi pi-pencil',
      command: () => {
        if (!this.activeGarmentAccessory) {
          return;
        }

        this.openGarmentAccessoryEditDialog(this.activeGarmentAccessory);
      },
    },
    {
      label: 'Видалити',
      icon: 'pi pi-trash',
      command: () => {
        if (!this.activeGarmentAccessory) {
          return;
        }

        this.confirmDeleteGarmentAccessories([this.activeGarmentAccessory]);
      },
    },
  ];

  protected readonly fabricMenuItems: MenuItem[] = [
    {
      label: 'Переглянути',
      icon: 'pi pi-eye',
      command: () => {
        if (!this.activeFabric) {
          return;
        }

        this.openFabricViewDialog(this.activeFabric);
      },
    },
    {
      label: 'Редагувати',
      icon: 'pi pi-pencil',
      command: () => {
        if (!this.activeFabric) {
          return;
        }

        this.openFabricEditDialog(this.activeFabric);
      },
    },
    {
      label: 'Видалити',
      icon: 'pi pi-trash',
      command: () => {
        if (!this.activeFabric) {
          return;
        }

        this.confirmDeleteFabrics([this.activeFabric]);
      },
    },
  ];

  protected activeGarmentAccessory: GarmentAccessoryRow | null = null;
  protected activeFabric: FabricRow | null = null;

  protected openGarmentAccessoryCreateDialog(): void {
    this.store.openGarmentAccessoryCreateDialog();
  }

  protected openGarmentAccessoryEditDialog(accessory: GarmentAccessoryRow): void {
    this.store.openGarmentAccessoryEditDialog(accessory);
  }

  protected openGarmentAccessoryViewDialog(accessory: GarmentAccessoryRow): void {
    this.store.openGarmentAccessoryViewDialog(accessory);
  }

  protected confirmDeleteGarmentAccessories(accessories: GarmentAccessoryRow[]): void {
    this.store.confirmDeleteGarmentAccessories(accessories);
  }

  protected openFabricCreateDialog(): void {
    this.store.openFabricCreateDialog();
  }

  protected openFabricEditDialog(fabric: FabricRow): void {
    this.store.openFabricEditDialog(fabric);
  }

  protected openFabricViewDialog(fabric: FabricRow): void {
    this.store.openFabricViewDialog(fabric);
  }

  protected confirmDeleteFabrics(fabrics: FabricRow[]): void {
    this.store.confirmDeleteFabrics(fabrics);
  }

  garmentAccessoryRow(row: unknown): GarmentAccessoryRow {
    return row as GarmentAccessoryRow;
  }

  fabricRow(row: unknown): FabricRow {
    return row as FabricRow;
  }

  protected readonly saveGarmentAccessoryDraft = (
    draft: GarmentAccessoryDialogDraft,
  ): Promise<GarmentAccessoryDialogSaveResult> => this.store.saveGarmentAccessoryDraft(draft);

  protected readonly saveFabricDraft = (
    draft: FabricDialogDraft,
  ): Promise<FabricDialogSaveResult> => this.store.saveFabricDraft(draft);
}
