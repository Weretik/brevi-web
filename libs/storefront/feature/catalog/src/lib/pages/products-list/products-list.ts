import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  signal,
  ViewChild,
  OnDestroy,
  ViewEncapsulation,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';
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

@Component({
  selector: 'slide-over',
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
  ],
  template: `
    <lib-page-header [config]="catalogConfig" />

    <p-menu #sortMenu [popup]="true" [model]="sortOptions" [appendTo]="'body'"></p-menu>
    <div
      class="relative bg-brand-bg dark:bg-surface-950 p-6 md:p-12 lg:p-20 min-h-screen flex flex-col gap-6"
    >
      <div class="flex justify-between items-end gap-8">
        <div class="flex-1 flex flex-col gap-2">
          <div class="text-surface-900 dark:text-surface-0 text-2xl font-semibold leading-tight">
            Зимовий одяг
          </div>
          <div class="text-surface-500 dark:text-surface-200 text-xl font-normal leading-tight">
            Якщо вас цікавить опт перейдіть по ссилці (link)
          </div>
        </div>
        <div class="flex items-center gap-4">
          <button
            pButton
            [outlined]="true"
            severity="secondary"
            class="px-3 py-2 border-surface-300 dark:border-surface-600 text-surface-500 dark:text-surface-400"
            (click)="toggleSortMenu($event)"
          >
            <span pButtonLabel>{{ selectedSort() }}</span>
            <i pButtonIcon class="pi pi-sort-alt"></i>
          </button>
          <button
            pButton
            severity="secondary"
            [outlined]="true"
            pStyleClass="#slideover-cf-3"
            enterFromClass="hidden"
            enterActiveClass="animate-fadeinright"
            leaveToClass="hidden"
            leaveActiveClass="animate-fadeoutright"
            [hideOnOutsideClick]="true"
          >
            <span pButtonLabel>Filter</span>
          </button>
        </div>
      </div>

      <div class="flex items-center gap-4 py-2 rounded-[6px]">
        <span class="text-surface-500 dark:text-surface-200 text-base font-medium leading-tight"
          >Clothing</span
        >
        <span class="w-[3px] h-[3px] bg-surface-300 rounded-full"></span>
        <span class="text-surface-500 dark:text-surface-200 text-base font-medium leading-tight"
          >Outerwear</span
        >
      </div>

      <lib-product-list />

      <div
        id="slideover-cf-3"
        class="hidden absolute z-50 flex top-0 right-0 w-[350px] h-full bg-surface-0 dark:bg-surface-900 flex-col overflow-hidden shadow-xl"
      >
        <div
          class="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700 gap-2"
        >
          <span
            class="flex-1 text-surface-900 dark:text-surface-0 text-2xl font-semibold leading-tight"
            >Filter</span
          >
          <button
            pButton
            pStyleClass="#slideover-cf-3"
            leaveToClass="hidden"
            leaveActiveClass="animate-fadeoutright"
            [rounded]="true"
            [text]="true"
            severity="secondary"
          >
            <i pButtonIcon class="pi pi-times"></i>
          </button>
        </div>

        <div class="flex-1 flex flex-col overflow-y-auto">
          <div class="border-b border-surface-200 dark:border-surface-700 px-7 py-4">
            <div class="flex items-center justify-between mb-4">
              <span
                class="text-surface-900 dark:text-surface-0 text-base font-semibold leading-tight"
                >Selected</span
              >
              <button
                pButton
                [text]="true"
                (click)="clearChips()"
                class="text-surface-500 dark:text-surface-200 text-base font-normal leading-tight p-0 h-auto"
              >
                <span pButtonLabel>Clear</span>
              </button>
            </div>
            <div class="flex flex-wrap gap-2">
              @for (chip of chips(); track chip) {
                <p-chip
                  [label]="chip"
                  [removable]="true"
                  class="bg-surface-100 rounded-[16px] px-3 py-2 text-surface-800 text-base font-normal leading-normal"
                  (onRemove)="removeChip(chip)"
                ></p-chip>
              }
            </div>
          </div>

          <p-accordion
            [(value)]="accordionValue"
            [multiple]="true"
            class="w-full"
            styleClass="border-0! shadow-none!"
          >
            <p-accordion-panel
              value="brand"
              class="border-0! border-b! border-surface-200! dark:border-surface-700! mx-7"
            >
              <p-accordion-header
                class="bg-transparent! border-0! p-0! py-4! shadow-none! justify-between items-center w-full px-0"
              >
                <span
                  class="text-surface-900 dark:text-surface-0 text-base font-semibold leading-tight"
                  >Brand</span
                >
              </p-accordion-header>
              <p-accordion-content class="bg-transparent! border-0! p-0! pb-4!">
                <div class="flex flex-col gap-4">
                  @for (brand of brands; track brand.name) {
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <p-checkbox
                          [inputId]="brand.name"
                          [(ngModel)]="selectedBrands"
                          [value]="brand.name"
                          (onChange)="toggleChip(brand.name)"
                        ></p-checkbox>
                        <label
                          [for]="brand.name"
                          class="text-surface-700 dark:text-surface-300 text-base font-normal leading-tight"
                          >{{ brand.name }}</label
                        >
                      </div>
                      <p-badge
                        [value]="brand.count"
                        class="rounded-xl!"
                        severity="secondary"
                      ></p-badge>
                    </div>
                  }
                </div>
              </p-accordion-content>
            </p-accordion-panel>

            <p-accordion-panel
              value="price"
              class="border-0! border-b! border-surface-200! dark:border-surface-700! mx-7"
            >
              <p-accordion-header
                class="bg-transparent! border-0! p-0! py-4! shadow-none! justify-between items-center w-full px-0"
              >
                <span
                  class="text-surface-900 dark:text-surface-0 text-base font-semibold leading-tight"
                  >Price Range</span
                >
              </p-accordion-header>
              <p-accordion-content class="bg-transparent! border-0! p-0! pb-4!">
                <div class="flex flex-col gap-6 pt-2.5">
                  <p-slider [(ngModel)]="rangeValues" [range]="true" class="w-full"></p-slider>
                  <div class="flex gap-2">
                    <p-inputnumber
                      [(ngModel)]="rangeValues[0]"
                      placeholder="$20"
                      mode="currency"
                      currency="USD"
                      [min]="10"
                      inputStyleClass="w-full"
                    ></p-inputnumber>
                    <p-inputnumber
                      [(ngModel)]="rangeValues[1]"
                      placeholder="$80"
                      mode="currency"
                      currency="USD"
                      [max]="10000"
                      inputStyleClass="w-full"
                    ></p-inputnumber>
                  </div>
                </div>
              </p-accordion-content>
            </p-accordion-panel>

            <p-accordion-panel
              value="size"
              class="border-0! border-b! border-surface-200! dark:border-surface-700! mx-7"
            >
              <p-accordion-header
                class="bg-transparent! border-0! p-0! py-4! shadow-none! justify-between items-center w-full px-0"
              >
                <span
                  class="text-surface-900 dark:text-surface-0 text-base font-semibold leading-tight"
                  >Size</span
                >
              </p-accordion-header>
              <p-accordion-content class="bg-transparent! border-0! p-0! pb-4!">
                <div class="flex flex-col gap-4">
                  @for (size of sizes; track size) {
                    <div class="flex items-center gap-2">
                      <p-checkbox
                        [inputId]="size"
                        [(ngModel)]="selectedSizes"
                        [value]="size"
                        (onChange)="toggleChip(size)"
                      ></p-checkbox>
                      <label
                        [for]="size"
                        class="text-surface-700 dark:text-surface-300 text-base font-normal leading-tight"
                        >{{ size }}</label
                      >
                    </div>
                  }
                </div>
              </p-accordion-content>
            </p-accordion-panel>

            <p-accordion-panel value="color" class="border-0! mx-7">
              <p-accordion-header
                class="bg-transparent! border-0! p-0! py-4! shadow-none! justify-between items-center w-full px-0"
              >
                <span
                  class="text-surface-900 dark:text-surface-0 text-base font-semibold leading-tight"
                  >Color</span
                >
              </p-accordion-header>
              <p-accordion-content class="bg-transparent! border-0! p-0! pb-4!">
                <div class="flex flex-col gap-4">
                  @for (color of colors; track color.name) {
                    <div class="flex items-center gap-2">
                      <p-checkbox
                        [inputId]="color.name"
                        [(ngModel)]="selectedColors"
                        [value]="color.name"
                        (onChange)="toggleChip(color.name)"
                      ></p-checkbox>
                      <div class="w-5 h-5 rounded-full" [ngClass]="color.class"></div>
                      <span
                        class="text-surface-900 dark:text-surface-0 text-base font-normal leading-tight"
                        >{{ color.name }}</span
                      >
                    </div>
                  }
                </div>
              </p-accordion-content>
            </p-accordion-panel>
          </p-accordion>
        </div>

        <div class="px-7 pb-7">
          <button
            pButton
            class="w-full bg-primary-500 text-white font-medium px-3 py-2 rounded-[6px] outline-1 -outline-offset-1 outline-primary-500"
          >
            <span pButtonLabel>Apply</span>
          </button>
        </div>
      </div>
    </div>
  `,
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

  brands = [
    { name: 'North & Stone', count: 4 },
    { name: 'Alpine Co', count: 7 },
    { name: 'Summit', count: 3 },
    { name: 'Urban Shield', count: 3 },
    { name: 'Peak Performance', count: 6 },
  ];
  selectedBrands = ['North & Stone'];

  sizes = ['S', 'M', 'L', 'XL', '2XL'];
  selectedSizes: string[] = [];

  colors = [
    { name: 'Black', class: 'bg-surface-900 dark:bg-surface-0' },
    { name: 'Gray', class: 'bg-surface-300 dark:bg-surface-700' },
    { name: 'Sky', class: 'bg-sky-300' },
    { name: 'Dusty Blue', class: 'bg-blue-300' },
    { name: 'Orange', class: 'bg-primary-500' },
  ];
  selectedColors = ['Orange'];

  rangeValues = [20, 80];

  chips = signal(['North & Stone', 'Orange']);

  accordionValue = ['brand', 'price', 'size', 'color'];

  selectedSort = signal('Sort By');

  sortOptions = [
    {
      label: 'Newest First',
      icon: 'pi pi-calendar-plus',
      command: () => {
        this.selectedSort.set('Newest First');
        this.sortMenu.hide();
      },
    },
    {
      label: 'Price: Low to High',
      icon: 'pi pi-sort-amount-up',
      command: () => {
        this.selectedSort.set('Price: Low to High');
        this.sortMenu.hide();
      },
    },
    {
      label: 'Price: High to Low',
      icon: 'pi pi-sort-amount-down',
      command: () => {
        this.selectedSort.set('Price: High to Low');
        this.sortMenu.hide();
      },
    },
    {
      label: 'Best Rating',
      icon: 'pi pi-star',
      command: () => {
        this.selectedSort.set('Best Rating');
        this.sortMenu.hide();
      },
    },
    {
      label: 'Most Popular',
      icon: 'pi pi-heart',
      command: () => {
        this.selectedSort.set('Most Popular');
        this.sortMenu.hide();
      },
    },
  ];

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

  private platformId = inject(PLATFORM_ID);

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

  catalogConfig: PageHeaderConfig = {
    title: 'Каталог',
    breadcrumbs: ['Головна', 'Каталог', 'Зимовий одяг'],
    showSearch: true,
  };
}
