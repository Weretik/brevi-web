import { getArticlesDictionary } from '@site/articles/ui';
import { render, screen, within } from '@testing-library/react';

import { articleHref, toArticleSeoInput } from './article-links';
import { ArticlePage } from './article-page';
import { ArticlesPage } from './articles-page';

import type { Article, ArticleCard } from '@site/articles/model';

const jsonLd = (container: HTMLElement) =>
  [...container.querySelectorAll('script[type="application/ld+json"]')].map((node) =>
    JSON.parse(node.textContent ?? '{}'),
  );

const card = (slug: string, over: Partial<ArticleCard> = {}): ArticleCard => ({
  slug,
  date: '2022-01-25',
  textLocale: 'uk',
  title: `Стаття ${slug}`,
  excerpt: `Коротко про ${slug}`,
  cover: null,
  hasRussian: true,
  updatedAt: '2026-11-11T08:00:00Z',
  ...over,
});

const article: Article = {
  ...card('zahyst-golovy-kasky-ta-yih-klasyfikaciya', {
    title: 'Захист голови: каски та їх класифікація',
    excerpt: 'Як обрати **каску**.',
    cover: { src: 'https://cdn.example/5.jpg', thumbnail: null, width: 1200, height: 800 },
  }),
  seo: { title: '', description: '' },
  body: [
    { type: 'paragraph', text: 'За формою каски бувають:', lead: null },
    {
      type: 'image',
      photo: { src: 'https://cdn.example/7.jpg', thumbnail: null, width: 1200, height: 1200 },
      alt: 'Захисні каски та кепки',
    },
  ],
};

describe('ArticlesPage', () => {
  it('renders one h1 and a card for every article with a localized link', () => {
    const { container } = render(<ArticlesPage locale="ru" articles={[card('a'), card('b')]} />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const cards = screen.getAllByRole('article');
    expect(cards).toHaveLength(2);
    expect(within(cards[0]).getByRole('link').getAttribute('href')).toBe('/ru/articles/a');
    expect(jsonLd(container).map((data) => data['@type'])).toEqual(['BreadcrumbList']);
  });

  it('says that articles will appear later while there are none', () => {
    render(<ArticlesPage locale="uk" articles={[]} />);

    expect(screen.queryAllByRole('article')).toHaveLength(0);
    expect(screen.getByText(getArticlesDictionary('uk').list.empty)).toBeTruthy();
  });
});

describe('ArticlePage', () => {
  const more = [card('a'), card('b'), card('c')];

  it('renders the title as the only h1, the date, the text, and the picture', () => {
    render(<ArticlePage locale="uk" article={article} more={[]} />);

    expect(screen.getAllByRole('heading', { level: 1 }).map((node) => node.textContent)).toEqual([
      article.title,
    ]);
    expect(screen.getByText('25.01.2022').getAttribute('datetime')).toBe('2022-01-25');
    expect(screen.getByText('За формою каски бувають:')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Захисні каски та кепки' })).toBeTruthy();
  });

  it('offers the order block, the other articles, and the way back to the list', () => {
    const dictionary = getArticlesDictionary('uk');
    render(<ArticlePage locale="uk" article={article} more={more} />);

    const region = screen.getByRole('region', { name: dictionary.article.more.title });
    expect(within(region).getAllByRole('article')).toHaveLength(3);
    expect(
      within(region)
        .getByRole('link', { name: /Усі статті/ })
        .getAttribute('href'),
    ).toBe('/uk/articles');
    expect(
      screen.getByRole('link', { name: dictionary.article.order.discuss }).getAttribute('href'),
    ).toBe('/uk#zayavka');
  });

  it('leaves out «Читайте також» when there are no other articles', () => {
    const dictionary = getArticlesDictionary('uk');
    render(<ArticlePage locale="uk" article={article} more={[]} />);

    expect(screen.queryByRole('region', { name: dictionary.article.more.title })).toBeNull();
  });

  it('marks Ukrainian texts on the Russian page and describes them in JSON-LD', () => {
    const { container } = render(<ArticlePage locale="ru" article={article} more={more} />);
    const [articleData, breadcrumbData] = jsonLd(container);

    expect(screen.getByRole('heading', { level: 1 }).getAttribute('lang')).toBe('uk');
    expect(articleData).toMatchObject({
      '@type': 'Article',
      headline: article.title,
      datePublished: '2022-01-25',
      inLanguage: 'uk-UA',
      image: 'https://cdn.example/5.jpg',
    });
    expect(breadcrumbData.itemListElement).toHaveLength(3);
    expect(breadcrumbData.itemListElement[2].item).toBe(
      'https://brevi.com.ua/ru/articles/zahyst-golovy-kasky-ta-yih-klasyfikaciya',
    );
  });

  it('builds the link and the SEO input: what staff wrote for search, or the title and excerpt', () => {
    expect(articleHref('ru', article)).toBe(
      '/ru/articles/zahyst-golovy-kasky-ta-yih-klasyfikaciya',
    );
    expect(toArticleSeoInput(article)).toEqual({
      slug: article.slug,
      textLocale: 'uk',
      title: article.title,
      description: 'Як обрати каску.',
      date: '2022-01-25',
      image: 'https://cdn.example/5.jpg',
    });
    expect(
      toArticleSeoInput({ ...article, seo: { title: 'Каски', description: 'Опис для пошуку' } }),
    ).toMatchObject({ title: 'Каски', description: 'Опис для пошуку' });
  });
});
