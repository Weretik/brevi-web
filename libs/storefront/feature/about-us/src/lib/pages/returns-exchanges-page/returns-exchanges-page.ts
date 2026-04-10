import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { PageHeader, PageHeaderConfig, ProductCategories } from '@storefront/ui';

@Component({
  selector: 'lib-returns-exchanges-page',
  imports: [ProductCategories, PageHeader],
  templateUrl: './returns-exchanges-page.html',
  styleUrl: './returns-exchanges-page.scss',
})
export class ReturnsExchangesPage {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly returnsExchangesConfig = computed<PageHeaderConfig>(() => {
    this.activeLang();
    return {
      title: this.transloco.translate('returns.page.title'),
      breadcrumbs: [
        this.transloco.translate('shared.home'),
        this.transloco.translate('header.menu.about'),
        this.transloco.translate('returns.page.title'),
      ],
      showSearch: false,
    };
  });
}
