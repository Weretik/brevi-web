/**
 * Demo data for the overview page. There is no dashboard backend yet; the page
 * labels itself «Демо-дані» and every value here is an example.
 */

export type StatusTone = 'success' | 'warning' | 'error' | 'info';

export interface DashboardMetric {
  label: string;
  value: string;
  note?: { text: string; tone?: 'success' | 'error' };
}

export interface WorkshopOrder {
  number: string;
  client: string;
  product: string;
  quantity: number;
  progress: number;
  due: string;
  overdue?: boolean;
}

export interface WorkshopStage {
  id: string;
  label: string;
  tone: 'neutral' | 'primary' | 'secondary' | 'info' | 'success';
  orders: readonly WorkshopOrder[];
}

export interface DemoQuote {
  number: string;
  client: string;
  product: string;
  quantity: number;
  amount: number;
  status: { label: string; tone: StatusTone };
}

export interface SeamstressLoad {
  initials: string;
  name: string;
  load: number;
}

export const dashboardMetrics: readonly DashboardMetric[] = [
  { label: 'Ліди сьогодні', value: '3', note: { text: '+1', tone: 'success' } },
  { label: 'КП в роботі', value: '8' },
  { label: 'У цеху', value: '14', note: { text: 'виробів 612' } },
  { label: 'Прострочено', value: '2', note: { text: 'увага', tone: 'error' } },
  { label: 'Відвантажити', value: '3', note: { text: 'до пт' } },
  { label: 'Каса цеху', value: '18 420', note: { text: '₴' } },
];

export const workshopStages: readonly WorkshopStage[] = [
  {
    id: 'cutting',
    label: 'Розкрій',
    tone: 'neutral',
    orders: [
      {
        number: 'ЗМ-311',
        client: 'ТОВ «Агро-Лідер»',
        product: 'Костюм «Захист»',
        quantity: 120,
        progress: 15,
        due: '05.11',
      },
      {
        number: 'ЗМ-314',
        client: 'ТОВ «Нива-Схід»',
        product: 'Фартух ПВХ',
        quantity: 60,
        progress: 40,
        due: '07.11',
      },
    ],
  },
  {
    id: 'sewing',
    label: 'Пошиття',
    tone: 'primary',
    orders: [
      {
        number: 'ЗМ-305',
        client: 'ПрАТ «Полтаванафтогаз»',
        product: 'Куртка утеплена',
        quantity: 45,
        progress: 62,
        due: '03.11',
      },
      {
        number: 'ЗМ-308',
        client: 'ТОВ «Елеватор Плюс»',
        product: 'Халат робочий',
        quantity: 15,
        progress: 80,
        due: '02.11',
        overdue: true,
      },
      {
        number: 'ЗМ-309',
        client: 'ФОП Ковальчук',
        product: 'Жилет сигнальний',
        quantity: 30,
        progress: 35,
        due: '06.11',
      },
    ],
  },
  {
    id: 'embroidery',
    label: 'Вишивка',
    tone: 'secondary',
    orders: [
      {
        number: 'ЗМ-302',
        client: 'ФГ «Зоря»',
        product: 'Комбінезон + кепі',
        quantity: 40,
        progress: 70,
        due: '04.11',
      },
    ],
  },
  {
    id: 'quality',
    label: 'ОТК і пакування',
    tone: 'info',
    orders: [
      {
        number: 'ЗМ-299',
        client: 'КП «Міськсвітло»',
        product: 'Жилет сигнальний',
        quantity: 200,
        progress: 90,
        due: '01.11',
        overdue: true,
      },
    ],
  },
  {
    id: 'ready',
    label: 'Готово',
    tone: 'success',
    orders: [
      {
        number: 'ЗМ-296',
        client: 'ТОВ «Укрзернопром»',
        product: 'Костюм літній',
        quantity: 80,
        progress: 100,
        due: '31.10',
      },
      {
        number: 'ЗМ-295',
        client: 'ТОВ «Сільпо-Агро»',
        product: 'Кепі з логотипом',
        quantity: 150,
        progress: 100,
        due: '31.10',
      },
    ],
  },
];

export const demoQuotes: readonly DemoQuote[] = [
  {
    number: 'КП-1048',
    client: 'ТОВ «Агро-Лідер»',
    product: 'Костюм робочий «Захист»',
    quantity: 120,
    amount: 186000,
    status: { label: 'Надіслано', tone: 'info' },
  },
  {
    number: 'КП-1047',
    client: 'ПрАТ «Полтаванафтогаз»',
    product: 'Куртка утеплена сигнальна',
    quantity: 45,
    amount: 112500,
    status: { label: 'Чекає відповіді', tone: 'warning' },
  },
  {
    number: 'КП-1046',
    client: 'ФГ «Зоря»',
    product: 'Комбінезон + кепі з вишивкою',
    quantity: 40,
    amount: 58400,
    status: { label: 'Погоджено', tone: 'success' },
  },
  {
    number: 'КП-1045',
    client: 'КП «Міськсвітло»',
    product: 'Жилет сигнальний',
    quantity: 200,
    amount: 39800,
    status: { label: 'Оплачено', tone: 'success' },
  },
  {
    number: 'КП-1044',
    client: 'ТОВ «Елеватор Плюс»',
    product: 'Халат робочий',
    quantity: 15,
    amount: 13950,
    status: { label: 'Відмова', tone: 'error' },
  },
];

export const quoteFilters = [
  { label: 'Усі', count: 24 },
  { label: 'Чекають', count: 8 },
  { label: 'Погоджено', count: 6 },
] as const;

export const workshopCash = { balance: 18420, weekIncome: 24000, weekExpenses: 9380 } as const;

export const seamstressLoads: readonly SeamstressLoad[] = [
  { initials: 'ОМ', name: 'Оксана М.', load: 92 },
  { initials: 'ТК', name: 'Тетяна К.', load: 78 },
  { initials: 'НБ', name: 'Наталія Б.', load: 85 },
  { initials: 'ЛС', name: 'Людмила С.', load: 54 },
  { initials: 'ІП', name: 'Інна П.', load: 66 },
];

/** Load at or above this share is highlighted in brand orange. */
export const highSeamstressLoad = 80;

const amountFormat = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 });

export function formatAmount(value: number): string {
  return amountFormat.format(value);
}
