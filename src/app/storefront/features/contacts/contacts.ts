import { Component } from '@angular/core';
import { PageHeader } from '@shared/ui/page-header/page-header';

@Component({
  selector: 'app-contacts',
  imports: [PageHeader],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  headerConfig = {
    title: 'Subscribers',
    breadcrumbs: ['Application', 'Customer Management', 'Subscribers'],
    showSearch: true,
  } as const;
}
