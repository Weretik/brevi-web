import { Component } from '@angular/core';
import { ButtonDirective, ButtonLabel } from 'primeng/button';

@Component({
  selector: 'lib-hero',
  imports: [ButtonDirective, ButtonLabel],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {}
