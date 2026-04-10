import { CommonModule, NgClass, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ThemeService } from '@shared/ui';
import { LocaleNavigationService, StorefrontLocale } from '@storefront/util';
import { ButtonModule } from 'primeng/button';
import { MegaMenu } from 'primeng/megamenu';
import { StyleClassModule } from 'primeng/styleclass';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { HEADER_MEGA_MENU_PT } from './header.mega-menu.pt';
import { buildMenu } from './header.menu';

@Component({
  selector: 'lib-header',
  imports: [
    CommonModule,
    ButtonModule,
    StyleClassModule,
    NgOptimizedImage,
    NgClass,
    ToggleButtonModule,
    FormsModule,
    RouterLink,
    MegaMenu,
    TranslocoPipe,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);
  private readonly transloco = inject(TranslocoService);
  private readonly localeNavigation = inject(LocaleNavigationService);

  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly items = computed(() => {
    this.activeLang();
    const currentLocale = this.localeNavigation.getCurrentLocale();
    return buildMenu(currentLocale, (key) => this.transloco.translate(key));
  });

  readonly currentLocale = computed<StorefrontLocale>(() =>
    this.activeLang() === 'ru' ? 'ru' : 'uk',
  );

  readonly homeLink = computed(() => {
    const currentLocale = this.localeNavigation.getCurrentLocale();
    return ['/', currentLocale];
  });

  constructor() {
    this.themeService.init();
  }

  switchLocale(locale: StorefrontLocale): void {
    if (locale === this.currentLocale()) return;

    this.transloco.setActiveLang(locale);
    this.localeNavigation.saveLocale(locale);
    const localizedUrl = this.localeNavigation.localizedUrlForLocale(this.router.url, locale);
    void this.router.navigateByUrl(localizedUrl);
  }

  localeHref(locale: StorefrontLocale): string {
    return this.localeNavigation.localizedUrlForLocale(this.router.url, locale);
  }

  public readonly megaMenuPt = HEADER_MEGA_MENU_PT;
}
