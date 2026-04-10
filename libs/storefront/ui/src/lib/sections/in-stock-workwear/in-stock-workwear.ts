import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

@Component({
  selector: 'lib-in-stock-workwear',
  imports: [ButtonDirective, ButtonLabel, TranslocoPipe],
  templateUrl: './in-stock-workwear.html',
  styleUrl: './in-stock-workwear.scss',
})
export class InStockWorkwear {}
