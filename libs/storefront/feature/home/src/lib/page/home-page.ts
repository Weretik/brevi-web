import { Component } from '@angular/core';

import { MainHero } from '../sections/main-hero/main-hero';

@Component({
  selector: 'lib-home-page',
  imports: [MainHero],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {}
