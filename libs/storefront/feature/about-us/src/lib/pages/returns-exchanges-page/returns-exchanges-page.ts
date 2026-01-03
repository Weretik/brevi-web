import { Component } from '@angular/core';
import { PageHeader, PageHeaderConfig, ProductCategories } from '@storefront/ui';

@Component({
  selector: 'lib-returns-exchanges-page',
  imports: [ProductCategories, PageHeader],
  templateUrl: './returns-exchanges-page.html',
  styleUrl: './returns-exchanges-page.scss',
})
export class ReturnsExchangesPage {
  returnsExchangesConfig: PageHeaderConfig = {
    title: 'Політика повернення та обміну товару',
    breadcrumbs: ['Головна', 'Про нас', 'Повернення та обмін товару'],
    showSearch: false,
  };
}
