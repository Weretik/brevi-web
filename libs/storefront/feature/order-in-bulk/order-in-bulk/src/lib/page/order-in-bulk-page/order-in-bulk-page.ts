import { Component } from '@angular/core';
import { InStockWorkwear, ProductCategories } from '@storefront/ui';

import { Hero } from '../../sections/hero/hero';

@Component({
  selector: 'lib-order-in-bulk-page',
  imports: [Hero, ProductCategories, InStockWorkwear],
  templateUrl: './order-in-bulk-page.html',
  styleUrl: './order-in-bulk-page.scss',
})
export class OrderInBulkPage {}
