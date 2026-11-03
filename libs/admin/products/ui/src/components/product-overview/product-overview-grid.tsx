import { productPriceTierLabels } from '@admin/products/model';
import { ReferenceDataGrid, ReferenceStatusPill } from '@admin/references/ui';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useMemo } from 'react';

import { ProductArticlePriceCell, ProductModelPriceCell } from './product-price-cells';

import type { ProductPriceTier } from './product-price-cells';
import type { ProductListRow, ProductOverviewType } from '@admin/products/model';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  type: ProductOverviewType;
  rows: ProductListRow[];
  sectionNames: ReadonlyMap<number, string>;
  loading: boolean;
  searching?: boolean;
  unavailable?: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onToggle: (productId: number) => void;
  onView: (row: ProductListRow) => void;
  onEdit: (row: ProductListRow) => void;
  onDelete: (id: number) => void;
}

const tiers: ProductPriceTier[] = ['retail', 'wholesale', 'largeWholesale'];
const isArticle = (row: ProductListRow) => row.kind === 'article';

function priceColumns(): GridColDef<ProductListRow>[] {
  return tiers.map((tier, index) => ({
    field: `price-${tier}`,
    headerName: productPriceTierLabels[index],
    width: 150,
    align: 'right',
    headerAlign: 'right',
    renderCell: ({ row }) =>
      row.kind === 'article' ? (
        <ProductArticlePriceCell article={row.article} tier={tier} />
      ) : (
        <ProductModelPriceCell
          prices={row.prices}
          tier={tier}
          showsRange={row.product.type === 'Sewing' && (row.prices?.articles.length ?? 0) > 1}
        />
      ),
  }));
}

function columnsFor(
  type: ProductOverviewType,
  sectionNames: ReadonlyMap<number, string>,
  onToggle: (productId: number) => void,
): GridColDef<ProductListRow>[] {
  const sewing = type === 'Sewing';
  return [
    ...(sewing
      ? [
          {
            field: 'expand',
            headerName: '',
            width: 52,
            disableColumnMenu: true,
            renderCell: ({ row, tabIndex }) =>
              row.kind === 'model' && (row.prices?.articles.length ?? 0) > 0 ? (
                <IconButton
                  size="small"
                  tabIndex={tabIndex}
                  aria-expanded={row.expanded}
                  aria-label={`${row.expanded ? 'Згорнути' : 'Розгорнути'} артикули: ${row.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggle(row.id);
                  }}
                >
                  <ChevronRightOutlinedIcon
                    fontSize="small"
                    sx={{
                      transform: row.expanded ? 'rotate(90deg)' : 'none',
                      transition: 'transform 150ms',
                    }}
                  />
                </IconButton>
              ) : null,
          } satisfies GridColDef<ProductListRow>,
        ]
      : []),
    {
      field: 'code',
      headerName: sewing ? 'ID моделі' : 'Артикул сайту',
      width: 120,
      cellClassName: 'reference-mono',
      colSpan: (_value, row) => (row.kind === 'article' ? 3 : 1),
      valueGetter: (_value, row) => (row.kind === 'model' ? row.product.code : row.name),
      renderCell: ({ row, value }) =>
        row.kind === 'article' ? (
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {row.name}
            </Box>
            {!row.product.isActive && (
              <ReferenceStatusPill active={false} activeLabel="" inactiveLabel="Вимкнений" />
            )}
          </Box>
        ) : null,
    },
    {
      field: 'sectionId',
      headerName: sewing ? 'Категорія' : 'Розділ / категорія',
      flex: 1,
      minWidth: 150,
      valueGetter: (_value, row) =>
        row.kind === 'model' && row.product.sectionId !== null
          ? (sectionNames.get(row.product.sectionId) ?? null)
          : null,
      valueFormatter: (value: string | null) => value || '—',
    },
    ...(sewing
      ? [
          {
            field: 'articles',
            headerName: 'Арт.',
            width: 72,
            align: 'right',
            headerAlign: 'right',
            cellClassName: 'reference-mono',
            valueGetter: (_value, row) =>
              row.kind === 'model' ? (row.prices?.articles.length ?? null) : null,
            valueFormatter: (value: number | null) => (value === null ? '' : String(value)),
          } satisfies GridColDef<ProductListRow>,
        ]
      : []),
    ...priceColumns(),
    {
      field: 'currentSiteUrl',
      headerName: 'Сайт',
      width: 76,
      renderCell: ({ row }) =>
        row.kind === 'model' && row.product.currentSiteUrl ? (
          <Tooltip title="Відкрити товар на сайті">
            <IconButton
              size="small"
              component="a"
              href={row.product.currentSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Відкрити «${row.name}» на сайті`}
              onClick={(event) => event.stopPropagation()}
            >
              <OpenInNewOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : row.kind === 'model' ? (
          '—'
        ) : null,
    },
  ];
}

/**
 * One «Товари» table (CAT-011 design B): a model per row with its lowest prices («від …»); the arrow
 * shows its Articles with their prices underneath.
 */
export function ProductOverviewGrid({ type, sectionNames, onToggle, ...props }: Props) {
  const columns = useMemo(
    () => columnsFor(type, sectionNames, onToggle),
    [type, sectionNames, onToggle],
  );
  return (
    <ReferenceDataGrid
      ariaLabel={type === 'Sewing' ? 'Швейна продукція' : 'ЗІЗ'}
      columns={columns}
      emptyLabel="Товарів поки немає"
      notFoundLabel="Товарів не знайдено"
      menuLabel="Дії товару"
      isDetailRow={isArticle}
      sortable={false}
      {...props}
    />
  );
}
