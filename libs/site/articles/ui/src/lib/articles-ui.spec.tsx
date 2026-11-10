import { ARTICLES } from '@site/articles/model';
import { render, screen, within } from '@testing-library/react';

import { getArticlesDictionary } from './i18n/articles-dictionary';
import { ArticleBody } from './sections/article-body';
import { ArticleCards } from './sections/article-cards';
import { ArticlesOrder } from './sections/articles-order';

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

describe('ArticleCards', () => {
  it('shows the date, the title as a link, and the excerpt in the page language', () => {
    const articles = ARTICLES.slice(0, 3);
    render(
      <ArticleCards
        articles={articles}
        locale="ru"
        readLabel="Читать"
        hrefFor={(article) => `/ru/articles/${article.slug}`}
      />,
    );

    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(3);
    const first = within(cards[0]);
    expect(first.getByRole('heading', { level: 3 }).textContent).toBe(articles[0].title.ru);
    expect(first.getByRole('link').getAttribute('href')).toBe(`/ru/articles/${articles[0].slug}`);
    expect(first.getByText('25.01.2022').getAttribute('datetime')).toBe('2022-01-25');
    expect(first.getByText(articles[0].excerpt.ru)).toBeTruthy();
  });

  it('uses the heading level of the block it stands in', () => {
    render(
      <ArticleCards
        articles={ARTICLES.slice(0, 1)}
        locale="uk"
        readLabel="Читати"
        hrefFor={() => '/uk/articles/x'}
        headingLevel={4}
      />,
    );

    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(1);
  });
});

describe('ArticleBody', () => {
  it('renders paragraphs, lists, and pictures in order', () => {
    render(
      <ArticleBody
        blocks={[
          { type: 'paragraph', text: 'Перший абзац' },
          { type: 'list', items: ['один', 'два'] },
          {
            type: 'image',
            src: '/assets/articles/helmets.webp',
            alt: 'Каски',
            width: 1200,
            height: 1200,
          },
        ]}
      />,
    );

    expect(screen.getByText('Перший абзац').tagName).toBe('P');
    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
      'один',
      'два',
    ]);
    expect(screen.getByRole('img', { name: 'Каски' }).getAttribute('width')).toBe('1200');
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
