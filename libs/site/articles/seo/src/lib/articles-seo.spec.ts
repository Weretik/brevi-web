import { createSiteConfig } from '@site/core/config';
import { LOCALES } from '@site/core/i18n';

import { buildArticleJsonLd } from './article-json-ld';
import {
  ARTICLES_SEO_TEXT,
  articlePath,
  buildArticleMetadata,
  buildArticlesMetadata,
} from './articles-metadata';

const article = {
  slug: 'navishcho-potriben-specodyag',
  title: 'Навіщо потрібен спецодяг?',
  description: 'Процвітання будь-якого підприємства залежить від багатьох факторів.',
  date: '2021-07-29',
};

describe('articles list metadata', () => {
  it('gives each language its own title, canonical, and alternates', () => {
    const uk = buildArticlesMetadata('uk');
    const ru = buildArticlesMetadata('ru');

    expect(uk.title).toBe(ARTICLES_SEO_TEXT.uk.title);
    expect(ru.title).toBe(ARTICLES_SEO_TEXT.ru.title);
    expect(uk.alternates?.canonical).toBe('/uk/articles');
    expect(ru.alternates?.languages).toMatchObject({
      'uk-UA': '/uk/articles',
      'ru-UA': '/ru/articles',
    });
  });

  it('keeps titles and descriptions within search snippet length', () => {
    for (const locale of LOCALES) {
      const { title, description } = ARTICLES_SEO_TEXT[locale];
      // The layout template adds « — Brevi» (8 characters).
      expect(title.length).toBeLessThanOrEqual(52);
      expect(description.length).toBeGreaterThanOrEqual(110);
      expect(description.length).toBeLessThanOrEqual(165);
    }
  });
});

describe('article metadata', () => {
  it('uses the article title, excerpt, and a self canonical under /articles', () => {
    const metadata = buildArticleMetadata('ru', article);

    expect(articlePath(article.slug)).toBe('/articles/navishcho-potriben-specodyag');
    expect(metadata.title).toBe(article.title);
    expect(metadata.description).toBe(article.description);
    expect(metadata.alternates?.canonical).toBe('/ru/articles/navishcho-potriben-specodyag');
    expect(metadata.alternates?.languages).toMatchObject({
      'uk-UA': '/uk/articles/navishcho-potriben-specodyag',
      'x-default': '/uk/articles/navishcho-potriben-specodyag',
    });
    expect(metadata.openGraph).toMatchObject({ type: 'article', publishedTime: '2021-07-29' });
  });

  it('adds the article picture to Open Graph when there is one', () => {
    const metadata = buildArticleMetadata('uk', { ...article, image: '/assets/articles/a.webp' });

    expect(metadata.openGraph).toMatchObject({ images: ['/assets/articles/a.webp'] });
  });
});

describe('article JSON-LD', () => {
  const config = createSiteConfig({ SITE_ENV: 'production', SITE_INDEXING: 'true' });

  it('describes the article with its date, language, and Brevi as publisher', () => {
    expect(buildArticleJsonLd('uk', article, config)).toMatchObject({
      '@type': 'Article',
      headline: article.title,
      datePublished: '2021-07-29',
      inLanguage: 'uk-UA',
      mainEntityOfPage: 'https://brevi.com.ua/uk/articles/navishcho-potriben-specodyag',
      publisher: { '@type': 'Organization', name: 'Brevi' },
    });
  });

  it('adds an absolute picture URL only when the article has a picture', () => {
    expect(buildArticleJsonLd('uk', article, config)).not.toHaveProperty('image');
    expect(
      buildArticleJsonLd('uk', { ...article, image: '/assets/articles/a.webp' }, config),
    ).toMatchObject({ image: 'https://brevi.com.ua/assets/articles/a.webp' });
  });
});
