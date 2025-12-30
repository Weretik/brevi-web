import { Component, input } from '@angular/core';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';

import { PageHeaderConfig } from './page-header.config';

@Component({
  selector: 'lib-page-header',
  imports: [IconField, InputIcon, InputText],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeader {
  config = input.required<PageHeaderConfig>();
}
