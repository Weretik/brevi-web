import { Component } from '@angular/core';
import { PageHeader } from '@shared/ui/page-header/page-header';
import { PageHeaderConfig } from '@shared/ui/page-header/page-header.config';

@Component({
  selector: 'app-contacts',
  imports: [PageHeader],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  headerConfig: PageHeaderConfig = {
    title: 'Контакти',
    breadcrumbs: ['Головна', 'Контакти'],
    showSearch: true,
  };
}
