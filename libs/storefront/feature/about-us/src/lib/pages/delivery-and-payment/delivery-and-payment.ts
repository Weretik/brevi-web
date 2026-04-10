import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { PageHeader, PageHeaderConfig, ProductCategories } from '@storefront/ui';

@Component({
  selector: 'lib-delivery-and-payment',
  imports: [PageHeader, ProductCategories],
  templateUrl: './delivery-and-payment.html',
  styleUrl: './delivery-and-payment.scss',
})
export class DeliveryAndPayment {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly deliveryAndPaymentConfig = computed<PageHeaderConfig>(() => {
    this.activeLang();
    return {
      title: this.transloco.translate('delivery.page.title'),
      breadcrumbs: [
        this.transloco.translate('shared.home'),
        this.transloco.translate('header.menu.about'),
        this.transloco.translate('delivery.page.title'),
      ],
      showSearch: true,
    };
  });
}
