import Image from 'next/image';
import Link from 'next/link';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type { CatalogProductCard } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Photos above the fold load at once; the rest wait until the visitor scrolls to them. */
const EAGER_CARDS = 4;

/**
 * Listing of a category: a photo on white and the model name. There is no price and no product page yet,
 * so the only action of a card is «Дізнатися ціну», which opens the request page.
 */
export function CatalogProductGrid({
  locale,
  products,
  dictionary,
  requestHref,
}: {
  locale: Locale;
  products: readonly CatalogProductCard[];
  dictionary: CatalogDictionary['products'];
  requestHref: string;
}) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <li
          key={product.slug}
          className="flex flex-col overflow-hidden rounded-xl border border-border bg-background"
        >
          <div className="flex aspect-[4/5] items-center justify-center bg-white p-3">
            {product.image ? (
              <Image
                src={product.image.src}
                alt={product.name[locale]}
                width={product.image.width}
                height={product.image.height}
                unoptimized
                loading={index < EAGER_CARDS ? 'eager' : 'lazy'}
                className="size-full object-contain"
              />
            ) : (
              <span className="text-sm text-muted-foreground">{dictionary.noPhoto}</span>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2 border-t p-3 sm:p-4">
            <h3 className="text-[0.9375rem] leading-snug font-bold">{product.name[locale]}</h3>
            <Link
              href={requestHref}
              rel="nofollow"
              aria-label={`${dictionary.askPrice}: ${product.name[locale]}`}
              className="mt-auto inline-flex min-h-11 items-center text-sm font-bold text-brand-text hover:underline"
            >
              {dictionary.askPrice} <span aria-hidden>&nbsp;→</span>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
