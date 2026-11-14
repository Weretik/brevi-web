import { productPriceTierLabels } from '@admin/products/model';
import { Box } from '@mui/material';

import {
  activeColumn,
  expandColumn,
  photoColumn,
  siteLinkColumn,
} from './product-overview-cell-columns';
import { ProductModelPriceCell, ProductVariantPriceCell } from '../cells/product-price-cells';

import type { ActiveSwitch } from './product-overview-cell-columns';
import type { ProductPriceTier } from '../cells/product-price-cells';
import type { ProductListRow, ProductOverviewType } from '@admin/products/model';
import type { GridColDef } from '@mui/x-data-grid';

const tiers: ProductPriceTier[] = ['retail', 'wholesale', 'largeWholesale'];

/** Columns the server can sort by (CAT-013); the rest are not sortable. */
export const productSortFields: Record<string, 'code' | 'name' | 'price'> = {
  code: 'code',
  name: 'name',
  'price-retail': 'price',
};

function priceColumns(): GridColDef<ProductListRow>[] {
  return tiers.map((tier, index) => ({
    field: `price-${tier}`,
    headerName: productPriceTierLabels[index],
    width: 150,
    align: 'right',
    headerAlign: 'right',
    sortable: tier === 'retail',
    renderCell: ({ row }) =>
      row.kind === 'variant' ? (
        <ProductVariantPriceCell variant={row.variant} tier={tier} />
      ) : (
        <ProductModelPriceCell product={row.product} tier={tier} />
      ),
  }));
}

/** The columns of one «Товари» table; sewing adds the arrow and the fabric count. */
export function productOverviewColumns(
  type: ProductOverviewType,
  sectionNames: ReadonlyMap<number, string>,
  onToggle: (productId: number) => void,
  active: ActiveSwitch,
): GridColDef<ProductListRow>[] {
  const sewing = type === 'Sewing';
  return [
    ...(sewing ? [expandColumn(onToggle)] : []),
    photoColumn(),
    {
      field: 'code',
      headerName: sewing ? 'ID моделі' : 'Артикул сайту',
      width: 120,
      cellClassName: 'reference-mono',
      colSpan: (_value, row) => (row.kind === 'variant' ? 3 : 1),
      valueGetter: (_value, row) => (row.kind === 'model' ? row.product.code : row.name),
      renderCell: ({ row, value }) =>
        row.kind === 'variant' ? (
          <Box component="span" sx={{ pl: 1.5, fontFamily: 'var(--admin-font-sans, inherit)' }}>
            {row.name}
          </Box>
        ) : (
          (value as string | null) || '—'
        ),
    },
    {
      field: 'name',
      headerName: sewing ? 'Назва моделі' : 'Назва товару',
      flex: 1.6,
      minWidth: 220,
      cellClassName: 'reference-strong',
      renderCell: ({ row }) =>
        row.kind === 'model' ? (
          <Box
            component="span"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: row.product.isActive ? undefined : 'text.secondary',
            }}
          >
            {row.name}
          </Box>
        ) : null,
    },
    {
      field: 'sectionId',
      headerName: sewing ? 'Категорія' : 'Розділ / категорія',
      flex: 1,
      minWidth: 150,
      sortable: false,
      valueGetter: (_value, row) =>
        row.kind === 'model' && row.product.sectionId !== null
          ? (sectionNames.get(row.product.sectionId) ?? null)
          : null,
      valueFormatter: (value: string | null) => value || '—',
    },
    ...(sewing
      ? [
          {
            field: 'variants',
            headerName: 'Тканин',
            width: 80,
            sortable: false,
            align: 'right',
            headerAlign: 'right',
            cellClassName: 'reference-mono',
            valueGetter: (_value, row) =>
              row.kind === 'model' ? row.product.variants.length : null,
            valueFormatter: (value: number | null) => (value === null ? '' : String(value)),
          } satisfies GridColDef<ProductListRow>,
        ]
      : []),
    ...priceColumns(),
    activeColumn(active),
    siteLinkColumn(),
  ];
}
