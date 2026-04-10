import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';
import { LocaleNavigationService } from '@storefront/util';
import { AccordionModule } from 'primeng/accordion';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipModule } from 'primeng/chip';
import { InputNumberModule } from 'primeng/inputnumber';
import { Menu, MenuModule } from 'primeng/menu';
import { SliderModule } from 'primeng/slider';
import { StyleClassModule } from 'primeng/styleclass';

import { ProductList } from '../../sections/product-list/product-list';

type SortKey =
  | 'catalog.productsList.sort.default'
  | 'catalog.productsList.sort.newest'
  | 'catalog.productsList.sort.priceLowToHigh'
  | 'catalog.productsList.sort.priceHighToLow'
  | 'catalog.productsList.sort.bestRating'
  | 'catalog.productsList.sort.mostPopular';

@Component({
  selector: 'lib-products-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AccordionModule,
    BadgeModule,
    ButtonModule,
    CheckboxModule,
    ChipModule,
    InputNumberModule,
    MenuModule,
    SliderModule,
    StyleClassModule,
    PageHeader,
    ProductList,
    TranslocoPipe,
    RouterLink,
  ],
  templateUrl: './products-list.html',
  styles: [
    `
      .p-accordioncontent-content {
        background: transparent !important;
        border: 0 !important;
        padding: 0 !important;
        padding-bottom: 1rem !important;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ProductsList implements OnDestroy {
  @ViewChild('sortMenu') sortMenu!: Menu;

  private readonly transloco = inject(TranslocoService);
  private readonly localeNavigation = inject(LocaleNavigationService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  brands = [
    { key: 'catalog.productsList.filters.brand.northStone', count: 4 },
    { key: 'catalog.productsList.filters.brand.alpineCo', count: 7 },
    { key: 'catalog.productsList.filters.brand.summit', count: 3 },
    { key: 'catalog.productsList.filters.brand.urbanShield', count: 3 },
    { key: 'catalog.productsList.filters.brand.peakPerformance', count: 6 },
  ];
  selectedBrands = ['catalog.productsList.filters.brand.northStone'];

  sizes = ['S', 'M', 'L', 'XL', '2XL'];
  selectedSizes: string[] = [];

  colors = [
    {
      key: 'catalog.productsList.filters.color.black',
      class: 'bg-surface-900 dark:bg-surface-0',
    },
    {
      key: 'catalog.productsList.filters.color.gray',
      class: 'bg-surface-300 dark:bg-surface-700',
    },
    { key: 'catalog.productsList.filters.color.sky', class: 'bg-sky-300' },
    { key: 'catalog.productsList.filters.color.dustyBlue', class: 'bg-blue-300' },
    { key: 'catalog.productsList.filters.color.orange', class: 'bg-primary-500' },
  ];
  selectedColors = ['catalog.productsList.filters.color.orange'];

  rangeValues = [20, 80];

  chips = signal([
    'catalog.productsList.filters.brand.northStone',
    'catalog.productsList.filters.color.orange',
  ]);

  accordionValue = ['brand', 'price', 'size', 'color'];

  selectedSort = signal<SortKey>('catalog.productsList.sort.default');

  readonly catalogConfig = computed<PageHeaderConfig>(() => {
    this.activeLang();
    return {
      title: this.transloco.translate('catalog.productsList.pageTitle'),
      breadcrumbs: [
        this.transloco.translate('shared.home'),
        this.transloco.translate('catalog.productsList.pageTitle'),
        this.transloco.translate('catalog.productsList.sectionTitle'),
      ],
      showSearch: true,
    };
  });

  readonly sortOptions = computed(() => {
    this.activeLang();
    return [
      {
        label: this.transloco.translate('catalog.productsList.sort.newest'),
        icon: 'pi pi-calendar-plus',
        command: () => {
          this.selectedSort.set('catalog.productsList.sort.newest');
          this.sortMenu.hide();
        },
      },
      {
        label: this.transloco.translate('catalog.productsList.sort.priceLowToHigh'),
        icon: 'pi pi-sort-amount-up',
        command: () => {
          this.selectedSort.set('catalog.productsList.sort.priceLowToHigh');
          this.sortMenu.hide();
        },
      },
      {
        label: this.transloco.translate('catalog.productsList.sort.priceHighToLow'),
        icon: 'pi pi-sort-amount-down',
        command: () => {
          this.selectedSort.set('catalog.productsList.sort.priceHighToLow');
          this.sortMenu.hide();
        },
      },
      {
        label: this.transloco.translate('catalog.productsList.sort.bestRating'),
        icon: 'pi pi-star',
        command: () => {
          this.selectedSort.set('catalog.productsList.sort.bestRating');
          this.sortMenu.hide();
        },
      },
      {
        label: this.transloco.translate('catalog.productsList.sort.mostPopular'),
        icon: 'pi pi-heart',
        command: () => {
          this.selectedSort.set('catalog.productsList.sort.mostPopular');
          this.sortMenu.hide();
        },
      },
    ];
  });

  protected orderInBulkLink(): string[] {
    return this.localeNavigation.localizedPath('/order-in-bulk');
  }

  toggleChip = (label: string) => {
    const currentChips = this.chips();
    const idx = currentChips.indexOf(label);
    if (idx > -1) {
      this.chips.set(currentChips.filter((chip) => chip !== label));
    } else {
      this.chips.set([...currentChips, label]);
    }
  };

  removeChip = (label: string) => {
    const currentChips = this.chips();
    this.chips.set(currentChips.filter((chip) => chip !== label));
    this.selectedBrands = this.selectedBrands.filter((brand) => brand !== label);
    this.selectedSizes = this.selectedSizes.filter((size) => size !== label);
    this.selectedColors = this.selectedColors.filter((color) => color !== label);
  };

  clearChips = () => {
    this.chips.set([]);
    this.selectedBrands = [];
    this.selectedSizes = [];
    this.selectedColors = [];
  };

  toggleSortMenu = (event: Event) => {
    try {
      if (this.sortMenu) {
        this.sortMenu.toggle(event);
      }
    } catch (error) {
      console.warn('Sort menu toggle failed:', error);
    }
  };

  ngOnDestroy() {
    try {
      if (this.sortMenu && typeof this.sortMenu.hide === 'function') {
        this.sortMenu.hide();
      }

      if (isPlatformBrowser(this.platformId)) {
        const slideOverElement = document.getElementById('slideover-cf-3');
        if (slideOverElement && !slideOverElement.classList.contains('hidden')) {
          slideOverElement.classList.add('hidden');
          slideOverElement.classList.remove('animate-fadeinright', 'animate-fadeoutright');
        }

        const body = document.body;
        if (body) {
          body.classList.remove('overflow-hidden');
        }
      }
    } catch (error) {
      console.warn('Cleanup failed:', error);
    }
  }
}
