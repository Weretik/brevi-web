import type { Locale } from '@site/core/i18n';

type Localized = Record<Locale, string>;

export type CatalogSection = {
  key: string;
  label: Localized;
  items: readonly { key: string; label: Localized }[];
};

/**
 * Catalog sections of the header mega menu, the footer, and the home page, taken from the Angular storefront menu.
 * Fixed until the catalog step reads the category tree from BreviERP; category slugs come with that tree.
 */
export const CATALOG_SECTIONS: readonly CatalogSection[] = [
  {
    key: 'summer',
    label: { uk: 'Спецодяг літній', ru: 'Летняя спецодежда' },
    items: [
      { key: 'summer-suits', label: { uk: 'Костюми робочі літні', ru: 'Костюмы рабочие летние' } },
      { key: 'summer-jackets', label: { uk: 'Куртки робочі літні', ru: 'Куртки рабочие летние' } },
      {
        key: 'summer-overalls',
        label: { uk: 'Комбінезони та напівкомбінезони', ru: 'Комбинезоны и полукомбинезоны' },
      },
      { key: 'summer-pants', label: { uk: 'Штани робочі літні', ru: 'Брюки рабочие летние' } },
    ],
  },
  {
    key: 'winter',
    label: { uk: 'Спецодяг зимовий', ru: 'Зимняя спецодежда' },
    items: [
      { key: 'winter-jackets', label: { uk: 'Куртки робочі зимові', ru: 'Куртки рабочие зимние' } },
      { key: 'winter-pants', label: { uk: 'Штани робочі зимові', ru: 'Брюки рабочие зимние' } },
      {
        key: 'winter-overalls',
        label: { uk: 'Напівкомбінезони зимові', ru: 'Полукомбинезоны зимние' },
      },
      { key: 'winter-vests', label: { uk: 'Жилети', ru: 'Жилеты' } },
    ],
  },
  {
    key: 'knitwear',
    label: { uk: 'Трикотаж', ru: 'Трикотаж' },
    items: [
      { key: 'knitwear-tshirts', label: { uk: 'Футболки робочі', ru: 'Футболки рабочие' } },
      { key: 'knitwear-polo', label: { uk: 'Теніски-поло', ru: 'Тенниски-поло' } },
      { key: 'knitwear-sweaters', label: { uk: 'Реглани та светри', ru: 'Регланы и свитеры' } },
    ],
  },
  {
    key: 'waterproof',
    label: { uk: 'Вологозахисний одяг', ru: 'Влагозащитная одежда' },
    items: [
      {
        key: 'waterproof-aprons',
        label: { uk: 'Фартухи вологозахисні', ru: 'Фартуки влагозащитные' },
      },
      {
        key: 'waterproof-suits',
        label: { uk: 'Костюми вологозахисні', ru: 'Костюмы влагозащитные' },
      },
      {
        key: 'waterproof-raincoats',
        label: { uk: 'Плащі вологозахисні', ru: 'Плащи влагозащитные' },
      },
    ],
  },
  {
    key: 'shoes',
    label: { uk: 'Робоче взуття', ru: 'Рабочая обувь' },
    items: [
      { key: 'shoes-summer', label: { uk: 'Літнє робоче взуття', ru: 'Летняя рабочая обувь' } },
      { key: 'shoes-winter', label: { uk: 'Зимове робоче взуття', ru: 'Зимняя рабочая обувь' } },
    ],
  },
  {
    key: 'handProtection',
    label: { uk: 'Захист рук', ru: 'Защита рук' },
    items: [
      { key: 'hands-knitted', label: { uk: 'Рукавички трикотажні', ru: 'Перчатки трикотажные' } },
      { key: 'hands-warmed', label: { uk: 'Рукавички утеплені', ru: 'Перчатки утепленные' } },
      { key: 'hands-nitrile', label: { uk: 'Рукавички нітрилові', ru: 'Перчатки нитриловые' } },
    ],
  },
  {
    key: 'eyeProtection',
    label: { uk: 'Захист очей', ru: 'Защита глаз' },
    items: [
      { key: 'eyes-glasses', label: { uk: 'Окуляри захисні', ru: 'Очки защитные' } },
      { key: 'eyes-shields', label: { uk: 'Щитки захисні', ru: 'Щитки защитные' } },
    ],
  },
  {
    key: 'respiratory',
    label: { uk: 'Захист дихання', ru: 'Защита дыхания' },
    items: [
      { key: 'respiratory-respirators', label: { uk: 'Респіратори', ru: 'Респираторы' } },
      { key: 'respiratory-filters', label: { uk: 'Фільтри', ru: 'Фильтры' } },
    ],
  },
];
