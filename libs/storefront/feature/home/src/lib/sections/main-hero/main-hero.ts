import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

@Component({
  selector: 'lib-main-hero',
  imports: [ButtonLabel, ButtonDirective, TranslocoPipe],
  templateUrl: './main-hero.html',
  styleUrl: './main-hero.scss',
})
export class MainHero {}
