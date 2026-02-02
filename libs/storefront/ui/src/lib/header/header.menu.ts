import { MegaMenuItem } from 'primeng/api';

const catalogLink = (slug: string) => ['/catalog', slug, 'products'] as const;

export function buildMenu(): MegaMenuItem[] {
  return [
    {
      label: 'Каталог',
      icon: 'pi pi-bookmark-fill',
      root: true,
      items: [
        [
          {
            label: 'Спецодяг літній',
            items: [
              {
                label: 'Костюми робочі літні',
                routerLink: catalogLink(''),
              },
              {
                label: 'Куртки робочі літні',
                routerLink: catalogLink(''),
              },
              {
                label: 'Комбінезони та напівкомбінезони робочі літні',
                routerLink: catalogLink(''),
              },
              {
                label: 'Штани робочі літні',
                routerLink: catalogLink(''),
              },
              {
                label: 'Фартухи жіночі робоч',
                routerLink: catalogLink(''),
              },
              {
                label: 'Одяг медичний / кухарський',
                routerLink: catalogLink(''),
              },
            ],
          },
          {
            label: 'Спецодяг зимовий',
            items: [
              {
                label: 'Куртки робочі зимові',
                routerLink: catalogLink('kedr-zamki-navisni-ta-velozamki-1304'),
              },
              {
                label: 'Штани робочі зимові',
                routerLink: catalogLink('kedr-komplekti-zamki-z-ruchkami-2716'),
              },
              {
                label: 'Напівкомбінезони робочі зимові',
                routerLink: catalogLink('kedr-zamki-nakladni-2722'),
              },
              {
                label: 'Жилети',
                routerLink: catalogLink('kedr-zamki-suvaldni-ta-z-khrestoobr.-kliuchem-2775'),
              },
            ],
          },
          {
            label: 'Трикотаж',
            items: [
              {
                label: 'Футболки робочі',
                routerLink: catalogLink('kedr-ruchki-na-rozettsi-seriia-kevlar-26949'),
              },
              {
                label: 'Теніска-поло',
                routerLink: catalogLink('kedr-ruchki-na-rozettsi-seriia-kevlar-26949'),
              },
              {
                label: 'Реглани, светри',
                routerLink: catalogLink('kedr-ruchki-na-rozettsi-seriia-standart-r-08-r-10-5915'),
              },
            ],
          },
        ],
        [
          {
            label: 'Одяг для зварювальників',
          },
          {
            label: 'Сигнальний одяг',
            items: [
              {
                label: 'Костюми',
                routerLink: catalogLink('kedr-tsilindri-seriyi-brass-key-latun-2680'),
              },
              {
                label: 'Жилети',
                routerLink: catalogLink('kedr-tsilindri-seriyi-smart-26929'),
              },
              {
                label: 'Плащі',
                routerLink: catalogLink('kedr-tsilindri-seriyi-smart-26929'),
              },
            ],
          },
          {
            label: 'Камуфляжний одяг',
            items: [
              {
                label: ' з магнітною защіпкою',
                routerLink: catalogLink(
                  'kedr-mizhkimnatni-mekhanizmi-z-magnitnoiu-zashchipkoiu-2197',
                ),
              },
              {
                label: 'заскочки / засувки',
                routerLink: catalogLink("kedr-mizhkimnatni-zaskochki-zasuvki-2321'"),
              },
              {
                label: 'з металевою защіпкою',
                routerLink: catalogLink(
                  'kedr-mizhkimnatni-mekhanizmi-z-metalevoiu-zashchipkoiu-5273',
                ),
              },
              {
                label: 'з кевларовою защіпкою',
                routerLink: catalogLink(
                  'kedr-mizhkimnatni-mekhanizmi-z-kevlarovoiu-zashchipkoiu-6108',
                ),
              },
            ],
          },
          {
            label: 'Одяг вологозахисний',
            items: [
              {
                label: 'Фартухи вологозахисні',
                routerLink: catalogLink(
                  'kedr-bronenakladki-na-tsilindr-ta-nakladki-na-suvaldni-zamki-1230',
                ),
              },
              {
                label: 'Костюми вологозахисні',
                routerLink: catalogLink('kedr-ushchilniuvach-1440'),
              },
              {
                label: 'Плащі вологозахисні',
                routerLink: catalogLink('kedr-vidbiiniki-3783'),
              },
            ],
          },
        ],
        [
          {
            label: 'Робоче взуття',
            items: [
              { label: 'Літня робоча обувь', routerLink: catalogLink('m_korfad-8349') },
              { label: 'Зимове робоче взуття', routerLink: catalogLink('m_leador-8344') },
              {
                label: '',
                routerLink: catalogLink('dveri-sindikat-26971'),
              },
            ],
          },
          {
            label: 'Захист рук',
            items: [
              {
                label: 'Антивібраційні рукавички і рукавиці',
                routerLink: catalogLink('m_korfad-8349'),
              },
              { label: 'Рукавички діелектричні', routerLink: catalogLink('m_leador-8344') },
              { label: 'Рукавички трикотажні', routerLink: catalogLink('m_darumi-19424') },
              { label: 'Краги зварювальні', routerLink: catalogLink('m_darumi-19424') },
              { label: 'Рукавиці', routerLink: catalogLink('m_darumi-19424') },
              { label: 'Рукавички МБС / нітрил', routerLink: catalogLink('m_darumi-19424') },
              { label: 'Рукавички комбіновані', routerLink: catalogLink('m_darumi-19424') },
              { label: 'Рукавички утеплені', routerLink: catalogLink('m_darumi-19424') },
              { label: 'Рукавички господарські', routerLink: catalogLink('m_darumi-19424') },
            ],
          },
          {
            label: 'Захист очей',
            items: [
              { label: 'Окуляри захисні', routerLink: catalogLink('m_korfad-8349') },
              { label: 'Щитки захисні', routerLink: catalogLink('m_leador-8344') },
            ],
          },
        ],
        [
          {
            label: 'Захист орг. слуху / дихання',
            items: [
              { label: 'Респіратори одноразові', routerLink: catalogLink('m_korfad-8349') },
              { label: 'Респіратори захисні', routerLink: catalogLink('m_leador-8344') },
              { label: 'Фільтра', routerLink: catalogLink('m_darumi-19424') },
              { label: 'Маски панорамні', routerLink: catalogLink('m_darumi-19424') },
              { label: 'Навушники робочі', routerLink: catalogLink('m_darumi-19424') },
              { label: 'Беруші', routerLink: catalogLink('m_darumi-19424') },
            ],
          },
          {
            label: 'Каски, кепки',
            items: [
              { label: 'Каски захисні', routerLink: catalogLink('m_korfad-8349') },
              { label: 'Кепки, бейсболки', routerLink: catalogLink('m_leador-8344') },
              { label: 'Каски-бейсболки', routerLink: catalogLink('m_darumi-19424') },
              { label: 'Шапки', routerLink: catalogLink('m_darumi-19424') },
            ],
          },
          {
            label: 'Аптечки',
            items: [
              { label: 'Автомобільні', routerLink: catalogLink('m_korfad-8349') },
              { label: 'Колективні', routerLink: catalogLink('m_leador-8344') },
              { label: 'Індивідуальні', routerLink: catalogLink('m_darumi-19424') },
            ],
          },
        ],
      ],
    },

    {
      label: 'Інформація',
      icon: 'pi pi-exclamation-circle',
      root: true,
      items: [
        [
          {
            label: 'Про нас',
            items: [
              { label: 'Про компанію', routerLink: ['/about-company'] },
              { label: 'Доставка та оплата', routerLink: ['/delivery-and-payment'] },
              { label: 'Повернення / обмін', routerLink: ['/returns-exchanges'] },
              { label: 'Наші роботи', routerLink: ['/our-work'] },
              { label: 'Сертифікати', routerLink: ['/certificates'] },
              { label: 'Договір', routerLink: ['/agreement'] },
              { label: 'Статті', routerLink: ['/articles'] },
              { label: 'Контакти', routerLink: ['/contacts'] },
            ],
          },
        ],
        [
          {
            label: 'Регіони',
            items: [
              { label: 'Харків', routerLink: ['/regions'] },
              { label: 'Київ', routerLink: ['/regions'] },
              { label: 'Дніпро', routerLink: ['/regions'] },
              { label: 'Запоріжжя', routerLink: ['/regions'] },
              { label: 'Миколаїв', routerLink: ['/regions'] },
              { label: 'Одеса', routerLink: ['/regions'] },
              { label: 'Полтава', routerLink: ['/regions'] },
              { label: 'Кривий ріг', routerLink: ['/regions'] },
              { label: 'Миколаїв', routerLink: ['/regions'] },
              { label: 'Вінниця', routerLink: ['/regions'] },
              { label: 'Житомир', routerLink: ['/regions'] },
              { label: 'Біла церква', routerLink: ['/regions'] },
              { label: 'Суми', routerLink: ['/regions'] },
              { label: 'Чернігів', routerLink: ['/regions'] },
            ],
          },
        ],
        [
          {
            label: 'Юридична інформація',
            items: [
              { label: 'Угода користувача' },
              { label: 'Політика конфіденційності' },
              { label: 'Юридична інформація' },
              { label: 'Договір публічної оферти' },
            ],
          },
        ],
        [
          {
            items: [
              {
                image: 'https://primefaces.org/cdn/primeng/images/uikit/uikit-system.png',
                label: 'Замовити оптом',
                routerLink: '/order-in-bulk',
                subtext: 'Умови співпраці для оптових партнерів',
              },
            ],
          },
        ],
      ],
    },
  ];
}
