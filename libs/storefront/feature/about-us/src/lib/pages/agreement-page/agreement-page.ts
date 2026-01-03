import { Component } from '@angular/core';
import { PageHeader, PageHeaderConfig, ProductCategories } from '@storefront/ui';

@Component({
  selector: 'lib-agreement-page',
  imports: [PageHeader, ProductCategories],
  templateUrl: './agreement-page.html',
  styleUrl: './agreement-page.scss',
})
export class AgreementPage {
  agreementConfig: PageHeaderConfig = {
    title: 'Договір',
    breadcrumbs: ['Головна', 'Про нас', 'Договір'],
    showSearch: false,
  };
}
