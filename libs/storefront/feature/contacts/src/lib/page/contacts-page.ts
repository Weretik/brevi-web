import { Component } from '@angular/core';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

import { OurTeam } from '../sections/our-team/our-team';

@Component({
  selector: 'lib-contacts-page',
  imports: [PageHeader, OurTeam],
  templateUrl: './contacts-page.html',
  styleUrl: './contacts-page.scss',
})
export class ContactsPage {
  headerConfig: PageHeaderConfig = {
    title: 'Контакти',
    breadcrumbs: ['Головна', 'Контакти'],
    showSearch: true,
  };
}
