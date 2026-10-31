import { Component, ChangeDetectionStrategy } from '@angular/core';

import { ProductContent } from '../../sections/product-content/product-content';
import { ProductHeader } from '../../sections/product-header/product-header';

@Component({
  selector: 'lib-product-page',
  imports: [ProductHeader, ProductContent],
  templateUrl: './product.page.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './product.page.scss',
})
export class ProductPage {}
