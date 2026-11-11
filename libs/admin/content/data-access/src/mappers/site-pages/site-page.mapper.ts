import {
  flag,
  integer,
  list,
  mapTextBlock,
  nullableDateTime,
  nullableText,
  record,
  text,
} from '../../validators/content-response';

import type { SitePage, SitePageText } from '@admin/content/model';

function mapText(value: unknown, name: string): SitePageText {
  const texts = record(value, name);
  return {
    title: nullableText(texts['title'], 'заголовок'),
    description: nullableText(texts['description'], 'опис'),
    text: list(texts['text'] ?? [], 'основний текст').map(mapTextBlock),
    faq: list(texts['faq'] ?? [], 'запитання').map((item) => {
      const faq = record(item, 'запитання');
      return {
        question: text(faq['question'], 'запитання'),
        answer: text(faq['answer'], 'відповідь'),
      };
    }),
  };
}

export function mapSitePage(value: unknown): SitePage {
  const page = record(value, 'сторінка сайту');
  return {
    key: text(page['key'], 'ключ'),
    name: text(page['name'], 'назва'),
    path: text(page['path'], 'адреса'),
    titleHasBrand: flag(page['titleHasBrand'], 'бренд у заголовку'),
    texts: {
      uk: mapText(page['uk'], 'тексти українською'),
      ru: mapText(page['ru'], 'тексти російською'),
    },
    revision: integer(page['revision'], 'версія'),
    updatedAtUtc: nullableDateTime(page['updatedAtUtc'], 'час зміни'),
    updatedBy: nullableText(page['updatedBy'], 'хто змінив'),
  };
}

export function mapSitePages(value: unknown): SitePage[] {
  return list(record(value, 'сторінки сайту')['items'], 'сторінки сайту').map(mapSitePage);
}
