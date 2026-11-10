export type SiteEnvironment = 'production' | 'preview' | 'development';

export type SiteConfig = {
  /** Public origin without a trailing slash, used for canonical URLs, sitemaps, and Open Graph. */
  siteUrl: string;
  /** BreviERP API origin without a trailing slash; read only by server-side data access. */
  apiUrl: string;
  environment: SiteEnvironment;
  /** Search engines may index the site only when this is true (production after the domain cutover). */
  indexingEnabled: boolean;
};

type SiteEnv = Partial<Record<string, string | undefined>>;

const DEFAULT_SITE_URL = 'https://brevi.com.ua';
const DEFAULT_API_URL = 'https://api.brevi.com.ua';

const trimTrailingSlash = (url: string): string => url.replace(/\/+$/, '');

const readEnvironment = (value: string | undefined): SiteEnvironment =>
  value === 'production' || value === 'preview' ? value : 'development';

/** Builds the site configuration from environment variables; the only place that knows their names. */
export function createSiteConfig(env: SiteEnv): SiteConfig {
  const environment = readEnvironment(env['SITE_ENV']);

  return {
    siteUrl: trimTrailingSlash(env['SITE_URL'] || DEFAULT_SITE_URL),
    apiUrl: trimTrailingSlash(env['BREVI_API_URL'] || DEFAULT_API_URL),
    environment,
    indexingEnabled: environment === 'production' && env['SITE_INDEXING'] === 'true',
  };
}

export const siteConfig: SiteConfig = createSiteConfig(process.env);
