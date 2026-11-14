'use client';

import { cn } from '@site/shared/ui';
import { SearchIcon } from 'lucide-react';
import { useId, useRef } from 'react';

import { CatalogSearchHints } from './catalog-search-hints';
import { useCatalogSearch } from './use-catalog-search';

import type { CatalogDictionary } from '../i18n/catalog-dictionary';

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
  const listId = useId();
  const root = useRef<HTMLFormElement>(null);
  const search = useCatalogSearch({ indexUrl, action, defaultValue, root, onNavigate });
  const optionId = (position: number) => `${listId}-${position}`;
  const large = size === 'large';
  const { active } = search;

  return (
    <form
      ref={root}
      role="search"
      action={action}
      method="get"
      aria-label={text.label}
      className={cn('relative w-full', className)}
      onSubmit={(event) => {
        event.preventDefault();
        search.submit();
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
          aria-expanded={search.showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          enterKeyHint="search"
          autoFocus={autoFocus}
          value={search.query}
          placeholder={large ? text.placeholder : text.shortPlaceholder}
          onFocus={search.focus}
          onChange={(event) => search.type(event.target.value)}
          onKeyDown={search.keyDown}
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

      {search.showList ? (
        <CatalogSearchHints id={listId} search={search} text={text} optionId={optionId} />
      ) : null}
    </form>
  );
}
