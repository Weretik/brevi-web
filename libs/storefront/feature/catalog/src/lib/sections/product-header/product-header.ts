import { Component, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-product-header',
  imports: [PageHeader],
  templateUrl: './product-header.html',
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- Preserve pre-Angular-22 eager rendering during the framework migration.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './product-header.scss',
})
export class ProductHeader {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly productPageConfig = computed<PageHeaderConfig>(() => {
    this.activeLang();
    return {
      title: this.transloco.translate('catalog.productPage.title'),
      breadcrumbs: [
        this.transloco.translate('shared.home'),
        this.transloco.translate('catalog.productsList.pageTitle'),
        this.transloco.translate('catalog.productsList.sectionTitle'),
        this.transloco.translate('catalog.productPage.title'),
      ],
      showSearch: false,
    };
  });
}
