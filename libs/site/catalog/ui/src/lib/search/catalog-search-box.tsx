'use client';

import { searchCatalogProducts, searchCatalogSections } from '@site/catalog/model';
import { cn } from '@site/shared/ui';
import { SearchIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { formatPrice } from '../i18n/catalog-dictionary';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';
import type { CatalogSearchIndex } from '@site/catalog/model';

const PRODUCT_HINTS = 6;
const SECTION_HINTS = 3;

/** One request per index address for the whole visit: every search box of the page shares it. */
const indexes = new Map<string, Promise<CatalogSearchIndex | null>>();

function loadIndex(url: string): Promise<CatalogSearchIndex | null> {
  let index = indexes.get(url);
  if (!index) {
    index = fetch(url)
      .then((response) => (response.ok ? (response.json() as Promise<CatalogSearchIndex>) : null))
      .catch(() => null);
    // A failed load is tried again on the next focus.
    index.then((value) => value ?? indexes.delete(url));
    indexes.set(url, index);
  }
  return index;
}

/**
 * The catalog search: a field that suggests models (photo, name, model number, «від» price) and categories
 * as the visitor types, and opens the search page on Enter. It is a plain GET form, so without JavaScript
 * Enter still opens the results. The index of every product is loaded once, on the first focus.
 */
export function CatalogSearchBox({
  indexUrl,
  action,
  text,
  size = 'large',
  defaultValue = '',
  autoFocus = false,
  onNavigate,
  className,
}: {
  /** Address of the search index of the page language. */
  indexUrl: string;
  /** Address of the search page. */
  action: string;
  text: CatalogDictionary['search'];
  size?: 'large' | 'compact';
  defaultValue?: string;
  autoFocus?: boolean;
  /** Called after the visitor picks a suggestion, for example to close the panel the box is in. */
  onNavigate?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const listId = useId();
  const root = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState(defaultValue);
  const [index, setIndex] = useState<CatalogSearchIndex | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const load = () => {
    if (index || loading) return;
    setLoading(true);
    void loadIndex(indexUrl).then((value) => {
      setIndex(value);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const results = useMemo(() => {
    if (!index || query.trim().length === 0) return { products: [], sections: [], total: 0 };
    const products = searchCatalogProducts(index.products, query);
    return {
      products: products.slice(0, PRODUCT_HINTS),
      sections: searchCatalogSections(index.sections, query).slice(0, SECTION_HINTS),
      total: products.length,
    };
  }, [index, query]);
  const hints = [...results.products, ...results.sections];
  const searchHref = `${action}?q=${encodeURIComponent(query.trim())}`;
  const showList = open && query.trim().length > 0;

  const go = (href: string) => {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  };

  const optionId = (position: number) => `${listId}-${position}`;
  const large = size === 'large';

  return (
    <form
      ref={root}
      role="search"
      action={action}
      method="get"
      aria-label={text.label}
      className={cn('relative w-full', className)}
      onSubmit={(event) => {
        if (query.trim().length === 0) {
          event.preventDefault();
          return;
        }
        event.preventDefault();
        const picked = hints[active];
        go(picked ? picked.href : searchHref);
      }}
    >
      <div
        className={cn(
          'flex items-center gap-2.5 rounded-lg border bg-background focus-within:ring-2 focus-within:ring-ring',
          large ? 'h-14 border-2 border-foreground px-4' : 'h-11 border-border-strong px-3',
        )}
      >
        <SearchIcon aria-hidden className={cn('shrink-0', large ? 'size-5' : 'size-4.5')} />
        <input
          type="search"
          name="q"
          role="combobox"
          aria-label={text.label}
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          enterKeyHint="search"
          autoFocus={autoFocus}
          value={query}
          placeholder={large ? text.placeholder : text.shortPlaceholder}
          onFocus={() => {
            load();
            setOpen(true);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(-1);
            setOpen(true);
            load();
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' && hints.length > 0) {
              event.preventDefault();
              setOpen(true);
              setActive((value) => (value + 1) % hints.length);
            } else if (event.key === 'ArrowUp' && hints.length > 0) {
              event.preventDefault();
              setActive((value) => (value <= 0 ? hints.length - 1 : value - 1));
            } else if (event.key === 'Escape') {
              setOpen(false);
              setActive(-1);
            }
          }}
          className={cn(
            'min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:hidden',
            large ? 'text-base' : 'text-[0.9375rem]',
          )}
        />
        {large ? (
          <button
            type="submit"
            className="shrink-0 rounded-md bg-brand px-4 py-2 text-sm font-bold text-foreground hover:bg-brand/90 max-sm:hidden"
          >
            {text.submit}
          </button>
        ) : null}
      </div>

      {showList ? (
        <div
          id={listId}
          role="listbox"
          aria-label={text.label}
          className="absolute inset-x-0 top-full z-40 mt-2 grid max-h-[70dvh] gap-1 overflow-y-auto rounded-xl border border-border-strong bg-background p-2 text-left shadow-lg"
        >
          {!index ? (
            <p className="px-2 py-3 text-sm text-muted-foreground">
              {loading ? text.loading : text.none}
            </p>
          ) : hints.length === 0 ? (
            <p className="px-2 py-3 text-sm text-muted-foreground">{text.none}</p>
          ) : null}

          {results.products.length > 0 ? (
            <p className="px-2 pt-1 font-mono text-[0.6875rem] font-semibold tracking-wide text-muted-foreground uppercase">
              {text.products}
            </p>
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
                  {text.priceFrom}{' '}
                  <b className="text-foreground">{formatPrice(product.priceFrom)}</b> грн
                </span>
              ) : null}
            </div>
          ))}

          {results.sections.length > 0 ? (
            <p className="px-2 pt-2 font-mono text-[0.6875rem] font-semibold tracking-wide text-muted-foreground uppercase">
              {text.sections}
            </p>
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
              href={searchHref}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="mt-1 rounded-lg px-2 py-2 text-sm font-bold text-brand-text hover:bg-muted"
            >
              {text.all} ({results.total}) <span aria-hidden>→</span>
            </Link>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
