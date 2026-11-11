import type { ContentLanguage, ContentTextBlock } from '../product-pages/content-product';

/** A frequent question of a page with its answer, both plain text (CNT-010). */
export interface SiteFaqItem {
  question: string;
  answer: string;
}

/**
 * Texts of a page in one language: search title and description, the main text at the bottom of the page and its
 * frequent questions. Null or empty keeps the site's own text.
 */
export interface SitePageText {
  title: string | null;
  description: string | null;
  text: ContentTextBlock[];
  faq: SiteFaqItem[];
}

/** A fixed page of the public site in «Контент → Сторінки сайту». */
export interface SitePage {
  key: string;
  name: string;
  /** Address without the language, for example `/order-in-bulk`. */
  path: string;
  /** The home title is shown as written; the site adds « — Brevi» to the others. */
  titleHasBrand: boolean;
  texts: Record<ContentLanguage, SitePageText>;
  /** 0 for a page never saved. */
  revision: number;
  updatedAtUtc: string | null;
  updatedBy: string | null;
}

export interface SitePageInput {
  key: string;
  revision: number;
  texts: Record<ContentLanguage, SitePageText>;
}

/** What the signed-in staff member may do on «Сторінки сайту» (page `content-site-pages`). */
export interface SitePagesViewer {
  canEdit: boolean;
}
