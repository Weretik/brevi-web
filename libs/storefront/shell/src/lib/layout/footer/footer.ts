import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ThemeService } from '@shared/ui';
import { LocaleNavigationService } from '@storefront/util';

type FooterLink = {
  labelKey: string;
  routerLink: string[];
};

@Component({
  selector: 'lib-footer',
  imports: [NgClass, NgOptimizedImage, RouterLink, TranslocoPipe],
  templateUrl: './footer.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.scss',
})
export class Footer {
  readonly theme = inject(ThemeService);
  private readonly localeNavigation = inject(LocaleNavigationService);

  readonly companyLinks: FooterLink[] = [
    {
      labelKey: 'footer.link.aboutCompany',
      routerLink: this.localeNavigation.localizedPath('/about-company'),
    },
    {
      labelKey: 'footer.link.deliveryAndPayment',
      routerLink: this.localeNavigation.localizedPath('/delivery-and-payment'),
    },
    {
      labelKey: 'footer.link.returnsExchanges',
      routerLink: this.localeNavigation.localizedPath('/returns-exchanges'),
    },
    {
      labelKey: 'footer.link.contacts',
      routerLink: this.localeNavigation.localizedPath('/contacts'),
    },
  ];

  readonly informationLinks: FooterLink[] = [
    {
      labelKey: 'footer.link.orderInBulk',
      routerLink: this.localeNavigation.localizedPath('/order-in-bulk'),
    },
    {
      labelKey: 'footer.link.regions',
      routerLink: this.localeNavigation.localizedPath('/regions'),
    },
    {
      labelKey: 'footer.link.catalog',
      routerLink: this.localeNavigation.localizedPath('/catalog'),
    },
  ];

  readonly legalLinks: FooterLink[] = [
    {
      labelKey: 'footer.link.userAgreement',
      routerLink: this.localeNavigation.localizedPath('/agreement'),
    },
    {
      labelKey: 'footer.link.privacyPolicy',
      routerLink: this.localeNavigation.localizedPath('/agreement'),
    },
    {
      labelKey: 'footer.link.publicOffer',
      routerLink: this.localeNavigation.localizedPath('/agreement'),
    },
  ];
}
