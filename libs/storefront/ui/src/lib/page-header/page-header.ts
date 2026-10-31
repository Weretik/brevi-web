import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';

import { PageHeaderConfig } from './page-header.config';

@Component({
  selector: 'lib-page-header',
  imports: [IconField, InputIcon, InputText, TranslocoPipe],
  templateUrl: './page-header.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './page-header.scss',
})
export class PageHeader {
  config = input.required<PageHeaderConfig>();
}
