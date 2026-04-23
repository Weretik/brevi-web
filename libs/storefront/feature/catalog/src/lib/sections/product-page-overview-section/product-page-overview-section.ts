import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

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

type ProductInfoItem = {
  labelKey: string;
  valueKey: string;
};

@Component({
  selector: 'lib-product-page-overview-section',
  imports: [CommonModule, FormsModule, ButtonModule, SelectModule, TranslocoPipe],
  templateUrl: './product-page-overview-section.html',
  styleUrl: './product-page-overview-section.scss',
})
export class ProductPageOverviewSection {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  liked = false;
  images = [
    'impulse-suit-front.webp',
    'impulse-suit-side.webp',
    'impulse-suit-blue.webp',
    'impulse-suit-back.webp',
  ];
  selectedImageIndex = 0;
  selectedFabric: FabricType | null = null;

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
  readonly productInfoItems: ProductInfoItem[] = [
    {
      labelKey: 'catalog.productPage.info.model.label',
      valueKey: 'catalog.productPage.info.model.value',
    },
    {
      labelKey: 'catalog.productPage.info.professions.label',
      valueKey: 'catalog.productPage.info.professions.value',
    },
    {
      labelKey: 'catalog.productPage.info.gender.label',
      valueKey: 'catalog.productPage.info.gender.value',
    },
    {
      labelKey: 'catalog.productPage.info.season.label',
      valueKey: 'catalog.productPage.info.season.value',
    },
    {
      labelKey: 'catalog.productPage.info.photoFabric.label',
      valueKey: 'catalog.productPage.info.photoFabric.value',
    },
    {
      labelKey: 'catalog.productPage.info.features.label',
      valueKey: 'catalog.productPage.info.features.value',
    },
    {
      labelKey: 'catalog.productPage.info.logo.label',
      valueKey: 'catalog.productPage.info.logo.value',
    },
    {
      labelKey: 'catalog.productPage.info.additional.label',
      valueKey: 'catalog.productPage.info.additional.value',
    },
  ];

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
}
