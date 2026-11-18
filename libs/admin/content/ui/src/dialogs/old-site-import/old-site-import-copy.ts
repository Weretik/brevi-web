/** Words of the dialog; the defaults are those of the product transfer. */
export interface OldSiteImportCopy {
  title: string;
  intro: string;
  /** Label of «show on the site»; empty hides the switch (the redirect transfer has none). */
  showOnSite: string;
  overwrite: string;
  done: string;
  /** «Сторінок у файлі» */
  total: string;
  notMatched: string;
}

export const productCopy: OldSiteImportCopy = {
  title: 'Перенести тексти зі старого сайту',
  intro:
    'Файл перенесення містить назви, SEO, опис і характеристики товарів старого сайту двома мовами. Сторінка знаходить свій товар за посиланням старого сайту з картки товару. Спершу показуємо, що буде зроблено; нічого не зберігається, доки не натиснути «Перенести».',
  showOnSite: 'Одразу показувати перенесені товари на сайті',
  overwrite: 'Замінити тексти сторінок, які вже заповнені',
  done: 'Тексти перенесено.',
  total: 'Сторінок у файлі',
  notMatched: 'Не знайдено товар у «Товари»',
};
