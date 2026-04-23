import { Component } from '@angular/core';

import { ProductPageOverviewSection } from '../product-page-overview-section/product-page-overview-section';
import { ProductPageTabsSection } from '../product-page-tabs-section/product-page-tabs-section';

@Component({
  selector: 'lib-product-page-content-section',
  imports: [ProductPageOverviewSection, ProductPageTabsSection],
  templateUrl: './product-page-content-section.html',
  styleUrl: './product-page-content-section.scss',
})
export class ProductPageContentSection {}
