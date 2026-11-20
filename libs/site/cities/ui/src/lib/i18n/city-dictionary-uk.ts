type Named = { title: string; text: string };

/**
 * Ukrainian text of the blocks every city page shares. Functions take the city in the locative («у Харкові»);
 * the words written for one city are in `@site/cities/model`.
 */
export const CITY_DICTIONARY_UK = {
  breadcrumbsLabel: 'Хлібні крихти',
  home: 'Головна',
  request: 'Залишити заявку',
  kinds: {
    sewing: {
      breadcrumb: 'Пошиття',
      label: 'Пошиття на замовлення',
      title: (where: string) => `Пошиття спецодягу на замовлення ${where}`,
      pair: (where: string) => `Пошиття спецодягу ${where}`,
      needs: (where: string) => `Що шиємо для роботи ${where}`,
      products: 'Моделі власного пошиття',
      faq: (where: string) => `Питання про пошиття ${where}`,
      order: (where: string) => `Замовте пошиття спецодягу ${where}`,
      facts: [
        { title: 'від 5 одиниць', text: 'партія пошиття з вашим логотипом' },
        { title: 'Власний цех', text: 'шиємо в Полтаві без посередників' },
        { title: 'до 3 робочих днів', text: 'відправка після готовності та оплати' },
      ] as Named[],
    },
    workwear: {
      breadcrumb: 'Робочий одяг',
      label: 'Готовий робочий одяг',
      title: (where: string) => `Робочий одяг і спецодяг ${where}`,
      pair: (where: string) => `Робочий одяг ${where}`,
      needs: (where: string) => `Що купують для роботи ${where}`,
      products: 'Популярні моделі та засоби захисту',
      faq: (where: string) => `Питання про робочий одяг ${where}`,
      order: (where: string) => `Підберемо робочий одяг для команди ${where}`,
      facts: [
        { title: 'Одяг і ЗІЗ', text: 'костюми, куртки, взуття, рукавиці, окуляри' },
        { title: 'від 10 штук', text: 'оптова ціна однієї моделі' },
        { title: 'до 3 робочих днів', text: 'відправка після оплати' },
      ] as Named[],
    },
  },
  /** Replaces the delivery fact on the Poltava pages. */
  pickup: { title: 'Самовивіз', text: 'безкоштовно зі складу в Полтаві, кур’єр по місту 250 грн' },
  factsLabel: 'Умови',
  needsLabel: 'Для міста',
  productsLabel: 'Каталог',
  productsAll: 'Весь каталог',
  logo: {
    label: 'Логотип',
    title: 'Як наносимо логотип',
    more: 'Докладніше про нанесення',
    items: [
      { title: 'Вишивка', text: 'Не вигорає й не стирається, підходить для більшості тканин.' },
      {
        title: 'Термотрансфер',
        text: 'Для складних і кольорових логотипів, витримує часте прання.',
      },
      { title: 'Шовкодрук', text: 'Яскравий і чіткий друк, найвигідніший для великих партій.' },
    ] as Named[],
  },
  steps: {
    label: 'Як це працює',
    title: 'Як замовити пошиття з іншого міста',
    items: [
      { title: 'Заявка', text: 'Розкажіть, що й скільки шити, телефоном або через форму заявки.' },
      {
        title: 'Зразок',
        text: 'Погоджуємо модель, тканину й макет логотипа, за потреби надсилаємо зразок.',
      },
      { title: 'Договір', text: 'Готуємо договір і рахунок, працюємо з ПДВ.' },
      { title: 'Відправка', text: 'Шиємо партію й відправляємо Новою Поштою або САТ.' },
    ] as Named[],
  },
  prices: {
    label: 'Ціни',
    title: 'Ціна залежить від кількості',
    more: 'Ціни для опту',
    items: [
      { title: '1–9 шт', text: 'Роздрібна ціна: можна купити навіть одну річ.' },
      { title: '10–39 шт', text: 'Оптова ціна для бригади чи зміни.' },
      { title: 'від 40 шт', text: 'Найнижча ціна для великого замовлення.' },
    ] as Named[],
  },
  faqLabel: 'Питання',
  links: {
    label: 'Поруч',
    title: 'Інші міста',
    regions: 'Доставка в інші міста',
    regionsCrumb: 'Регіони',
  },
  order: {
    label: 'Замовлення',
    text: 'Залиште заявку або зателефонуйте: менеджер підбере моделі й порахує замовлення з доставкою.',
  },
};

export type CityDictionary = typeof CITY_DICTIONARY_UK;
