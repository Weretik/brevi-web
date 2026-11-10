import type { Locale } from '@site/core/i18n';

const uk = {
  breadcrumbsLabel: 'Хлібні крихти',
  home: 'Головна',
  breadcrumb: 'Наші роботи',
  label: 'Приклади',
  title: 'Наші роботи',
  lead: 'Приклади робочого одягу, який ми пошили для підприємств: костюми, куртки, напівкомбінезони, жилети й кепки з логотипами замовників.',
  gallery: {
    label: 'Галерея',
    title: 'Приклади зразків робочого одягу від Brevi',
    photoAlt: 'Робочий одяг Brevi, приклад роботи',
    open: 'Відкрити фото',
  },
  order: {
    label: 'Замовлення',
    title: 'Хочете такий самий одяг для своєї команди?',
    text: 'Розкажіть, що і скільки потрібно, або надішліть фото форми, яка вам подобається. Підберемо модель і тканину та покажемо логотип на виробі.',
    discuss: 'Обговорити пошиття спецодягу',
    production: 'Про виробництво',
  },
};

export type WorksDictionary = typeof uk;

const ru: WorksDictionary = {
  breadcrumbsLabel: 'Хлебные крошки',
  home: 'Главная',
  breadcrumb: 'Наши работы',
  label: 'Примеры',
  title: 'Наши работы',
  lead: 'Примеры рабочей одежды, которую мы сшили для предприятий: костюмы, куртки, полукомбинезоны, жилеты и кепки с логотипами заказчиков.',
  gallery: {
    label: 'Галерея',
    title: 'Примеры образцов рабочей одежды от Brevi',
    photoAlt: 'Рабочая одежда Brevi, пример работы',
    open: 'Открыть фото',
  },
  order: {
    label: 'Заказ',
    title: 'Хотите такую же одежду для своей команды?',
    text: 'Расскажите, что и сколько нужно, или пришлите фото формы, которая вам нравится. Подберём модель и ткань и покажем логотип на изделии.',
    discuss: 'Обсудить пошив спецодежды',
    production: 'О производстве',
  },
};

const DICTIONARIES: Record<Locale, WorksDictionary> = { uk, ru };

export function getWorksDictionary(locale: Locale): WorksDictionary {
  return DICTIONARIES[locale];
}
