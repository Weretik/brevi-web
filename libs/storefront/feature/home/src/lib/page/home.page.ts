import { Component, ChangeDetectionStrategy } from '@angular/core';
import { InStockWorkwear, ProductCategories } from '@storefront/ui';

import { AboutPreview } from '../sections/about-preview/about-preview';
import { CompanyHighlights } from '../sections/company-highlights/company-highlights';
import { MainHero } from '../sections/main-hero/main-hero';

@Component({
  selector: 'lib-home-page',
  imports: [MainHero, AboutPreview, CompanyHighlights, ProductCategories, InStockWorkwear],
  templateUrl: './home.page.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home.page.scss',
})
export class HomePage {}
