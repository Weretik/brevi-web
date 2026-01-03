import { Component } from '@angular/core';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-agreement-page',
  imports: [PageHeader],
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
