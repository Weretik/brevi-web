import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { LocaleNavigationService } from '@storefront/util';
import { Button } from 'primeng/button';

@Component({
  selector: 'lib-product-list',
  imports: [Button, RouterLink, TranslocoPipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductList {
  private readonly localeNavigation = inject(LocaleNavigationService);

  protected productPageLink(): string[] {
    return this.localeNavigation.localizedPath('/product-page');
  }
}
