import Image from 'next/image';
import Link from 'next/link';

import { formatPrice } from '../i18n/catalog-dictionary';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type { CatalogProductCard } from '@site/catalog/model';

/** Photos above the fold load at once; the rest wait until the visitor scrolls to them. */
const EAGER_CARDS = 4;

/**
 * Listing of products: a photo on white, the model name, and the lowest price «від 1 250 грн». The whole
 * card opens the product page (the name is the link). A product without a price links «Дізнатися ціну» to
 * the request page. Photos are on the media server and have no known size, so they fill a fixed frame.
 */
export function CatalogProductGrid({
  products,
  dictionary,
  requestHref,
  productHref,
}: {
  products: readonly CatalogProductCard[];
  dictionary: CatalogDictionary['products'];
  requestHref: string;
  /** Localized link of a product page by its slug. */
  productHref: (slug: string) => string;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <li
          key={product.slug}
          className="relative flex flex-col overflow-hidden rounded-xl border border-border bg-background hover:border-border-strong"
        >
          <div className="relative flex aspect-[4/5] items-center justify-center bg-white">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 18rem, (min-width: 768px) 33vw, 50vw"
                unoptimized
                loading={index < EAGER_CARDS ? 'eager' : 'lazy'}
                className="object-contain p-3"
              />
            ) : (
              <span className="text-sm text-muted-foreground">{dictionary.noPhoto}</span>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2 border-t p-3 sm:p-4">
            <h3 className="text-[0.9375rem] leading-snug font-bold">
              <Link
                href={productHref(product.slug)}
                className="after:absolute after:inset-0 hover:text-brand-text hover:underline"
              >
                {product.name}
              </Link>
            </h3>
            {product.priceFrom === null ? (
              <Link
                href={requestHref}
                rel="nofollow"
                aria-label={`${dictionary.askPrice}: ${product.name}`}
                className="relative z-10 mt-auto inline-flex min-h-11 items-center text-sm font-bold text-brand-text hover:underline"
              >
                {dictionary.askPrice} <span aria-hidden>&nbsp;→</span>
              </Link>
            ) : (
              <p className="mt-auto flex min-h-11 items-baseline gap-1.5 pt-2 text-sm text-muted-foreground">
                {dictionary.priceFrom}
                <span className="text-lg font-extrabold text-foreground">
                  {formatPrice(product.priceFrom)}
                </span>
                грн
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
