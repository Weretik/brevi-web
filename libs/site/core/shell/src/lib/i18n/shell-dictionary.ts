import type { Locale } from '@site/core/i18n';

const uk = {
  skipToContent: 'Перейти до вмісту',
  tagline: 'Власне швейне виробництво · Полтава',
  homeAria: 'Brevi — на головну',
  mainNav: 'Головне меню',
  catalogMenu: 'Розділи каталогу',
  allCatalog: 'Весь каталог',
  request: 'Заявка',
  call: 'Зателефонувати',
  openMenu: 'Відкрити меню',
  closeMenu: 'Закрити меню',
  menuTitle: 'Меню',
  languageSwitch: 'Мова сайту',
  footerTagline: 'Власне виробництво спецодягу',
  footerCompany: 'Компанія',
  footerBuyers: 'Покупцям',
  footerContacts: 'Контакти',
  copyright: 'Brevi. Всі права захищені.',
  links: {
    catalog: 'Каталог',
    logoPrinting: 'Пошиття з логотипом',
    wholesale: 'Ціни для опту',
    industries: 'Галузі',
    production: 'Про виробництво',
    contacts: 'Контакти',
    ourWork: 'Наші роботи',
    certificates: 'Сертифікати',
    articles: 'Статті',
    regions: 'Регіони',
    deliveryAndPayment: 'Доставка та оплата',
    returnsExchanges: 'Повернення та обмін',
    agreement: 'Угода користувача',
  },
};

export type ShellDictionary = typeof uk;

const ru: ShellDictionary = {
  skipToContent: 'Перейти к содержимому',
  tagline: 'Собственное швейное производство · Полтава',
  homeAria: 'Brevi — на главную',
  mainNav: 'Главное меню',
  catalogMenu: 'Разделы каталога',
  allCatalog: 'Весь каталог',
  request: 'Заявка',
  call: 'Позвонить',
  openMenu: 'Открыть меню',
  closeMenu: 'Закрыть меню',
  menuTitle: 'Меню',
  languageSwitch: 'Язык сайта',
  footerTagline: 'Собственное производство спецодежды',
  footerCompany: 'Компания',
  footerBuyers: 'Покупателям',
  footerContacts: 'Контакты',
  copyright: 'Brevi. Все права защищены.',
  links: {
    catalog: 'Каталог',
    logoPrinting: 'Пошив с логотипом',
    wholesale: 'Цены для опта',
    industries: 'Отрасли',
    production: 'О производстве',
    contacts: 'Контакты',
    ourWork: 'Наши работы',
    certificates: 'Сертификаты',
    articles: 'Статьи',
    regions: 'Регионы',
    deliveryAndPayment: 'Доставка и оплата',
    returnsExchanges: 'Возврат и обмен',
    agreement: 'Пользовательское соглашение',
  },
};

const DICTIONARIES: Record<Locale, ShellDictionary> = { uk, ru };

/** Header, footer, and menu text for a language. */
export const getShellDictionary = (locale: Locale): ShellDictionary => DICTIONARIES[locale];
