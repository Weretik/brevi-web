import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';

import { SizeGuideDialogSection } from '../size-guide-dialog/size-guide-dialog';

type FabricOption = {
  label: string;
  value: string;
};

type FabricType = 'greta' | 'profstyle';

type PriceTiers = {
  retail: number;
  wholesale: number;
  largeWholesale: number;
};

@Component({
  selector: 'lib-product-overview',
  imports: [
    CommonModule,
    NgOptimizedImage,
    FormsModule,
    ButtonModule,
    SelectModule,
    DialogModule,
    TranslocoPipe,
    SizeGuideDialogSection,
  ],
  templateUrl: './product-overview.html',
  styleUrl: './product-overview.scss',
})
export class ProductOverview {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  images = [
    'impulse-suit-front.webp',
    'impulse-suit-side.webp',
    'impulse-suit-blue.webp',
    'impulse-suit-back.webp',
  ];
  selectedImageIndex = 0;
  selectedFabric: FabricType | null = null;
  isSizeGuideDialogVisible = false;

  readonly desktopThumbClass =
    'w-24 h-28 rounded-lg cursor-pointer transition-all duration-150 object-cover';
  readonly desktopThumbSelectedClass =
    'shadow-[0_0_0_2px] shadow-surface-900 dark:shadow-surface-0 ring-2 ring-surface-900 dark:ring-surface-0 ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-950';
  readonly mobileThumbClass =
    'flex-1 min-w-16 sm:min-w-20 md:min-w-24 h-auto max-h-28 object-cover rounded-md sm:rounded-lg cursor-pointer transition-all duration-150';
  readonly mobileThumbSelectedClass =
    'shadow-[0_0_0_2px] shadow-surface-900 dark:shadow-surface-0 ring-2 ring-surface-900 dark:ring-surface-0 ring-offset-1 sm:ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-950';
  readonly priceCardClass =
    'min-w-44 rounded-lg bg-surface-0 px-3 py-2 dark:bg-surface-900/50 outline outline-surface-200 dark:outline-surface-700';
  readonly infoBadgeClass =
    'inline-flex items-center rounded-md border border-surface-300 bg-surface-0 px-2 py-1 font-semibold text-surface-700 dark:border-surface-600 dark:bg-surface-900 dark:text-surface-200';
  readonly primaryButtonClass =
    'w-full h-10! py-2! px-4! bg-surface-900! hover:bg-surface-800! active:bg-surface-700! dark:bg-surface-0! dark:hover:bg-surface-100! dark:active:bg-surface-200! text-surface-0! dark:text-surface-900! border-surface-900! dark:border-surface-0! rounded-md! font-medium! text-sm! transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-950';
  readonly secondaryButtonClass =
    'w-full h-10! py-2! px-4! bg-surface-100! hover:bg-surface-200! active:bg-surface-300! dark:bg-surface-800! dark:hover:bg-surface-700! dark:active:bg-surface-600! text-surface-900! dark:text-surface-100! border-surface-300! dark:border-surface-600! rounded-md! font-medium! text-sm! transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-950';

  private readonly fabricPricing: Record<FabricType, PriceTiers> = {
    greta: {
      retail: 2580,
      wholesale: 2197,
      largeWholesale: 2080,
    },
    profstyle: {
      retail: 2700,
      wholesale: 2299,
      largeWholesale: 2177,
    },
  };

  readonly minimumPrice = 2080;
  readonly fabricOptions = computed<FabricOption[]>(() => {
    this.activeLang();
    return [
      {
        label: this.transloco.translate('catalog.productPage.fabric.options.greta'),
        value: 'greta',
      },
      {
        label: this.transloco.translate('catalog.productPage.fabric.options.profstyle'),
        value: 'profstyle',
      },
    ];
  });

  get selectedPriceTiers(): PriceTiers | null {
    return this.selectedFabric ? this.fabricPricing[this.selectedFabric] : null;
  }

  openSizeGuideDialog(): void {
    this.isSizeGuideDialogVisible = true;
  }
}
