import { Component, ViewChild, inject } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ContextMenu, ContextMenuModule } from 'primeng/contextmenu';
import { DynamicDialogModule, DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { AdditionalReferencePageFacade } from './additional-reference-page.facade';

import type { AdditionalReferenceRow } from '@admin/data-access';

@Component({
  selector: 'lib-additional-reference',
  imports: [ButtonModule, ContextMenuModule, DynamicDialogModule, TableModule, ToastModule],
  templateUrl: './additional-reference.html',
  styleUrl: './additional-reference.css',
  providers: [DialogService, AdditionalReferencePageFacade, MessageService],
})
export class AdditionalReference {
  @ViewChild('additionalReferenceContextMenu')
  private additionalReferenceContextMenu?: ContextMenu;

  protected readonly store = inject(AdditionalReferencePageFacade);
  protected readonly additionalReferenceMenuItems: MenuItem[] = [
    {
      label: 'Редагувати',
      icon: 'pi pi-pencil',
      command: () => {
        if (!this.activeAdditionalReference) {
          return;
        }

        void this.store.openAdditionalReferenceEditDialog(this.activeAdditionalReference);
      },
    },
  ];

  protected activeAdditionalReference: AdditionalReferenceRow | null = null;

  protected formatNumber(value: number): string {
    return new Intl.NumberFormat('uk-UA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }
}
