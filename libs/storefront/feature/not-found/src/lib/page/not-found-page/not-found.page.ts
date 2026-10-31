import { Location } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocaleNavigationService } from '@storefront/util';
import { ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';

@Component({
  selector: 'lib-not-found-page',
  imports: [ButtonIcon, ButtonDirective, ButtonLabel, TranslocoPipe, RouterLink],
  templateUrl: './not-found.page.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './not-found.page.css',
})
export class NotFoundPage {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly localeNavigation = inject(LocaleNavigationService);

  protected catalogLink(): string[] {
    return this.localeNavigation.localizedSegments('catalog', 'products');
  }

  protected goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    void this.router.navigate(this.localeNavigation.localizedSegments());
  }
}
