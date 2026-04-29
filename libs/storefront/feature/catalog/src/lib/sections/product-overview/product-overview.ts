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
