import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { PageHeader, PageHeaderConfig, ProductCategories } from '@storefront/ui';

@Component({
  selector: 'lib-about-company',
  imports: [PageHeader, ProductCategories],
  templateUrl: './about-company.html',
  styleUrl: './about-company.scss',
})
export class AboutCompany {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly aboutCompanyConfig = computed<PageHeaderConfig>(() => {
    this.activeLang();
    return {
      title: this.transloco.translate('about.page.title'),
      breadcrumbs: [
        this.transloco.translate('shared.home'),
        this.transloco.translate('header.menu.about'),
        this.transloco.translate('about.page.title'),
      ],
      showSearch: true,
    };
  });
}
