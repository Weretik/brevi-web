import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lib-product-categories',
  imports: [],
  templateUrl: './product-categories.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './product-categories.scss',
})
export class ProductCategories {}
