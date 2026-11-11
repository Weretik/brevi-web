import type { Locale } from '@site/core/i18n';

const uk = {
  breadcrumbsLabel: 'Хлібні крихти',
  home: 'Головна',
  breadcrumb: 'Статті',
  label: 'Корисне',
  title: 'Статті',
  lead: 'Як обрати спецодяг, з яких тканин його шиють, як за ним доглядати та навіщо він потрібен підприємству.',
  list: {
    label: 'Усі статті',
    title: 'Статті про робочий одяг',
    read: 'Читати',
    empty: 'Статті скоро з’являться тут.',
  },
  article: {
    published: 'Опубліковано',
    more: {
      label: 'Читайте також',
      title: 'Інші статті',
      all: 'Усі статті',
    },
    order: {
      label: 'Замовлення',
      title: 'Потрібен спецодяг для команди?',
      text: 'Розкажіть, що і скільки потрібно. Підберемо модель і тканину та покажемо логотип на виробі.',
      discuss: 'Обговорити пошиття спецодягу',
      production: 'Про виробництво',
    },
  },
};

export type ArticlesDictionary = typeof uk;

const ru: ArticlesDictionary = {
  breadcrumbsLabel: 'Хлебные крошки',
  home: 'Главная',
  breadcrumb: 'Статьи',
  label: 'Полезное',
  title: 'Статьи',
  lead: 'Как выбрать спецодежду, из каких тканей её шьют, как за ней ухаживать и зачем она нужна предприятию.',
  list: {
    label: 'Все статьи',
    title: 'Статьи о рабочей одежде',
    read: 'Читать',
    empty: 'Статьи скоро появятся здесь.',
  },
  article: {
    published: 'Опубликовано',
    more: {
      label: 'Читайте также',
      title: 'Другие статьи',
      all: 'Все статьи',
    },
    order: {
      label: 'Заказ',
      title: 'Нужна спецодежда для команды?',
      text: 'Расскажите, что и сколько нужно. Подберём модель и ткань и покажем логотип на изделии.',
      discuss: 'Обсудить пошив спецодежды',
      production: 'О производстве',
    },
  },
};

const DICTIONARIES: Record<Locale, ArticlesDictionary> = { uk, ru };

export function getArticlesDictionary(locale: Locale): ArticlesDictionary {
  return DICTIONARIES[locale];
}
