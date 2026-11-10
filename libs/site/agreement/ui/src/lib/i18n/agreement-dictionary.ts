import { AGREEMENT_RU } from '../data/agreement-ru';
import { AGREEMENT_UK } from '../data/agreement-uk';

import type { AgreementText } from '../data/agreement-text';
import type { Locale } from '@site/core/i18n';

/** Labels around the public offer. The offer itself is in `data/` and is not edited here. */
const uk = {
  breadcrumbsLabel: 'Хлібні крихти',
  home: 'Головна',
  breadcrumb: 'Договір',
  label: 'Покупцям',
  title: 'Договір публічної оферти купівлі-продажу товарів',
  contentsLabel: 'Зміст',
  contentsTitle: 'Зміст договору',
  requisites: {
    label: 'Реквізити',
    title: 'Місцезнаходження і реквізити продавця',
    recipient: 'Продавець',
    edrpou: 'Код ЄДРПОУ',
    taxId: 'ІПН',
    address: 'Адреса',
    postalAddress: '36002, м. Полтава, вул. Кагамлика, буд. 3А',
    iban: 'IBAN',
    bank: 'Банк',
    phone: 'Телефон',
    email: 'E-mail',
  },
  related: {
    delivery: 'Доставка та оплата',
    returns: 'Повернення та обмін',
    contacts: 'Контакти',
  },
};

export type AgreementDictionary = typeof uk;

const ru: AgreementDictionary = {
  breadcrumbsLabel: 'Хлебные крошки',
  home: 'Главная',
  breadcrumb: 'Договор',
  label: 'Покупателям',
  title: 'Договор публичной оферты купли-продажи товаров',
  contentsLabel: 'Содержание',
  contentsTitle: 'Содержание договора',
  requisites: {
    label: 'Реквизиты',
    title: 'Местонахождение и реквизиты продавца',
    recipient: 'Продавец',
    edrpou: 'Код ЕГРПОУ',
    taxId: 'ИНН',
    address: 'Адрес',
    postalAddress: '36002, г. Полтава, ул. Кагамлыка, д. 3А',
    iban: 'IBAN',
    bank: 'Банк',
    phone: 'Телефон',
    email: 'E-mail',
  },
  related: {
    delivery: 'Доставка и оплата',
    returns: 'Возврат и обмен',
    contacts: 'Контакты',
  },
};

const DICTIONARIES: Record<Locale, AgreementDictionary> = { uk, ru };
const TEXTS: Record<Locale, AgreementText> = { uk: AGREEMENT_UK, ru: AGREEMENT_RU };

/** Seller tax number from the offer; the other details come from `COMPANY`. */
export const AGREEMENT_TAX_ID = '355216316015';

/** Labels of the «Договір» page for a language. */
export const getAgreementDictionary = (locale: Locale): AgreementDictionary => DICTIONARIES[locale];

/** The public offer for a language. */
export const getAgreementText = (locale: Locale): AgreementText => TEXTS[locale];

/** Anchor of a section, for example `agreement-5`. */
export const agreementSectionId = (number: string): string => `agreement-${number}`;
