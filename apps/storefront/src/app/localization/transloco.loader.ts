import { Injectable } from '@angular/core';
import { TranslocoLoader, Translation } from '@jsverse/transloco';
import { Observable, of } from 'rxjs';

import { ruAboutTranslation, ukAboutTranslation } from './translations/about.translation';
import {
  ruAgreementTranslation,
  ukAgreementTranslation,
} from './translations/agreement.translation';
import { ruArticlesTranslation, ukArticlesTranslation } from './translations/articles.translation';
import {
  ruCatalogExtraTranslation,
  ukCatalogExtraTranslation,
} from './translations/catalog-extra.translation';
import { ruCatalogTranslation, ukCatalogTranslation } from './translations/catalog.translation';
import { ruContactsTranslation, ukContactsTranslation } from './translations/contacts.translation';
import {
  ruDeliveryPaymentTranslation,
  ukDeliveryPaymentTranslation,
} from './translations/delivery-payment.translation';
import { ruFooterTranslation, ukFooterTranslation } from './translations/footer.translation';
import { ruHeaderTranslation, ukHeaderTranslation } from './translations/header.translation';
import { ruHomeTranslation, ukHomeTranslation } from './translations/home.translation';
import { ruNotFoundTranslation, ukNotFoundTranslation } from './translations/not-found.translation';
import { ruRegionsTranslation, ukRegionsTranslation } from './translations/regions.translation';
import { ruReturnsTranslation, ukReturnsTranslation } from './translations/returns.translation';
import { ruTranslation } from './translations/ru.translation';
import { ukTranslation } from './translations/uk.translation';

const TRANSLATIONS: Record<string, Translation> = {
  uk: {
    ...ukTranslation,
    ...ukHeaderTranslation,
    ...ukNotFoundTranslation,
    ...ukFooterTranslation,
    ...ukCatalogTranslation,
    ...ukCatalogExtraTranslation,
    ...ukAboutTranslation,
    ...ukAgreementTranslation,
    ...ukArticlesTranslation,
    ...ukContactsTranslation,
    ...ukDeliveryPaymentTranslation,
    ...ukReturnsTranslation,
    ...ukRegionsTranslation,
    ...ukHomeTranslation,
  },
  ru: {
    ...ruTranslation,
    ...ruHeaderTranslation,
    ...ruNotFoundTranslation,
    ...ruFooterTranslation,
    ...ruCatalogTranslation,
    ...ruCatalogExtraTranslation,
    ...ruAboutTranslation,
    ...ruAgreementTranslation,
    ...ruArticlesTranslation,
    ...ruContactsTranslation,
    ...ruDeliveryPaymentTranslation,
    ...ruReturnsTranslation,
    ...ruRegionsTranslation,
    ...ruHomeTranslation,
  },
};

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  getTranslation(lang: string): Observable<Translation> {
    return of(TRANSLATIONS[lang] ?? TRANSLATIONS['uk']);
  }
}
