'use client';

import { searchCatalogProducts, searchCatalogSections } from '@site/catalog/model';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { loadCatalogSearchIndex } from './catalog-search-index-loader';

import type { CatalogSearchIndex } from '@site/catalog/model';
import type { KeyboardEvent, RefObject } from 'react';

const PRODUCT_HINTS = 6;
const SECTION_HINTS = 3;

/**
 * The state of a search box: the typed text, the index (loaded on the first focus or keystroke), the
 * suggestions, the one picked by the arrows, and going to a suggestion or the search page.
 */
export function useCatalogSearch({
  indexUrl,
  action,
  defaultValue,
  root,
  onNavigate,
}: {
  indexUrl: string;
  action: string;
  defaultValue: string;
  /** The box; a press outside of it closes the suggestions. */
  root: RefObject<HTMLElement | null>;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [index, setIndex] = useState<CatalogSearchIndex | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const load = () => {
    if (index || loading) return;
    setLoading(true);
    void loadCatalogSearchIndex(indexUrl).then((value) => {
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
  }, [open, root]);

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

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };
  const go = (href: string) => {
    close();
    router.push(href);
  };

  return {
    query,
    index,
    loading,
    active,
    results,
    hints,
    searchHref,
    showList: open && query.trim().length > 0,
    go,
    close,
    focus: () => {
      load();
      setOpen(true);
    },
    type: (value: string) => {
      setQuery(value);
      setActive(-1);
      setOpen(true);
      load();
    },
    /** Arrows move through the suggestions, Escape closes them. */
    keyDown: (event: KeyboardEvent) => {
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
    },
    /** Enter opens the picked suggestion, or the search page; an empty field does nothing. */
    submit: () => {
      if (query.trim().length === 0) return;
      const picked = hints[active];
      go(picked ? picked.href : searchHref);
    },
  };
}

export type CatalogSearchState = ReturnType<typeof useCatalogSearch>;
