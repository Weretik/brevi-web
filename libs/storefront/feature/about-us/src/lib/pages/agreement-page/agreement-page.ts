import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PageHeader, PageHeaderConfig, ProductCategories } from '@storefront/ui';

@Component({
  selector: 'lib-agreement-page',
  imports: [PageHeader, ProductCategories, TranslocoPipe],
  templateUrl: './agreement-page.html',
  styleUrl: './agreement-page.scss',
})
export class AgreementPage {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly agreementConfig = computed<PageHeaderConfig>(() => {
    this.activeLang();
    return {
      title: this.transloco.translate('about.page.agreementTitle'),
      breadcrumbs: [
        this.transloco.translate('shared.home'),
        this.transloco.translate('header.menu.about'),
        this.transloco.translate('about.page.agreementTitle'),
      ],
      showSearch: false,
    };
  });
}
