import {
  articleBodyFromRichText,
  articleBodyToRichText,
} from '../../mappers/articles/article-rich-text';
import { emptyRichText } from '../../mappers/product-pages/content-rich-text';

import type {
  Article,
  ArticleBlock,
  ArticlePhoto,
  ArticleText,
} from '../../entities/articles/article';
import type { ContentRichNode } from '../../mappers/product-pages/content-rich-text';

/** Texts of one language as the editor holds them; the body is a document of the visual editor. */
export interface ArticleTextValues {
  title: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  body: ContentRichNode;
}

/** The chosen cover: the photo of the library and its address for the preview. */
export interface ArticleCoverValue {
  id: number;
  url: string | null;
}

export interface ArticleFormValues {
  /** May stay empty for a new article: the server builds the address from the Ukrainian title. */
  slug: string;
  /** `YYYY-MM-DD`. */
  publishedOn: string;
  showOnSite: boolean;
  cover: ArticleCoverValue | null;
  uk: ArticleTextValues;
  ru: ArticleTextValues;
}

export interface ArticleTextInput {
  title: string | null;
  excerpt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  body: ArticleBlock[];
}

/** Body of the save: the article is replaced as a whole; `id` null and `revision` 0 create one. */
export interface ArticleInput {
  id: number | null;
  revision: number;
  slug: string | null;
  publishedOn: string;
  showOnSite: boolean;
  coverPhotoId: number | null;
  uk: ArticleTextInput;
  ru: ArticleTextInput;
}

const textValuesOf = (text: ArticleText, photos: readonly ArticlePhoto[]): ArticleTextValues => ({
  title: text.title ?? '',
  excerpt: text.excerpt ?? '',
  seoTitle: text.seoTitle ?? '',
  seoDescription: text.seoDescription ?? '',
  body: articleBodyToRichText(text.body, photos),
});

const emptyText = (): ArticleTextValues => ({
  title: '',
  excerpt: '',
  seoTitle: '',
  seoDescription: '',
  body: emptyRichText,
});

export function articleFormOf(article: Article): ArticleFormValues {
  const cover = article.photos.find((photo) => photo.id === article.coverPhotoId);
  return {
    slug: article.article.slug,
    publishedOn: article.article.publishedOn,
    showOnSite: article.article.showOnSite,
    cover:
      article.coverPhotoId === null
        ? null
        : { id: article.coverPhotoId, url: cover?.thumbnailUrl ?? cover?.url ?? null },
    uk: textValuesOf(article.uk, article.photos),
    ru: textValuesOf(article.ru, article.photos),
  };
}

/** A new article is hidden until staff switch it on; `today` is `YYYY-MM-DD`. */
export function newArticleForm(today: string): ArticleFormValues {
  return {
    slug: '',
    publishedOn: today,
    showOnSite: false,
    cover: null,
    uk: emptyText(),
    ru: emptyText(),
  };
}

const textInputOf = (values: ArticleTextValues): ArticleTextInput => ({
  title: values.title.trim() || null,
  excerpt: values.excerpt.trim() || null,
  seoTitle: values.seoTitle.trim() || null,
  seoDescription: values.seoDescription.trim() || null,
  body: articleBodyFromRichText(values.body),
});

export function articleInputOf(article: Article | null, values: ArticleFormValues): ArticleInput {
  return {
    id: article?.article.id ?? null,
    revision: article?.revision ?? 0,
    slug: values.slug.trim() || null,
    publishedOn: values.publishedOn,
    showOnSite: values.showOnSite,
    coverPhotoId: values.cover?.id ?? null,
    uk: textInputOf(values.uk),
    ru: textInputOf(values.ru),
  };
}
