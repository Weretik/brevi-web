export const contentProductTypes = ['Sewing', 'Ppe'] as const;
export type ContentProductType = (typeof contentProductTypes)[number];

export const contentTextBlockKinds = ['Paragraph', 'Heading', 'List'] as const;
export type ContentTextBlockKind = (typeof contentTextBlockKinds)[number];

export const contentLanguages = ['uk', 'ru'] as const;
export type ContentLanguage = (typeof contentLanguages)[number];

/** A short fact next to the photo: «Сезон» — «весна, літо, осінь». The label may be empty. */
export interface ContentProductFact {
  label: string | null;
  text: string;
}

/** A paragraph may open with a bold lead; a list keeps its lines in `items`. */
export interface ContentTextBlock {
  kind: ContentTextBlockKind;
  text: string | null;
  lead: string | null;
  items: string[];
}

/** Characteristics of one garment part: «Куртка», «Брюки». */
export interface ContentSpecGroup {
  title: string | null;
  rows: { name: string; value: string }[];
}

export interface ContentProductText {
  name: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  summary: ContentProductFact[];
  description: ContentTextBlock[];
  specs: ContentSpecGroup[];
}

/** A row of «Контент → Товари»: a Catalog product with the state of its site page. */
export interface ContentProductRow {
  productId: number;
  type: ContentProductType;
  code: string | null;
  name: string;
  sectionId: number | null;
  sectionName: string | null;
  isActive: boolean;
  mainPhotoUrl: string | null;
  hasPrice: boolean;
  hasPage: boolean;
  showOnSite: boolean;
  /** The mark is set and the Catalog product is active. */
  onSite: boolean;
  slug: string | null;
  hasUkrainianText: boolean;
  hasRussianText: boolean;
  hasSeo: boolean;
  updatedAtUtc: string | null;
}

export interface ContentProductPage {
  items: ContentProductRow[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ContentPriceTiers {
  retail: number;
  wholesale: number;
  largeWholesale: number;
}

export interface ContentProductVariant {
  articleId: number;
  saleSku: string;
  isActive: boolean;
  fabricName: string | null;
  fabricDetails: string | null;
  prices: ContentPriceTiers | null;
}

/** The editor of one product; `revision` is 0 and `slug` is an offer while there is no page. */
export interface ContentProduct {
  product: ContentProductRow;
  revision: number;
  slug: string;
  updatedBy: string | null;
  uk: ContentProductText;
  ru: ContentProductText;
  prices: ContentPriceTiers | null;
  variants: ContentProductVariant[];
}

export interface ContentProductVisibility {
  productId: number;
  showOnSite: boolean;
  onSite: boolean;
  revision: number;
  slug: string;
}

/** What the signed-in staff member may do on «Контент → Товари» («Права доступу», page `content-products`). */
export interface ContentProductsViewer {
  canEdit: boolean;
  canDelete: boolean;
}
