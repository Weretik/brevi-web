import {
  contentProductTypeLabel,
  contentProductTypes,
  siteCategoryPath,
  withoutSiteCategory,
} from '@admin/content/model';
import { ReferenceFilterChip, ReferenceFilterRow } from '@admin/references/ui';
import { Divider, MenuItem, TextField } from '@mui/material';

import type { useContentProductList } from '../../hooks/product-pages/use-content-product-list';
import type { SiteCategoryRow } from '@admin/content/model';

const siteFilters = [
  ['all', 'Усі'],
  ['onSite', 'На сайті'],
  ['offSite', 'Не на сайті'],
] as const;

/** Filters of «Товари сайту»: on the site or not, the product type and, when allowed, the site section. */
export function ContentProductFilters({
  state,
  categories,
  total,
}: {
  state: ReturnType<typeof useContentProductList>;
  categories: SiteCategoryRow[] | null;
  total: number;
}) {
  return (
    <ReferenceFilterRow
      filters={
        <>
          {siteFilters.map(([value, label]) => (
            <ReferenceFilterChip
              key={value}
              label={label}
              count={state.counts[value]}
              selected={state.site === value}
              onClick={() => state.setSite(value)}
            />
          ))}
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          <ReferenceFilterChip
            label="Усі типи"
            selected={state.type === null}
            onClick={() => state.setType(null)}
          />
          {contentProductTypes.map((type) => (
            <ReferenceFilterChip
              key={type}
              label={contentProductTypeLabel(type)}
              selected={state.type === type}
              onClick={() => state.setType(type)}
            />
          ))}
          {categories && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <TextField
                select
                size="small"
                label="Розділ сайту"
                value={state.category === null ? '' : String(state.category)}
                onChange={(event) =>
                  state.setCategory(event.target.value === '' ? null : Number(event.target.value))
                }
                slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
                sx={{ minWidth: 240 }}
              >
                <MenuItem value="">Усі розділи сайту</MenuItem>
                <MenuItem value={String(withoutSiteCategory)}>Без розділу сайту</MenuItem>
                {categories.map((row) => (
                  <MenuItem key={row.id} value={String(row.id)}>
                    {siteCategoryPath(row, categories)}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}
        </>
      }
      count={total}
      total={state.counts[state.site]}
      countLabel="Кількість товарів"
      selectedCount={0}
      onClearSelection={() => undefined}
    />
  );
}
