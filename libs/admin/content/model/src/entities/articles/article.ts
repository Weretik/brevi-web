export const articleBlockKinds = ['Paragraph', 'Heading', 'List', 'Image'] as const;
export type ArticleBlockKind = (typeof articleBlockKinds)[number];

/**
 * One block of an article body. A paragraph may open with a bold `lead`; a list keeps its lines in
 * `items`; an image names a photo of the «Фото» library by `photoId` with its `alt`.
 */
export interface ArticleBlock {
  kind: ArticleBlockKind;
  text: string | null;
  lead: string | null;
  items: string[];
  photoId: number | null;
  alt: string | null;
}

/** Title, short text, SEO and body of an article in one language. */
export interface ArticleText {
  title: string | null;
  excerpt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  body: ArticleBlock[];
}

/** A row of «Контент → Статті». */
export interface ArticleRow {
  id: number;
  slug: string;
  /** The date readers see, `YYYY-MM-DD`. */
  publishedOn: string;
  showOnSite: boolean;
  titleUk: string | null;
  titleRu: string | null;
  hasUkrainianText: boolean;
  hasRussianText: boolean;
  hasSeo: boolean;
  /** Small copy of the cover; null without a cover or when the library no longer has the photo. */
  coverUrl: string | null;
  updatedAtUtc: string;
}

/** A photo of the «Фото» library that the article uses. */
export interface ArticlePhoto {
  id: number;
  url: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
}

/** The editor of one article. `photos` has only the photos the library still has. */
export interface Article {
  article: ArticleRow;
  revision: number;
  updatedBy: string;
  coverPhotoId: number | null;
  uk: ArticleText;
  ru: ArticleText;
  photos: ArticlePhoto[];
}

export interface ArticleVisibility {
  id: number;
  showOnSite: boolean;
  revision: number;
}

/** What the signed-in staff member may do on «Контент → Статті» («Права доступу», page `content-articles`). */
export interface ArticlesViewer {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}
