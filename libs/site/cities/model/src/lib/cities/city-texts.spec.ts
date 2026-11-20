import { CITIES } from './city-list';
import { cityText } from './city-texts';
import { repeatedSentences } from './text-checks';

import type { CityPageKind, Locale } from '@site/core/i18n';

const KINDS: CityPageKind[] = ['sewing', 'workwear'];
const LOCALES: Locale[] = ['uk', 'ru'];

const every = () =>
  CITIES.flatMap((city) =>
    KINDS.flatMap((kind) =>
      LOCALES.map((locale) => ({ city, kind, locale, text: cityText(kind, city.slug, locale) })),
    ),
  );

describe('city page texts', () => {
  it('has a full text for each city, kind and language', () => {
    for (const { text } of every()) {
      expect(text.intro).toHaveLength(2);
      expect(text.needs).toHaveLength(3);
      expect(text.faq).toHaveLength(3);
    }
  });

  it('gives every page at least 150 words of its own', () => {
    for (const { city, kind, locale, text } of every()) {
      const own = [
        ...text.intro,
        ...text.needs.flatMap((need) => [need.title, need.text]),
        ...text.faq.flatMap((item) => [item.question, item.answer]),
      ];
      expect(
        own.join(' ').split(/\s+/).length,
        `${kind}/${city.slug}/${locale}`,
      ).toBeGreaterThanOrEqual(150);
    }
  });

  it('keeps titles and descriptions short enough for search results', () => {
    for (const { city, kind, locale, text } of every()) {
      const where = `${kind}/${city.slug}/${locale}`;
      expect(text.title.length, where).toBeLessThanOrEqual(52);
      expect(text.description.length, where).toBeLessThanOrEqual(160);
      expect(text.description.length, where).toBeGreaterThanOrEqual(110);
    }
  });

  it('names the city in the title, the description and the first paragraph', () => {
    // «Київ» and «у Києві» share only «Ки», so both the name and the word of the locative count.
    const missing = every().flatMap(({ city, kind, locale, text }) => {
      const stems = [city.name[locale], city.locative[locale].replace(/^(у|в) /, '')].map((word) =>
        word.slice(0, 4),
      );
      return [text.title, text.description, text.intro[0]]
        .filter((part) => !stems.some((stem) => part.includes(stem)))
        .map((part) => `${kind}/${city.slug}/${locale}: ${part}`);
    });
    expect(missing).toEqual([]);
  });

  it('gives every page its own words: no sentence of an intro, a need or an answer repeats', () => {
    for (const locale of LOCALES) {
      const pages = every().filter((page) => page.locale === locale);
      const blocks = pages.map(({ text }) => [
        ...text.intro,
        ...text.needs.map((need) => need.text),
        ...text.faq.map((item) => item.answer),
      ]);
      expect(repeatedSentences(blocks)).toEqual([]);
      const titles = pages.map(({ text }) => text.title);
      expect(new Set(titles).size).toBe(titles.length);
      const descriptions = pages.map(({ text }) => text.description);
      expect(new Set(descriptions).size).toBe(descriptions.length);
    }
  });

  it('uses only the site phone and never promises an online order', () => {
    for (const { text } of every()) {
      const all = JSON.stringify(text);
      expect(all).not.toMatch(/307[-\s]?55[-\s]?54/);
      expect(all).not.toMatch(/онлайн|кошик|корзин|статус замовлення|статус заказа/i);
    }
  });
});

describe('repeatedSentences', () => {
  it('finds a sentence used on two pages, ignoring case and spaces', () => {
    expect(
      repeatedSentences([
        ['Шиємо в Полтаві. Доставка  по Україні.'],
        ['Інший текст. доставка по Україні.'],
      ]),
    ).toEqual(['доставка по україні']);
  });

  it('allows a sentence repeated inside one page', () => {
    expect(repeatedSentences([['Так. Так.'], ['Ні.']])).toEqual([]);
  });
});
