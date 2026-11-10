import { ARTICLES, findArticle } from '@site/articles/model';
import { getArticlesDictionary } from '@site/articles/ui';
import { render, screen, within } from '@testing-library/react';

import { articleHref, toArticleSeoInput } from './article-links';
import { ArticlePage } from './article-page';
import { ArticlesPage } from './articles-page';

const jsonLd = (container: HTMLElement) =>
  [...container.querySelectorAll('script[type="application/ld+json"]')].map((node) =>
    JSON.parse(node.textContent ?? '{}'),
  );

describe('ArticlesPage', () => {
  it('renders one h1 and a card for every article with a localized link', () => {
    const { container } = render(<ArticlesPage locale="ru" />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(ARTICLES.length);
    expect(within(cards[0]).getByRole('link').getAttribute('href')).toBe(
      `/ru/articles/${ARTICLES[0].slug}`,
    );
    expect(jsonLd(container).map((data) => data['@type'])).toEqual(['BreadcrumbList']);
  });
});

describe('ArticlePage', () => {
  const article = findArticle('zahyst-golovy-kasky-ta-yih-klasyfikaciya');
  if (!article) throw new Error('The helmets article is missing');

  it('renders the title as the only h1, the date, the text, and the picture', () => {
    render(<ArticlePage locale="uk" article={article} />);

    expect(screen.getAllByRole('heading', { level: 1 }).map((node) => node.textContent)).toEqual([
      article.title.uk,
    ]);
    expect(screen.getByText('25.01.2022').getAttribute('datetime')).toBe('2022-01-25');
    expect(screen.getByText('За формою каски бувають:')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Захисні каски та кепки' })).toBeTruthy();
  });

  it('offers the order block, three other articles, and the way back to the list', () => {
    const dictionary = getArticlesDictionary('uk');
    render(<ArticlePage locale="uk" article={article} />);

    const more = screen.getByRole('region', { name: dictionary.article.more.title });
    const cards = within(more).getAllByRole('article');
    expect(cards).toHaveLength(3);
    expect(within(more).queryByText(article.title.uk)).toBeNull();
    expect(
      within(more)
        .getByRole('link', { name: /Усі статті/ })
        .getAttribute('href'),
    ).toBe('/uk/articles');
    expect(
      screen.getByRole('link', { name: dictionary.article.order.discuss }).getAttribute('href'),
    ).toBe('/uk#zayavka');
  });

  it('describes the article and the breadcrumb trail in JSON-LD', () => {
    const { container } = render(<ArticlePage locale="ru" article={article} />);
    const [articleData, breadcrumbData] = jsonLd(container);

    expect(articleData).toMatchObject({
      '@type': 'Article',
      headline: article.title.ru,
      datePublished: '2022-01-25',
      inLanguage: 'ru-UA',
    });
    expect(breadcrumbData.itemListElement).toHaveLength(3);
    expect(breadcrumbData.itemListElement[2].item).toBe(
      'https://brevi.com.ua/ru/articles/zahyst-golovy-kasky-ta-yih-klasyfikaciya',
    );
  });

  it('builds the link and the SEO input of an article in one language', () => {
    expect(articleHref('ru', article)).toBe(
      '/ru/articles/zahyst-golovy-kasky-ta-yih-klasyfikaciya',
    );
    expect(toArticleSeoInput('ru', article)).toEqual({
      slug: article.slug,
      title: article.title.ru,
      description: article.excerpt.ru,
      date: '2022-01-25',
      image: '/assets/articles/helmets.webp',
    });
  });
});
