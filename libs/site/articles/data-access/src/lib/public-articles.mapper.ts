import type { Article, ArticleBlock, ArticleCard, ArticlePhoto } from '@site/articles/model';
import type { Locale } from '@site/core/i18n';

/**
 * Turns answers of the BreviERP public article API into the site's own types. Every answer is checked: a
 * field of another shape throws, and the loader treats the answer as unavailable instead of showing half
 * of an article.
 */
const invalid = (what: string) => new Error(`Public articles API: unexpected ${what}`);

function record(value: unknown, what: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalid(what);
  return value as Record<string, unknown>;
}

function list(value: unknown, what: string): unknown[] {
  if (!Array.isArray(value)) throw invalid(what);
  return value;
}

function text(value: unknown, what: string): string {
  if (typeof value !== 'string') throw invalid(what);
  return value;
}

const optionalText = (value: unknown, what: string): string | null =>
  value === null || value === undefined ? null : text(value, what);

function size(value: unknown, what: string): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) throw invalid(what);
  return value;
}

function locale(value: unknown): Locale {
  if (value !== 'uk' && value !== 'ru') throw invalid('language');
  return value;
}

function date(value: unknown): string {
  const day = text(value, 'date');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw invalid('date');
  return day;
}

function flag(value: unknown, what: string): boolean {
  if (typeof value !== 'boolean') throw invalid(what);
  return value;
}

function photo(value: unknown): ArticlePhoto | null {
  if (value === null || value === undefined) return null;
  const item = record(value, 'photo');
  return {
    src: text(item['url'], 'photo address'),
    thumbnail: optionalText(item['thumbnailUrl'], 'small photo'),
    width: size(item['width'], 'photo width'),
    height: size(item['height'], 'photo height'),
  };
}

/** A block of the text; an image without its photo and an empty block are left out. */
function block(value: unknown): ArticleBlock[] {
  const item = record(value, 'block');
  switch (item['kind']) {
    case 'Paragraph': {
      const body = optionalText(item['text'], 'paragraph');
      return body
        ? [{ type: 'paragraph', text: body, lead: optionalText(item['lead'], 'lead') }]
        : [];
    }
    case 'Heading': {
      const body = optionalText(item['text'], 'heading');
      return body ? [{ type: 'heading', text: body }] : [];
    }
    case 'List': {
      const items = list(item['items'], 'list').map((line) => text(line, 'list line'));
      return items.length > 0 ? [{ type: 'list', items }] : [];
    }
    case 'Image': {
      const picture = photo(item['photo']);
      return picture
        ? [{ type: 'image', photo: picture, alt: optionalText(item['alt'], 'alt') ?? '' }]
        : [];
    }
    default:
      throw invalid('block kind');
  }
}

function card(value: unknown): ArticleCard {
  const item = record(value, 'article');
  return {
    slug: text(item['slug'], 'slug'),
    date: date(item['publishedOn']),
    textLocale: locale(item['language']),
    title: text(item['title'], 'title'),
    excerpt: optionalText(item['excerpt'], 'excerpt') ?? '',
    cover: photo(item['cover']),
    hasRussian: flag(item['hasRussian'], 'Russian flag'),
    updatedAt: text(item['updatedAtUtc'], 'update time'),
  };
}

export function mapArticleList(value: unknown): ArticleCard[] {
  return list(record(value, 'article list')['items'], 'articles').map(card);
}

export function mapArticle(value: unknown): Article {
  const item = record(value, 'article');
  return {
    ...card(item),
    seo: {
      title: optionalText(item['seoTitle'], 'SEO title') ?? '',
      description: optionalText(item['seoDescription'], 'SEO description') ?? '',
    },
    body: list(item['body'], 'body').flatMap(block),
  };
}
