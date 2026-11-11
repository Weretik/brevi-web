import type {
  SeoSettings,
  SeoSettingsInput,
  SitePicture,
} from '../../entities/seo-settings/seo-settings';

export interface SeoSettingsFormValues {
  googleAnalyticsId: string;
  googleTagManagerId: string;
  googleSiteVerification: string;
  bingSiteVerification: string;
  picture: SitePicture | null;
}

export type SeoSettingsErrors = Partial<
  Record<Exclude<keyof SeoSettingsFormValues, 'picture'>, string>
>;

const analytics = /^G-[A-Z0-9]{4,15}$/;
const tagManager = /^GTM-[A-Z0-9]{4,12}$/;
const verification = /^[A-Za-z0-9_-]{8,100}$/;
const metaContent = /content\s*=\s*["']([^"']+)["']/i;

/**
 * The value of a verification code: staff often paste the whole meta tag from the console, so the `content`
 * value is taken out of it.
 */
export function verificationCode(value: string): string {
  const trimmed = value.trim();
  return metaContent.exec(trimmed)?.[1]?.trim() ?? trimmed;
}

export function seoSettingsFormOf(settings: SeoSettings): SeoSettingsFormValues {
  return {
    googleAnalyticsId: settings.googleAnalyticsId ?? '',
    googleTagManagerId: settings.googleTagManagerId ?? '',
    googleSiteVerification: settings.googleSiteVerification ?? '',
    bingSiteVerification: settings.bingSiteVerification ?? '',
    picture: settings.defaultOgImage,
  };
}

export function validateSeoSettings(values: SeoSettingsFormValues): SeoSettingsErrors {
  const errors: SeoSettingsErrors = {};
  const ga = values.googleAnalyticsId.trim().toUpperCase();
  const gtm = values.googleTagManagerId.trim().toUpperCase();
  if (ga && !analytics.test(ga))
    errors.googleAnalyticsId = 'Ідентифікатор потоку виду G-XXXXXXXXXX.';
  if (gtm && !tagManager.test(gtm))
    errors.googleTagManagerId = 'Ідентифікатор контейнера виду GTM-XXXXXXX.';
  for (const key of ['googleSiteVerification', 'bingSiteVerification'] as const) {
    const code = verificationCode(values[key]);
    if (code && !verification.test(code))
      errors[key] =
        'Лише значення content з мета-тегу: літери, цифри, - і _, від 8 до 100 символів.';
  }
  return errors;
}

export function seoSettingsInputOf(
  revision: number,
  values: SeoSettingsFormValues,
): SeoSettingsInput {
  const text = (value: string) => value.trim() || null;
  return {
    revision,
    googleAnalyticsId: text(values.googleAnalyticsId.toUpperCase()),
    googleTagManagerId: text(values.googleTagManagerId.toUpperCase()),
    googleSiteVerification: text(verificationCode(values.googleSiteVerification)),
    bingSiteVerification: text(verificationCode(values.bingSiteVerification)),
    defaultOgPhotoId: values.picture?.photoId ?? null,
  };
}
