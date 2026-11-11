/** «Наші роботи» (photos of sewn clothing) or «Сертифікати» (documents) of the public site. */
export type SiteGalleryKind = 'works' | 'certificates';

/** A text in Ukrainian and Russian; an empty Russian text shows the Ukrainian one on the site. */
export interface GalleryText {
  uk: string;
  ru: string;
}

/**
 * One picture in the order the site shows it. It is a photo of «Фото» (`photoId`) or, until «Перенести у
 * бібліотеку фото», a file the site keeps (`legacyPath`). `missing` means the library photo was deleted.
 */
export interface SiteGalleryItem {
  photoId: number | null;
  legacyPath: string | null;
  url: string | null;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  missing: boolean;
  title: GalleryText;
  note: GalleryText;
  standards: string[];
}

export interface SiteGallery {
  kind: SiteGalleryKind;
  items: SiteGalleryItem[];
  /** Pictures that are still files of the site and wait for the transfer. */
  legacyCount: number;
  revision: number;
  updatedAtUtc: string | null;
  updatedBy: string | null;
}

/** One picture as the Admin sends it on save. */
export interface SiteGalleryItemInput {
  photoId: number | null;
  legacyPath: string | null;
  title: GalleryText | null;
  note: GalleryText | null;
  standards: string[] | null;
}

export interface SiteGalleryInput {
  kind: SiteGalleryKind;
  revision: number;
  items: SiteGalleryItemInput[];
}

/** One step of «Перенести у бібліотеку фото». */
export interface SiteGalleryTransfer {
  moved: number;
  left: number;
  problems: string[];
  gallery: SiteGallery;
}

/** What the signed-in staff member may do on «Наші роботи» or «Сертифікати» (`content-works`, `content-certificates`). */
export interface SiteGalleryViewer {
  canEdit: boolean;
}

/** Page names and texts that differ between the two galleries. */
export const siteGalleryLabels: Readonly<
  Record<SiteGalleryKind, { title: string; item: string; subtitle: string }>
> = {
  works: {
    title: 'Наші роботи',
    item: 'Фото',
    subtitle:
      'Фото пошитого одягу на сторінці сайту «Наші роботи», у тому порядку, як їх показує сайт. Нові фото беруться з бібліотеки «Фото».',
  },
  certificates: {
    title: 'Сертифікати',
    item: 'Документ',
    subtitle:
      'Сертифікати й декларації на сторінці сайту «Сертифікати»: скан, назва, на що поширюється і стандарти. Скани беруться з бібліотеки «Фото».',
  },
};
