import { productPriceTierLabels } from '@admin/products/model';
import { ReferenceDataGrid } from '@admin/references/ui';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Avatar, Box, IconButton, Switch, Tooltip } from '@mui/material';
import { useMemo } from 'react';

import { ProductModelPriceCell, ProductVariantPriceCell } from './product-price-cells';

import type { ProductPriceTier } from './product-price-cells';
import type { ProductListRow, ProductOverview, ProductOverviewType } from '@admin/products/model';
import type {
  GridColDef,
  GridPaginationModel,
  GridRowSelectionModel,
  GridSortModel,
} from '@mui/x-data-grid';

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
  /** Switch «Активний» (CAT-018); without it the switch is read-only. */
  onActiveChange?: (product: ProductOverview, active: boolean) => void;
  /** The product whose switch is saving. */
  activeSavingId?: number | null;
  /** Server page (CAT-013): `rowCount` matching rows, page and sort models. */
  server: {
    rowCount: number;
    paginationModel: GridPaginationModel;
    onPaginationModelChange: (model: GridPaginationModel) => void;
    sortModel: GridSortModel;
    onSortModelChange: (model: GridSortModel) => void;
  };
}

const tiers: ProductPriceTier[] = ['retail', 'wholesale', 'largeWholesale'];
const isVariant = (row: ProductListRow) => row.kind === 'variant';

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

interface ActiveSwitch {
  onChange?: (product: ProductOverview, active: boolean) => void;
  savingId?: number | null;
}

function photoColumn(): GridColDef<ProductListRow> {
  return {
    field: 'photo',
    headerName: 'Фото',
    width: 64,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ row }) =>
      row.kind === 'model' ? (
        <Avatar
          variant="rounded"
          src={row.product.mainPhotoUrl ?? undefined}
          alt={row.product.mainPhotoUrl ? row.name : undefined}
          aria-label={row.product.mainPhotoUrl ? undefined : 'Без фото'}
          // The whole photo, full height: a person is not cut to a square (CAT-019).
          sx={{
            width: 40,
            height: 48,
            bgcolor: 'action.hover',
            color: 'text.disabled',
            '& img': { objectFit: 'contain' },
          }}
        >
          <ImageOutlinedIcon fontSize="small" />
        </Avatar>
      ) : null,
  };
}

function activeColumn({ onChange, savingId }: ActiveSwitch): GridColDef<ProductListRow> {
  return {
    field: 'isActive',
    headerName: 'Активний',
    width: 96,
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ row, tabIndex }) =>
      row.kind === 'model' ? (
        <Switch
          size="small"
          checked={row.product.isActive}
          disabled={!onChange || savingId === row.id}
          tabIndex={tabIndex}
          slotProps={{ input: { 'aria-label': `Активний: ${row.name}` } }}
          onClick={(event) => event.stopPropagation()}
          onChange={(_event, checked) => onChange?.(row.product, checked)}
        />
      ) : null,
  };
}

function columnsFor(
  type: ProductOverviewType,
  sectionNames: ReadonlyMap<number, string>,
  onToggle: (productId: number) => void,
  active: ActiveSwitch,
): GridColDef<ProductListRow>[] {
  const sewing = type === 'Sewing';
  return [
    ...(sewing
      ? [
          {
            field: 'expand',
            headerName: '',
            width: 52,
            sortable: false,
            disableColumnMenu: true,
            renderCell: ({ row, tabIndex }) =>
              row.kind === 'model' && row.product.variants.length > 0 ? (
                <IconButton
                  size="small"
                  tabIndex={tabIndex}
                  aria-expanded={row.expanded}
                  aria-label={`${row.expanded ? 'Згорнути' : 'Розгорнути'} тканини: ${row.name}`}
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
    {
      field: 'currentSiteUrl',
      headerName: 'Сайт',
      width: 76,
      sortable: false,
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
 * shows its fabric variants with their prices underneath. The server pages and sorts (CAT-013).
 */
export function ProductOverviewGrid({
  type,
  sectionNames,
  onToggle,
  onActiveChange,
  activeSavingId,
  ...props
}: Props) {
  const columns = useMemo(
    () =>
      columnsFor(type, sectionNames, onToggle, {
        onChange: onActiveChange,
        savingId: activeSavingId,
      }),
    [type, sectionNames, onToggle, onActiveChange, activeSavingId],
  );
  return (
    <ReferenceDataGrid
      ariaLabel={type === 'Sewing' ? 'Швейна продукція' : 'ЗІЗ'}
      columns={columns}
      emptyLabel="Товарів поки немає"
      notFoundLabel="Товарів не знайдено"
      menuLabel="Дії товару"
      isDetailRow={isVariant}
      viewLabel="Швидкий перегляд"
      openHref={(row) => `/references/products/${row.id}`}
      {...props}
    />
  );
}
