import type { Locale } from '@site/core/i18n';

type Localized = Record<Locale, string>;

/** A city with its own «Пошиття» and «Робочий одяг» pages. */
export type City = {
  /** Official Ukrainian transliteration (KMU 2010), the last part of the page address. */
  slug: string;
  name: Localized;
  /** «у Харкові» / «в Харькове»: the city in a sentence such as «Пошиття спецодягу у Харкові». */
  locative: Localized;
  /** Three nearby cities linked from the page, nearest first. */
  neighbours: readonly string[];
};

const city = (
  slug: string,
  name: Localized,
  locative: Localized,
  neighbours: readonly string[],
): City => ({ slug, name, locative, neighbours });

/** The 13 cities of the old `brevi.com.ua` city pages, in the order of the «Регіони» page. */
export const CITIES: readonly City[] = [
  city('kyiv', { uk: 'Київ', ru: 'Киев' }, { uk: 'у Києві', ru: 'в Киеве' }, [
    'bila-tserkva',
    'zhytomyr',
    'chernihiv',
  ]),
  city('kharkiv', { uk: 'Харків', ru: 'Харьков' }, { uk: 'у Харкові', ru: 'в Харькове' }, [
    'poltava',
    'sumy',
    'dnipro',
  ]),
  city('dnipro', { uk: 'Дніпро', ru: 'Днепр' }, { uk: 'у Дніпрі', ru: 'в Днепре' }, [
    'zaporizhzhia',
    'kryvyi-rih',
    'poltava',
  ]),
  city('odesa', { uk: 'Одеса', ru: 'Одесса' }, { uk: 'в Одесі', ru: 'в Одессе' }, [
    'mykolaiv',
    'vinnytsia',
    'kryvyi-rih',
  ]),
  city(
    'zaporizhzhia',
    { uk: 'Запоріжжя', ru: 'Запорожье' },
    { uk: 'у Запоріжжі', ru: 'в Запорожье' },
    ['dnipro', 'kryvyi-rih', 'mykolaiv'],
  ),
  city(
    'kryvyi-rih',
    { uk: 'Кривий Ріг', ru: 'Кривой Рог' },
    { uk: 'у Кривому Розі', ru: 'в Кривом Роге' },
    ['dnipro', 'mykolaiv', 'zaporizhzhia'],
  ),
  city('mykolaiv', { uk: 'Миколаїв', ru: 'Николаев' }, { uk: 'у Миколаєві', ru: 'в Николаеве' }, [
    'odesa',
    'kryvyi-rih',
    'zaporizhzhia',
  ]),
  city('vinnytsia', { uk: 'Вінниця', ru: 'Винница' }, { uk: 'у Вінниці', ru: 'в Виннице' }, [
    'zhytomyr',
    'bila-tserkva',
    'kyiv',
  ]),
  city('poltava', { uk: 'Полтава', ru: 'Полтава' }, { uk: 'у Полтаві', ru: 'в Полтаве' }, [
    'kharkiv',
    'dnipro',
    'sumy',
  ]),
  city('chernihiv', { uk: 'Чернігів', ru: 'Чернигов' }, { uk: 'у Чернігові', ru: 'в Чернигове' }, [
    'kyiv',
    'sumy',
    'zhytomyr',
  ]),
  city('zhytomyr', { uk: 'Житомир', ru: 'Житомир' }, { uk: 'у Житомирі', ru: 'в Житомире' }, [
    'kyiv',
    'vinnytsia',
    'bila-tserkva',
  ]),
  city('sumy', { uk: 'Суми', ru: 'Сумы' }, { uk: 'у Сумах', ru: 'в Сумах' }, [
    'kharkiv',
    'poltava',
    'chernihiv',
  ]),
  city(
    'bila-tserkva',
    { uk: 'Біла Церква', ru: 'Белая Церковь' },
    { uk: 'у Білій Церкві', ru: 'в Белой Церкви' },
    ['kyiv', 'vinnytsia', 'zhytomyr'],
  ),
];

/** The city of a page address; `undefined` for any other place, which the route answers with 404. */
export function findCity(slug: string): City | undefined {
  return CITIES.find((item) => item.slug === slug);
}
