import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocaleNavigationService } from '@storefront/util';
import { Button } from 'primeng/button';

@Component({
  selector: 'lib-product-list',
  imports: [Button, RouterLink, TranslocoPipe],
  templateUrl: './product-list.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './product-list.scss',
})
export class ProductList {
  private readonly localeNavigation = inject(LocaleNavigationService);

  protected productPageLink(): string[] {
    return this.localeNavigation.localizedPath('/product-page');
  }
}
