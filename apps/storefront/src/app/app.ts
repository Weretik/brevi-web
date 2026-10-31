import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer, Header } from '@storefront/shell';
import { Toast } from 'primeng/toast';

import { SeoHreflangService } from './seo/seo-hreflang.service';

@Component({
  imports: [RouterModule, Toast, Footer, Header],
  selector: 'app-root',
  templateUrl: './app.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App {
  private readonly seoHreflangService = inject(SeoHreflangService);
  protected title = 'storefront';

  constructor() {
    void this.seoHreflangService;
  }
}
