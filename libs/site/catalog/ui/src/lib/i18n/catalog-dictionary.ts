import type { Locale } from '@site/core/i18n';

/** Three plural forms of a counted noun: 1 модель, 2 моделі, 5 моделей. */
type Plural = { one: string; few: string; many: string };

/**
 * Text of the catalog root and category pages. Category names, snippets, and the text about a category
 * come from the catalog data, not from here. Listings show no prices: a manager quotes them on request.
 */
const uk = {
  breadcrumbsLabel: 'Хлібні крихти',
  home: 'Головна',
  catalog: 'Каталог',
  label: 'Каталог',
  rootTitle: 'Каталог спецодягу та засобів захисту',
  rootLead:
    'Спецодяг власного пошиття і засоби індивідуального захисту. Замовлення від 5 виробів, ціну під ваш обсяг порахує менеджер.',
  sectionsLabel: 'Розділи каталогу',
  subcategoriesLabel: 'Підрозділи',
  allInSection: 'Усі моделі розділу',
  models: { one: 'модель', few: 'моделі', many: 'моделей' } as Plural,
  products: {
    label: 'Моделі',
    title: 'Моделі розділу',
    askPrice: 'Дізнатися ціну',
    noPhoto: 'Фото готується',
  },
  about: { label: 'Про розділ' },
  order: {
    label: 'Замовлення',
    title: 'Не знайшли потрібну модель?',
    text: 'Пошиємо під ваше завдання: з тканини іншого кольору та з логотипом вашої компанії. Залиште номер, і менеджер передзвонить.',
    request: 'Залишити заявку',
    logo: 'Пошиття з логотипом',
    wholesale: 'Ціни для опту',
  },
};

export type CatalogDictionary = typeof uk;

const ru: CatalogDictionary = {
  breadcrumbsLabel: 'Хлебные крошки',
  home: 'Главная',
  catalog: 'Каталог',
  label: 'Каталог',
  rootTitle: 'Каталог спецодежды и средств защиты',
  rootLead:
    'Спецодежда собственного пошива и средства индивидуальной защиты. Заказ от 5 изделий, цену под ваш объём посчитает менеджер.',
  sectionsLabel: 'Разделы каталога',
  subcategoriesLabel: 'Подразделы',
  allInSection: 'Все модели раздела',
  models: { one: 'модель', few: 'модели', many: 'моделей' },
  products: {
    label: 'Модели',
    title: 'Модели раздела',
    askPrice: 'Узнать цену',
    noPhoto: 'Фото готовится',
  },
  about: { label: 'О разделе' },
  order: {
    label: 'Заказ',
    title: 'Не нашли нужную модель?',
    text: 'Пошьём под вашу задачу: из ткани другого цвета и с логотипом вашей компании. Оставьте номер, и менеджер перезвонит.',
    request: 'Оставить заявку',
    logo: 'Пошив с логотипом',
    wholesale: 'Цены для опта',
  },
};

const DICTIONARIES: Record<Locale, CatalogDictionary> = { uk, ru };

export function getCatalogDictionary(locale: Locale): CatalogDictionary {
  return DICTIONARIES[locale];
}

/** «85 моделей», «3 моделі», «1 модель» by the plural rules of the language. */
export function formatModelCount(locale: Locale, count: number): string {
  const forms = DICTIONARIES[locale].models;
  const rule = new Intl.PluralRules(locale).select(count);
  const word = rule === 'one' ? forms.one : rule === 'few' ? forms.few : forms.many;
  return `${count} ${word}`;
}
