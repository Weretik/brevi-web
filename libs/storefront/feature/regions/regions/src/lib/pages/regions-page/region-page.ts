import { Component } from '@angular/core';
import { InStockWorkwear, ProductCategories } from '@storefront/ui';

import { Hero } from '../../sections/hero/hero';

@Component({
  selector: 'lib-region-page',
  imports: [Hero, InStockWorkwear, ProductCategories],
  templateUrl: './region-page.html',
  styleUrl: './region-page.scss',
})
export class RegionPage {}
