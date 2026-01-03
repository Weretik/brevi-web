import { Component } from '@angular/core';
import { PageHeader, PageHeaderConfig, ProductCategories } from '@storefront/ui';

@Component({
  selector: 'lib-about-company',
  imports: [PageHeader, ProductCategories],
  templateUrl: './about-company.html',
  styleUrl: './about-company.scss',
})
export class AboutCompany {
  aboutCompanyConfig: PageHeaderConfig = {
    title: 'Про компанію',
    breadcrumbs: ['Головна', 'Про нас', 'Про компанію'],
    showSearch: true,
  };
}
