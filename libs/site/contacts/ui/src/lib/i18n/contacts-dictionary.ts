import type { Locale } from '@site/core/i18n';

/** Text of the live `brevi.com.ua` page «Контакти»; `ru` is its translation. */
const uk = {
  breadcrumbsLabel: 'Хлібні крихти',
  home: 'Головна',
  breadcrumb: 'Контакти',
  label: 'Зворотний зв’язок',
  title: 'Контакти Brevi',
  lead: 'Телефонуйте або пишіть: підкажемо щодо моделей, тканини, логотипа, строків і доставки.',
  info: {
    label: 'Контактна інформація',
    title: 'Наша контактна інформація',
    phones: 'Телефон',
    email: 'Пошта',
    address: 'Адреса',
    country: 'Україна',
    cityPrefix: 'м.',
    service:
      'Працюємо по всій Україні: Київ, Харків, Львів, Одеса, Запоріжжя, Кривий Ріг, Вінниця.',
    hours: 'Графік роботи',
    weekdays: 'понеділок — п’ятниця',
    weekend: 'субота — неділя',
    dayOff: 'вихідні',
    mapTitle: 'Brevi на карті: Полтава, вул. Кагамлика, 3А',
    openMap: 'Відкрити в Картах',
  },
  managers: {
    label: 'Менеджери',
    title: 'Менеджери по роботі з клієнтами',
    phones: 'Номери телефонів',
    photoAlt: 'менеджер Brevi',
  },
};

export type ContactsDictionary = typeof uk;

const ru: ContactsDictionary = {
  breadcrumbsLabel: 'Хлебные крошки',
  home: 'Главная',
  breadcrumb: 'Контакты',
  label: 'Обратная связь',
  title: 'Контакты Brevi',
  lead: 'Звоните или пишите: подскажем по моделям, ткани, логотипу, срокам и доставке.',
  info: {
    label: 'Контактная информация',
    title: 'Наша контактная информация',
    phones: 'Телефон',
    email: 'Почта',
    address: 'Адрес',
    country: 'Украина',
    cityPrefix: 'г.',
    service:
      'Работаем по всей Украине: Киев, Харьков, Львов, Одесса, Запорожье, Кривой Рог, Винница.',
    hours: 'График работы',
    weekdays: 'понедельник — пятница',
    weekend: 'суббота — воскресенье',
    dayOff: 'выходные',
    mapTitle: 'Brevi на карте: Полтава, ул. Кагамлыка, 3А',
    openMap: 'Открыть в Картах',
  },
  managers: {
    label: 'Менеджеры',
    title: 'Менеджеры по работе с клиентами',
    phones: 'Номера телефонов',
    photoAlt: 'менеджер Brevi',
  },
};

const DICTIONARIES: Record<Locale, ContactsDictionary> = { uk, ru };

export function getContactsDictionary(locale: Locale): ContactsDictionary {
  return DICTIONARIES[locale];
}
