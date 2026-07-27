import { Component, ViewChild, inject } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { SupplierPageFacade } from './supplier-page.facade';
import { SupplierDialogComponent } from '../../components';

import type {
  SupplierDialogDraft,
  SupplierDialogSaveResult,
} from '../../components/dialogs/supplier-dialog/supplier-dialog.models';
import type { SupplierRow } from '@admin/data-access';

@Component({
  selector: 'lib-supplier',
  standalone: true,
  imports: [
    ButtonModule,
    ConfirmDialogModule,
    ContextMenuModule,
    SupplierDialogComponent,
    TableModule,
    ToastModule,
  ],
  templateUrl: './supplier.html',
  styleUrl: './supplier.css',
  providers: [ConfirmationService, SupplierPageFacade, MessageService],
})
export class Supplier {
  @ViewChild('supplierContextMenu')
  private supplierContextMenu?: ContextMenu;

  protected readonly facade = inject(SupplierPageFacade);
  protected readonly supplierMenuItems: MenuItem[] = [
    {
      label: 'Переглянути',
      icon: 'pi pi-eye',
      command: () => {
        if (!this.activeSupplier) {
          return;
        }

        this.facade.openSupplierViewDialog(this.activeSupplier);
      },
    },
    {
      label: 'Редагувати',
      icon: 'pi pi-pencil',
      command: () => {
        if (!this.activeSupplier) {
          return;
        }

        void this.facade.openSupplierEditDialog(this.activeSupplier);
      },
    },
    {
      label: 'Видалити',
      icon: 'pi pi-trash',
      command: () => {
        if (!this.activeSupplier) {
          return;
        }

        this.facade.confirmDeleteSuppliers([this.activeSupplier]);
      },
    },
  ];

  protected activeSupplier: SupplierRow | null = null;

  protected openSupplierCreateDialog(): void {
    this.facade.openSupplierCreateDialog();
  }

  protected readonly saveSupplierDraft = (
    draft: SupplierDialogDraft,
  ): Promise<SupplierDialogSaveResult> => this.facade.saveSupplierDraft(draft);
}
