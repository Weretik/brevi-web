import { cn } from '@site/shared/ui';
import Image from 'next/image';
import Link from 'next/link';

import { formatPrice } from '../i18n/catalog-dictionary';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type { CatalogProductCard } from '@site/catalog/model';

/**
 * One product of a listing: the photo on white, «Власне пошиття» on own sewing, the name, the model number,
 * and «від 1 480 грн/шт» with the order size that price is for. The whole card opens the product page (the
 * name is the link). A product without a price links «Дізнатися ціну» to the request page. It has no state,
 * so both the server grid and the client listing render it.
 */
export function CatalogProductTile({
  product,
  href,
  dictionary,
  requestHref,
  eager = false,
  hidden = false,
}: {
  product: CatalogProductCard;
  /** Localized address of the product page. */
  href: string;
  dictionary: CatalogDictionary['products'];
  requestHref: string;
  /** Photos above the fold load at once; the rest wait until the visitor scrolls to them. */
  eager?: boolean;
  /** Kept in the page for search engines but not shown, for example after «Показати ще». */
  hidden?: boolean;
}) {
  return (
    <li
      hidden={hidden}
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
            loading={eager ? 'eager' : 'lazy'}
            className="object-contain p-3"
          />
        ) : (
          <span className="text-sm text-muted-foreground">{dictionary.noPhoto}</span>
        )}
        {product.type === 'Sewing' ? (
          <span className="absolute top-2 left-2 rounded-md bg-brand-surface px-2 py-0.5 text-[0.6875rem] font-bold text-brand-text">
            {dictionary.own}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 border-t p-3 sm:p-4">
        <h3 className="text-[0.9375rem] leading-snug font-bold">
          <Link
            href={href}
            className="after:absolute after:inset-0 hover:text-brand-text hover:underline"
          >
            {product.name}
          </Link>
        </h3>
        {product.code ? (
          <p className="font-mono text-xs text-muted-foreground">
            {dictionary.model} {product.code}
          </p>
        ) : null}
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
          <p className={cn('mt-auto grid pt-2 text-sm text-muted-foreground')}>
            <span className="flex flex-wrap items-baseline gap-x-1.5">
              {dictionary.priceFrom}
              <span className="text-lg font-extrabold text-foreground">
                {formatPrice(product.priceFrom)}
              </span>
              {dictionary.perPiece}
            </span>
            <span className="text-xs">{dictionary.tierNote}</span>
          </p>
        )}
      </div>
    </li>
  );
}
