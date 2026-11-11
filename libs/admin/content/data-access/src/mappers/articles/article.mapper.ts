import { articleBlockKinds } from '@admin/content/model';

import {
  dateTime,
  flag,
  integer,
  list,
  nullableInteger,
  nullableText,
  oneOf,
  record,
  text,
} from '../../validators/content-response';

import type {
  Article,
  ArticlePhoto,
  ArticleRow,
  ArticleText,
  ArticleVisibility,
} from '@admin/content/model';

function date(value: unknown, what: string): string {
  const day = text(value, what);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day))
    throw new Error(`Сервер повернув неправильне поле: ${what}.`);
  return day;
}

export function mapArticleRow(value: unknown): ArticleRow {
  const row = record(value, 'стаття');
  return {
    id: integer(row['id'], 'id статті', 1),
    slug: text(row['slug'], 'адреса'),
    publishedOn: date(row['publishedOn'], 'дата статті'),
    showOnSite: flag(row['showOnSite'], 'показувати на сайті'),
    titleUk: nullableText(row['titleUk'], 'назва українською'),
    titleRu: nullableText(row['titleRu'], 'назва російською'),
    hasUkrainianText: flag(row['hasUkrainianText'], 'текст українською'),
    hasRussianText: flag(row['hasRussianText'], 'текст російською'),
    hasSeo: flag(row['hasSeo'], 'SEO'),
    coverUrl: nullableText(row['coverUrl'], 'обкладинка'),
    updatedAtUtc: dateTime(row['updatedAtUtc'], 'час зміни'),
  };
}

export function mapArticleList(value: unknown): ArticleRow[] {
  return list(record(value, 'статті')['items'], 'статті').map(mapArticleRow);
}

function mapText(value: unknown): ArticleText {
  const texts = record(value, 'тексти статті');
  return {
    title: nullableText(texts['title'], 'назва'),
    excerpt: nullableText(texts['excerpt'], 'короткий опис'),
    seoTitle: nullableText(texts['seoTitle'], 'SEO-заголовок'),
    seoDescription: nullableText(texts['seoDescription'], 'SEO-опис'),
    body: list(texts['body'], 'текст').map((item) => {
      const block = record(item, 'блок тексту');
      return {
        kind: oneOf(block['kind'], articleBlockKinds, 'тип блоку'),
        text: nullableText(block['text'], 'текст блоку'),
        lead: nullableText(block['lead'], 'початок абзацу'),
        items:
          block['items'] == null
            ? []
            : list(block['items'], 'рядки списку').map((line) => text(line)),
        photoId: nullableInteger(block['photoId'], 'фото блоку'),
        alt: nullableText(block['alt'], 'опис фото'),
      };
    }),
  };
}

function mapPhoto(value: unknown): ArticlePhoto {
  const photo = record(value, 'фото статті');
  return {
    id: integer(photo['id'], 'id фото', 1),
    url: text(photo['url'], 'адреса фото'),
    thumbnailUrl: nullableText(photo['thumbnailUrl'], 'мала копія фото'),
    width: nullableInteger(photo['width'], 'ширина фото'),
    height: nullableInteger(photo['height'], 'висота фото'),
  };
}

export function mapArticle(value: unknown): Article {
  const article = record(value, 'стаття');
  return {
    article: mapArticleRow(article['article']),
    revision: integer(article['revision'], 'версія'),
    updatedBy: text(article['updatedBy'], 'хто змінив'),
    coverPhotoId: nullableInteger(article['coverPhotoId'], 'обкладинка'),
    uk: mapText(article['uk']),
    ru: mapText(article['ru']),
    photos: list(article['photos'], 'фото статті').map(mapPhoto),
  };
}

export function mapArticleVisibility(value: unknown): ArticleVisibility {
  const row = record(value, 'показ статті');
  return {
    id: integer(row['id'], 'id статті', 1),
    showOnSite: flag(row['showOnSite'], 'показувати на сайті'),
    revision: integer(row['revision'], 'версія'),
  };
}
