import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

/** One tag for «Наші роботи» and «Сертифікати», so a «refresh the site» call can drop them. */
export const SITE_GALLERIES_CACHE_TAG = 'site-galleries';

/** A change in the Admin reaches the site within about five minutes. */
const GALLERIES_LIFE = { stale: 300, revalidate: 300, expire: 86_400 };
const FAILURE_LIFE = { stale: 60, revalidate: 60, expire: 3_600 };

export interface GalleryText {
  uk: string;
  ru: string;
}

/** One picture of «Наші роботи» or one document of «Сертифікати», in the order staff set. */
export interface GalleryPicture {
  url: string;
  thumbnailUrl: string;
  width: number | null;
  height: number | null;
  title: GalleryText;
  note: GalleryText;
  standards: string[];
}

/** Empty lists mean the site keeps its own pictures. */
export interface SiteGalleries {
  works: GalleryPicture[];
  certificates: GalleryPicture[];
}

type Raw = Record<string, unknown>;

function object(value: unknown, name: string): Raw {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error(`Unexpected ${name}.`);
  return value as Raw;
}

function array(value: unknown, name: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`Unexpected ${name}.`);
  return value;
}

const words = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

/** Only an https picture of the library or a picture of the site itself. */
function address(value: unknown): string | null {
  const url = words(value);
  return /^https:\/\//.test(url) || /^\/assets\/[\w/.-]+$/.test(url) ? url : null;
}

const size = (value: unknown) =>
  typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : null;

function texts(value: unknown): GalleryText {
  const raw = value && typeof value === 'object' ? (value as Raw) : {};
  return { uk: words(raw['uk']), ru: words(raw['ru']) };
}

function pictures(value: unknown, name: string): GalleryPicture[] {
  return array(value, name).flatMap((item) => {
    const raw = object(item, name);
    const url = address(raw['url']);
    if (!url) return [];
    return [
      {
        url,
        thumbnailUrl: address(raw['thumbnailUrl']) ?? url,
        width: size(raw['width']),
        height: size(raw['height']),
        title: texts(raw['title']),
        note: texts(raw['note']),
        standards: Array.isArray(raw['standards'])
          ? raw['standards'].map(words).filter(Boolean)
          : [],
      },
    ];
  });
}

/** The pictures of the API answer; a picture with an unsafe address is left out. Throws on another shape. */
export function mapSiteGalleries(data: unknown): SiteGalleries {
  const raw = object(data, 'galleries');
  return {
    works: pictures(raw['works'], 'works'),
    certificates: pictures(raw['certificates'], 'certificates'),
  };
}

/** The text in the page language; an empty Russian text shows the Ukrainian one. */
export function galleryText(text: GalleryText, locale: keyof GalleryText): string {
  return (locale === 'ru' && text.ru) || text.uk;
}

/**
 * «Контент → Наші роботи» and «Контент → Сертифікати»; empty lists when the API is unavailable, so the pages
 * keep their own pictures.
 */
export async function loadSiteGalleries(): Promise<SiteGalleries> {
  'use cache';
  cacheTag(SITE_GALLERIES_CACHE_TAG);

  const result = await siteApiGet('/api/public/galleries');
  if (result.kind === 'ok') {
    try {
      const galleries = mapSiteGalleries(result.data);
      cacheLife(GALLERIES_LIFE);
      return galleries;
    } catch {
      // Falls through to the short life below.
    }
  }
  cacheLife(FAILURE_LIFE);
  return { works: [], certificates: [] };
}
