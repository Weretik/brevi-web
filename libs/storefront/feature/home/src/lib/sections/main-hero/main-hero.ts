import { Component } from '@angular/core';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

@Component({
  selector: 'lib-main-hero',
  imports: [ButtonLabel, ButtonDirective],
  templateUrl: './main-hero.html',
  styleUrl: './main-hero.scss',
})
export class MainHero {}
