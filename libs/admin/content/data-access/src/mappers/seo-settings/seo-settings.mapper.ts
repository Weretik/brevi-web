import {
  integer,
  nullableDateTime,
  nullableInteger,
  nullableText,
  record,
  text,
} from '../../validators/content-response';

import type { SeoSettings, SitePicture } from '@admin/content/model';

function mapPicture(value: unknown): SitePicture | null {
  if (value === null || value === undefined) return null;
  const picture = record(value, 'фото');
  return {
    photoId: integer(picture['photoId'], 'id фото', 1),
    url: text(picture['url'], 'адреса фото'),
    width: nullableInteger(picture['width'], 'ширина'),
    height: nullableInteger(picture['height'], 'висота'),
  };
}

export function mapSeoSettings(value: unknown): SeoSettings {
  const settings = record(value, 'налаштування SEO');
  return {
    googleAnalyticsId: nullableText(settings['googleAnalyticsId'], 'Google Analytics'),
    googleTagManagerId: nullableText(settings['googleTagManagerId'], 'Google Tag Manager'),
    googleSiteVerification: nullableText(settings['googleSiteVerification'], 'код Google'),
    bingSiteVerification: nullableText(settings['bingSiteVerification'], 'код Bing'),
    defaultOgImage: mapPicture(settings['defaultOgImage']),
    revision: integer(settings['revision'], 'версія'),
    updatedAtUtc: nullableDateTime(settings['updatedAtUtc'], 'час зміни'),
    updatedBy: nullableText(settings['updatedBy'], 'хто змінив'),
  };
}
