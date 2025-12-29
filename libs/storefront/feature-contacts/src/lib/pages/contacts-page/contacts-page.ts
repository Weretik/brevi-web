import { Component } from '@angular/core';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-contacts-page',
  imports: [PageHeader],
  templateUrl: './contacts-page.html',
  styleUrl: './contacts-page.css',
})
export class ContactsPage {
  headerConfig: PageHeaderConfig = {
    title: 'Контакти',
    breadcrumbs: ['Головна', 'Контакти'],
    showSearch: true,
  };
}
