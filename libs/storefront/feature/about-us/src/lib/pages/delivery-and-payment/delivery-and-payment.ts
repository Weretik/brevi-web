import { Component } from '@angular/core';
import { PageHeader, PageHeaderConfig, ProductCategories } from '@storefront/ui';

@Component({
  selector: 'lib-delivery-and-payment',
  imports: [PageHeader, ProductCategories],
  templateUrl: './delivery-and-payment.html',
  styleUrl: './delivery-and-payment.scss',
})
export class DeliveryAndPayment {
  deliveryAndPaymentConfig: PageHeaderConfig = {
    title: 'Доставка та оплата',
    breadcrumbs: ['Головна', 'Про нас', 'Доставка та оплата'],
    showSearch: true,
  };
}
