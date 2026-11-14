'use client';

import { cn } from '@site/shared/ui';
import Image from 'next/image';
import Link from 'next/link';

import { formatPrice } from '../i18n/catalog-dictionary';

import type { CatalogSearchState } from './use-catalog-search';
import type { CatalogDictionary } from '../i18n/catalog-dictionary';

const groupTitle =
  'px-2 font-mono text-[0.6875rem] font-semibold tracking-wide text-muted-foreground uppercase';

/** The suggestions under the search field: models, then categories, then a link to every result. */
export function CatalogSearchHints({
  id,
  search,
  text,
  optionId,
}: {
  id: string;
  search: CatalogSearchState;
  text: CatalogDictionary['search'];
  optionId: (position: number) => string;
}) {
  const { results, active, go } = search;
  return (
    <div
      id={id}
      role="listbox"
      aria-label={text.label}
      className="absolute inset-x-0 top-full z-40 mt-2 grid max-h-[70dvh] gap-1 overflow-y-auto rounded-xl border border-border-strong bg-background p-2 text-left shadow-lg"
    >
      {!search.index ? (
        <p className="px-2 py-3 text-sm text-muted-foreground">
          {search.loading ? text.loading : text.none}
        </p>
      ) : search.hints.length === 0 ? (
        <p className="px-2 py-3 text-sm text-muted-foreground">{text.none}</p>
      ) : null}

      {results.products.length > 0 ? (
        <p className={cn(groupTitle, 'pt-1')}>{text.products}</p>
      ) : null}
      {results.products.map((product, position) => (
        <div
          key={product.slug}
          id={optionId(position)}
          role="option"
          aria-selected={active === position}
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => go(product.href)}
          className={cn(
            'grid cursor-pointer grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-3 rounded-lg px-2 py-1.5',
            active === position ? 'bg-muted' : 'hover:bg-muted',
          )}
        >
          <span className="relative flex size-11 items-center justify-center overflow-hidden rounded-md bg-white">
            {product.image ? (
              <Image
                src={product.image}
                alt=""
                fill
                sizes="44px"
                unoptimized
                className="object-contain p-0.5"
              />
            ) : null}
          </span>
          <span className="grid min-w-0 leading-tight">
            <span className="truncate text-sm font-bold">{product.name}</span>
            {product.code ? (
              <span className="font-mono text-xs text-muted-foreground">{product.code}</span>
            ) : null}
          </span>
          {product.priceFrom !== null ? (
            <span className="text-sm whitespace-nowrap text-muted-foreground">
              {text.priceFrom} <b className="text-foreground">{formatPrice(product.priceFrom)}</b>{' '}
              грн
            </span>
          ) : null}
        </div>
      ))}

      {results.sections.length > 0 ? (
        <p className={cn(groupTitle, 'pt-2')}>{text.sections}</p>
      ) : null}
      {results.sections.map((section, offset) => {
        const position = results.products.length + offset;
        return (
          <div
            key={section.slug}
            id={optionId(position)}
            role="option"
            aria-selected={active === position}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => go(section.href)}
            className={cn(
              'flex cursor-pointer items-baseline gap-2 rounded-lg px-2 py-2 text-sm',
              active === position ? 'bg-muted' : 'hover:bg-muted',
            )}
          >
            <b>{section.name}</b>
            {section.parent ? (
              <span className="text-muted-foreground">· {section.parent}</span>
            ) : null}
            <span className="ml-auto font-mono text-xs text-muted-foreground">
              {section.productCount}
            </span>
          </div>
        );
      })}

      {results.total > 0 ? (
        <Link
          href={search.searchHref}
          onClick={search.close}
          className="mt-1 rounded-lg px-2 py-2 text-sm font-bold text-brand-text hover:bg-muted"
        >
          {text.all} ({results.total}) <span aria-hidden>→</span>
        </Link>
      ) : null}
    </div>
  );
}
