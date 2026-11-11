import { render, screen, within } from '@testing-library/react';

import { getArticlesDictionary } from './i18n/articles-dictionary';
import { ArticleBody } from './sections/article-body';
import { ArticleCards } from './sections/article-cards';
import { ArticlesOrder } from './sections/articles-order';

import type { ArticleCard } from '@site/articles/model';

const shape = (value: unknown): unknown => {
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  }
  return typeof value;
};

describe('articles dictionary', () => {
  it('has the same keys in both languages', () => {
    expect(shape(getArticlesDictionary('ru'))).toEqual(shape(getArticlesDictionary('uk')));
  });
});

const card = (slug: string, over: Partial<ArticleCard> = {}): ArticleCard => ({
  slug,
  date: '2022-01-25',
  textLocale: 'ru',
  title: `Статья ${slug}`,
  excerpt: `Коротко о ${slug}`,
  cover: null,
  hasRussian: true,
  updatedAt: '2026-11-11T08:00:00Z',
  ...over,
});

describe('ArticleCards', () => {
  it('shows the cover, the date, the title as a link, and the excerpt', () => {
    const articles = [
      card('a', {
        cover: {
          src: 'https://cdn.example/5.jpg',
          thumbnail: 'https://cdn.example/5-small.webp',
          width: 1200,
          height: 800,
        },
      }),
      card('b', { excerpt: '' }),
      card('c'),
    ];
    const { container } = render(
      <ArticleCards
        articles={articles}
        readLabel="Читать"
        hrefFor={(article) => `/ru/articles/${article.slug}`}
      />,
    );

    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(3);
    const first = within(cards[0]);
    expect(first.getByRole('heading', { level: 3 }).textContent).toBe('Статья a');
    expect(first.getByRole('link').getAttribute('href')).toBe('/ru/articles/a');
    expect(first.getByText('25.01.2022').getAttribute('datetime')).toBe('2022-01-25');
    expect(first.getByText('Коротко о a')).toBeTruthy();
    // The cover is decoration: the title already names the article.
    expect(container.querySelectorAll('img')).toHaveLength(1);
    expect(container.querySelector('img')?.getAttribute('src')).toBe(
      'https://cdn.example/5-small.webp',
    );
    expect(within(cards[1]).queryByText(/Коротко/)).toBeNull();
  });

  it('uses the heading level of the block it stands in', () => {
    render(
      <ArticleCards
        articles={[card('a')]}
        readLabel="Читати"
        hrefFor={() => '/uk/articles/x'}
        headingLevel={4}
      />,
    );

    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(1);
  });
});

describe('ArticleBody', () => {
  it('renders headings, paragraphs with a lead and formatting, lists, and pictures in order', () => {
    render(
      <ArticleBody
        blocks={[
          { type: 'heading', text: 'Захист голови' },
          { type: 'paragraph', text: 'Шиємо **самі** і *швидко*.', lead: 'Важливо:' },
          { type: 'list', items: ['один', 'два'] },
          {
            type: 'image',
            photo: { src: 'https://cdn.example/7.jpg', thumbnail: null, width: 1200, height: 1200 },
            alt: 'Каски',
          },
          {
            type: 'image',
            photo: { src: 'https://cdn.example/8.jpg', thumbnail: null, width: null, height: null },
            alt: 'Без розміру',
          },
        ]}
      />,
    );

    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Захист голови');
    const paragraph = screen.getByText('Важливо:').closest('p');
    expect(paragraph?.textContent).toBe('Важливо: Шиємо самі і швидко.');
    expect(within(paragraph as HTMLElement).getByText('самі').tagName).toBe('STRONG');
    expect(within(paragraph as HTMLElement).getByText('швидко').tagName).toBe('EM');
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'один',
      'два',
    ]);
    expect(screen.getByRole('img', { name: 'Каски' }).getAttribute('width')).toBe('1200');
    expect(screen.getByRole('img', { name: 'Без розміру' }).getAttribute('src')).toBe(
      'https://cdn.example/8.jpg',
    );
  });
});

describe('ArticlesOrder', () => {
  it('links to the request block and the production page', () => {
    const dictionary = getArticlesDictionary('uk').article.order;
    render(
      <ArticlesOrder
        id="order"
        dictionary={dictionary}
        discussHref="/uk#zayavka"
        productionHref="/uk/about-company"
      />,
    );

    expect(screen.getByRole('link', { name: dictionary.discuss }).getAttribute('href')).toBe(
      '/uk#zayavka',
    );
    expect(screen.getByRole('link', { name: /Про виробництво/ }).getAttribute('href')).toBe(
      '/uk/about-company',
    );
  });
});
