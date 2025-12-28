import { Component, input } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { PageHeaderConfig } from './page-header.config';

@Component({
  selector: 'app-page-header',
  imports: [IconField, InputIcon, InputText],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeader {
  config = input.required<PageHeaderConfig>();
}
