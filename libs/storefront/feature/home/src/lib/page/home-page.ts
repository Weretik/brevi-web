import { Component } from '@angular/core';
import { InStockWorkwear, ProductCategories } from '@storefront/ui';

import { AboutPreview } from '../sections/about-preview/about-preview';
import { CompanyHighlights } from '../sections/company-highlights/company-highlights';
import { MainHero } from '../sections/main-hero/main-hero';

@Component({
  selector: 'lib-home-page',
  imports: [MainHero, AboutPreview, CompanyHighlights, ProductCategories, InStockWorkwear],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {}
