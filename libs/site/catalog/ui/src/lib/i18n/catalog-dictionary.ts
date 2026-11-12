import type { Locale } from '@site/core/i18n';

/** Three plural forms of a counted noun: 1 модель, 2 моделі, 5 моделей. */
type Plural = { one: string; few: string; many: string };

/**
 * Text of the catalog root and category pages. Category names, snippets, and the text about a category
 * come from the catalog data, not from here. Prices come from the Admin; a product without one says so.
 */
const uk = {
  breadcrumbsLabel: 'Хлібні крихти',
  home: 'Головна',
  catalog: 'Каталог',
  label: 'Каталог',
  rootTitle: 'Каталог спецодягу та засобів захисту',
  rootLead:
    'Спецодяг власного пошиття і засоби індивідуального захисту. Замовлення від 5 виробів, ціна залежить від кількості.',
  sectionsLabel: 'Розділи каталогу',
  subcategoriesLabel: 'Підрозділи',
  allInSection: 'Усі моделі розділу',
  models: { one: 'модель', few: 'моделі', many: 'моделей' } as Plural,
  products: {
    label: 'Моделі',
    title: 'Моделі розділу',
    askPrice: 'Дізнатися ціну',
    priceFrom: 'від',
    noPhoto: 'Фото готується',
    empty: 'Моделі цього розділу скоро з’являться. Зателефонуйте, і менеджер підкаже наявність.',
    perPiece: 'грн/шт',
    tierNote: 'від 40 шт',
    own: 'Власне пошиття',
    model: 'Модель',
    fabric: 'Тканина',
    fabrics: { one: 'тканина', few: 'тканини', many: 'тканин' } as Plural,
  },
  listing: {
    all: 'Усі',
    tabs: 'Підрозділи',
    filters: 'Фільтри',
    filtersTitle: 'Фільтри та порядок',
    price: 'Ціна',
    priceTitle: 'Ціна за шт, грн',
    priceUpTo: 'до',
    priceOver: 'понад',
    type: 'Тип',
    types: { Sewing: 'Власне пошиття', Ppe: 'Засоби захисту' },
    fabric: 'Тканина',
    sort: 'Порядок',
    sorts: { default: 'Як у розділі', cheap: 'Спочатку дешевші', expensive: 'Спочатку дорожчі' },
    any: 'Будь-яка',
    anyType: 'Усі',
    reset: 'Скинути',
    show: 'Показати',
    close: 'Закрити',
    showMore: 'Показати ще',
    nothing:
      'Таких моделей у розділі немає. Змініть фільтри або зателефонуйте, і менеджер підбере схожу.',
    found: 'Знайдено',
  },
  search: {
    label: 'Пошук по каталогу',
    placeholder: 'Що шукаєте? Наприклад: куртка зимова, рукавички, ПРАЙМ',
    shortPlaceholder: 'Пошук: назва або модель',
    submit: 'Знайти',
    open: 'Пошук',
    products: 'Моделі',
    sections: 'Розділи',
    all: 'Усі результати',
    loading: 'Шукаємо…',
    priceFrom: 'від',
    none: 'Нічого не знайшли. Спробуйте інше слово: «куртка», «рукавички», «каска».',
    title: 'Пошук по каталогу',
    resultsFor: 'Результати для',
    empty: 'За цим запитом нічого не знайшли. Спробуйте інше слово або виберіть розділ каталогу.',
    lead: 'Шукайте за назвою моделі, її номером або видом виробу.',
  },
  groups: {
    Sewing: { title: 'Власне пошиття', lead: 'Шиємо в Полтаві: оберіть тканину, нанесемо логотип' },
    Ppe: { title: 'Засоби захисту', lead: 'Взуття, рукавички, каски, захист очей і дихання' },
  },
  about: { label: 'Про розділ' },
  product: {
    model: 'Модель',
    gallery: 'Фото моделі',
    photo: 'Фото',
    priceNote: 'Ціну під вашу кількість порахує менеджер. Залиште номер, і ми передзвонимо.',
    askPrice: 'Дізнатися ціну',
    request: 'Залишити заявку',
    fabric: 'Тканина',
    prices: 'Ціна за одиницю, грн',
    tiers: { retail: '1–9 шт', wholesale: '10–39 шт', largeWholesale: 'від 40 шт' },
    orderNote: 'Менеджер передзвонить за 15 хвилин і порахує ціну з логотипом.',
    facts: ['Від 5 виробів', 'З логотипом компанії', 'Доставка по Україні'],
    priceFrom: 'від',
    priceFromNote: 'грн за шт. при замовленні від 40',
    saving: 'Економія',
    currency: 'грн/шт',
    currencyShort: 'грн',
    description: { label: 'Опис', title: 'Опис моделі', more: 'Читати повністю', less: 'Згорнути' },
    specs: { title: 'Характеристики', summary: 'Коротко про модель' },
    related: { label: 'Схожі моделі', title: 'Інші моделі розділу', all: 'Усі моделі розділу' },
    nav: { label: 'Розділи сторінки', sizes: 'Таблиця розмірів' },
    priceBar: { label: 'Ціна моделі', request: 'Заявка' },
  },
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
    'Спецодежда собственного пошива и средства индивидуальной защиты. Заказ от 5 изделий, цена зависит от количества.',
  sectionsLabel: 'Разделы каталога',
  subcategoriesLabel: 'Подразделы',
  allInSection: 'Все модели раздела',
  models: { one: 'модель', few: 'модели', many: 'моделей' },
  products: {
    label: 'Модели',
    title: 'Модели раздела',
    askPrice: 'Узнать цену',
    priceFrom: 'от',
    noPhoto: 'Фото готовится',
    empty: 'Модели этого раздела скоро появятся. Позвоните, и менеджер подскажет наличие.',
    perPiece: 'грн/шт',
    tierNote: 'от 40 шт',
    own: 'Собственный пошив',
    model: 'Модель',
    fabric: 'Ткань',
    fabrics: { one: 'ткань', few: 'ткани', many: 'тканей' },
  },
  listing: {
    all: 'Все',
    tabs: 'Подразделы',
    filters: 'Фильтры',
    filtersTitle: 'Фильтры и порядок',
    price: 'Цена',
    priceTitle: 'Цена за шт, грн',
    priceUpTo: 'до',
    priceOver: 'более',
    type: 'Тип',
    types: { Sewing: 'Собственный пошив', Ppe: 'Средства защиты' },
    fabric: 'Ткань',
    sort: 'Порядок',
    sorts: { default: 'Как в разделе', cheap: 'Сначала дешевле', expensive: 'Сначала дороже' },
    any: 'Любая',
    anyType: 'Все',
    reset: 'Сбросить',
    show: 'Показать',
    close: 'Закрыть',
    showMore: 'Показать ещё',
    nothing:
      'Таких моделей в разделе нет. Измените фильтры или позвоните, и менеджер подберёт похожую.',
    found: 'Найдено',
  },
  search: {
    label: 'Поиск по каталогу',
    placeholder: 'Что ищете? Например: куртка зимняя, перчатки, ПРАЙМ',
    shortPlaceholder: 'Поиск: название или модель',
    submit: 'Найти',
    open: 'Поиск',
    products: 'Модели',
    sections: 'Разделы',
    all: 'Все результаты',
    loading: 'Ищем…',
    priceFrom: 'от',
    none: 'Ничего не нашли. Попробуйте другое слово: «куртка», «перчатки», «каска».',
    title: 'Поиск по каталогу',
    resultsFor: 'Результаты для',
    empty:
      'По этому запросу ничего не нашли. Попробуйте другое слово или выберите раздел каталога.',
    lead: 'Ищите по названию модели, её номеру или виду изделия.',
  },
  groups: {
    Sewing: { title: 'Собственный пошив', lead: 'Шьём в Полтаве: выберите ткань, нанесём логотип' },
    Ppe: { title: 'Средства защиты', lead: 'Обувь, перчатки, каски, защита глаз и дыхания' },
  },
  about: { label: 'О разделе' },
  product: {
    model: 'Модель',
    gallery: 'Фото модели',
    photo: 'Фото',
    priceNote: 'Цену под ваше количество посчитает менеджер. Оставьте номер, и мы перезвоним.',
    askPrice: 'Узнать цену',
    request: 'Оставить заявку',
    fabric: 'Ткань',
    prices: 'Цена за единицу, грн',
    tiers: { retail: '1–9 шт', wholesale: '10–39 шт', largeWholesale: 'от 40 шт' },
    orderNote: 'Менеджер перезвонит за 15 минут и посчитает цену с логотипом.',
    facts: ['От 5 изделий', 'С логотипом компании', 'Доставка по Украине'],
    priceFrom: 'от',
    priceFromNote: 'грн за шт. при заказе от 40',
    saving: 'Экономия',
    currency: 'грн/шт',
    currencyShort: 'грн',
    description: {
      label: 'Описание',
      title: 'Описание модели',
      more: 'Читать полностью',
      less: 'Свернуть',
    },
    specs: { title: 'Характеристики', summary: 'Коротко о модели' },
    related: { label: 'Похожие модели', title: 'Другие модели раздела', all: 'Все модели раздела' },
    nav: { label: 'Разделы страницы', sizes: 'Таблица размеров' },
    priceBar: { label: 'Цена модели', request: 'Заявка' },
  },
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

/**
 * «3 тканини»: a count with the form of its noun. Ukrainian and Russian pick the form by the same rule for
 * whole numbers, so the forms of either language work without the language itself.
 */
export function formatCount(count: number, forms: Plural): string {
  const rule = new Intl.PluralRules('uk').select(count);
  return `${count} ${rule === 'one' ? forms.one : rule === 'few' ? forms.few : forms.many}`;
}

const PRICE_FORMAT = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });

/** «1 250» or «1 250,5»: hryvnias with a space between thousands; the unit is written next to it. */
export function formatPrice(value: number): string {
  // Intl separates thousands with a no-break space of another kind in each runtime; keep one.
  return PRICE_FORMAT.format(value).replace(/\s/g, '\u00a0');
}
