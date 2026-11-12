import { buildCatalogSearchIndex } from '@site/catalog/feature';
import { isLocale } from '@site/core/i18n';

/**
 * The search index of a language for the search box: every product and category with the addresses of
 * their pages. Built from the cached catalog answers; browsers and Cloudflare keep it for five minutes.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext<'/api/catalog-search/[locale]'>,
) {
  const { locale } = await params;
  if (!isLocale(locale)) return new Response(null, { status: 404 });

  return Response.json(await buildCatalogSearchIndex(locale), {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'X-Robots-Tag': 'noindex',
    },
  });
}
