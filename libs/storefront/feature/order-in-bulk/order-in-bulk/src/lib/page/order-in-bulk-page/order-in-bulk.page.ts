import { Component, ChangeDetectionStrategy } from '@angular/core';
import { InStockWorkwear, ProductCategories } from '@storefront/ui';

import { Hero } from '../../sections/hero/hero';

@Component({
  selector: 'lib-order-in-bulk-page',
  imports: [Hero, ProductCategories, InStockWorkwear],
  templateUrl: './order-in-bulk.page.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './order-in-bulk.page.scss',
})
export class OrderInBulkPage {}
