import { Component } from '@angular/core';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

import { OurTeam } from '../sections/our-team/our-team';
import { ContactUs } from '../sections/сontact-us/contact-us';

@Component({
  selector: 'lib-contacts-page',
  imports: [PageHeader, OurTeam, ContactUs],
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
