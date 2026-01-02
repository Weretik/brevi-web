import { Component } from '@angular/core';

import { AboutPreview } from '../sections/about-preview/about-preview';
import { MainHero } from '../sections/main-hero/main-hero';

@Component({
  selector: 'lib-home-page',
  imports: [MainHero, AboutPreview],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {}
