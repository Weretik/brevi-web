import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ProductOverview } from '../product-overview/product-overview';
import { ProductTabs } from '../product-tabs/product-tabs';

@Component({
  selector: 'lib-product-content',
  imports: [ProductOverview, ProductTabs],
  templateUrl: './product-content.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './product-content.scss',
})
export class ProductContent {}
