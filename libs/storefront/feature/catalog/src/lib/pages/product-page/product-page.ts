import { Component } from '@angular/core';

import { ProductPageContentSection } from '../../sections/product-page-content-section/product-page-content-section';
import { ProductPageHeaderSection } from '../../sections/product-page-header-section/product-page-header-section';

@Component({
  selector: 'lib-product-page',
  imports: [ProductPageHeaderSection, ProductPageContentSection],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})
export class ProductPage {}
