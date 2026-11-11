/** A photo of the «Фото» library used by the site. */
export interface SitePicture {
  photoId: number;
  url: string;
  width: number | null;
  height: number | null;
}

/** «Контент → Налаштування SEO сайту»: codes the site places on every page. */
export interface SeoSettings {
  googleAnalyticsId: string | null;
  googleTagManagerId: string | null;
  googleSiteVerification: string | null;
  bingSiteVerification: string | null;
  defaultOgImage: SitePicture | null;
  /** 0 before the first save. */
  revision: number;
  updatedAtUtc: string | null;
  updatedBy: string | null;
}

export interface SeoSettingsInput {
  revision: number;
  googleAnalyticsId: string | null;
  googleTagManagerId: string | null;
  googleSiteVerification: string | null;
  bingSiteVerification: string | null;
  defaultOgPhotoId: number | null;
}

/** What the signed-in staff member may do on «Налаштування SEO сайту» (page `content-seo-settings`). */
export interface SeoSettingsViewer {
  canEdit: boolean;
}
