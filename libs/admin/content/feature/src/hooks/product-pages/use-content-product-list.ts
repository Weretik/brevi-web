import { useGetContentProductsQuery } from '@admin/content/data-access';
import {
  contentProductPageSizes,
  contentProductSiteFilters,
  contentProductTypes,
  defaultContentProductPageSize,
  withoutSiteCategory,
} from '@admin/content/model';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { ContentProductSiteFilter, ContentProductType } from '@admin/content/model';

const typeOf = (value: string | null): ContentProductType | null =>
  contentProductTypes.find((type) => type === value) ?? null;

const siteOf = (value: string | null): ContentProductSiteFilter =>
  contentProductSiteFilters.find((filter) => filter === value) ?? 'all';

const categoryOf = (value: string | null): number | null => {
  if (value === null) return null;
  const id = Number(value);
  return Number.isInteger(id) && id >= withoutSiteCategory ? id : null;
};

const pageSizeOf = (value: string | null) =>
  contentProductPageSizes.find((size) => String(size) === value) ?? defaultContentProductPageSize;

/**
 * Server-side list state of «Контент → Товари», kept in the URL (`search`, `type`, `site`,
 * `category`, `page`, `pageSize`). Search is sent 300 ms after typing stops.
 */
export function useContentProductList() {
  const [params, setParams] = useSearchParams();
  const search = params.get('search') ?? '';
  const type = typeOf(params.get('type'));
  const site = siteOf(params.get('site'));
  const category = categoryOf(params.get('category'));
  const rawPage = Number(params.get('page') ?? '1');
  const page = Number.isInteger(rawPage) && rawPage > 0 && rawPage <= 10_000 ? rawPage : 1;
  const pageSize = pageSizeOf(params.get('pageSize'));
  const [term, setTerm] = useState(search);

  const update = useCallback(
    (changes: Record<string, string | null>) =>
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          for (const [key, value] of Object.entries(changes)) {
            if (value === null || value === '') next.delete(key);
            else next.set(key, value);
          }
          return next;
        },
        { replace: true },
      ),
    [setParams],
  );

  useEffect(() => setTerm(search), [search]);
  useEffect(() => {
    const trimmed = term.trim();
    if (trimmed === search) return;
    const timer = setTimeout(() => update({ search: trimmed, page: null }), 300);
    return () => clearTimeout(timer);
  }, [term, search, update]);

  const list = useGetContentProductsQuery({ search, type, site, category, page, pageSize });
  const count = (value: ContentProductSiteFilter) => ({
    search,
    type,
    site: value,
    category,
    page: 1,
    pageSize: 1,
  });
  const allCount = useGetContentProductsQuery(count('all'));
  const onSiteCount = useGetContentProductsQuery(count('onSite'));
  const offSiteCount = useGetContentProductsQuery(count('offSite'));

  return {
    term,
    setTerm,
    type,
    setType: (value: ContentProductType | null) => update({ type: value, page: null }),
    category,
    setCategory: (value: number | null) =>
      update({ category: value === null ? null : String(value), page: null }),
    site,
    setSite: (value: ContentProductSiteFilter) =>
      update({ site: value === 'all' ? null : value, page: null }),
    counts: {
      all: allCount.currentData?.total ?? 0,
      onSite: onSiteCount.currentData?.total ?? 0,
      offSite: offSiteCount.currentData?.total ?? 0,
    },
    narrowed: Boolean(search) || type !== null || site !== 'all' || category !== null,
    list,
    setPage: ({ page: next, pageSize: size }: { page: number; pageSize: number }) =>
      update({
        page: next === 0 ? null : String(next + 1),
        pageSize: size === defaultContentProductPageSize ? null : String(size),
      }),
  };
}
