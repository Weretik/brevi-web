import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

@Component({
  selector: 'lib-in-stock-workwear',
  imports: [ButtonDirective, ButtonLabel, TranslocoPipe],
  templateUrl: './in-stock-workwear.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './in-stock-workwear.scss',
})
export class InStockWorkwear {}
