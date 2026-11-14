import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Avatar, IconButton, Switch, Tooltip } from '@mui/material';

import type { ProductListRow, ProductOverview } from '@admin/products/model';
import type { GridColDef } from '@mui/x-data-grid';

export interface ActiveSwitch {
  onChange?: (product: ProductOverview, active: boolean) => void;
  savingId?: number | null;
}

/** The arrow that shows or hides a sewing model's fabric variants. */
export function expandColumn(onToggle: (productId: number) => void): GridColDef<ProductListRow> {
  return {
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
  };
}

/** The main photo, whole and full height. */
export function photoColumn(): GridColDef<ProductListRow> {
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

/** Switch «Активний»; read-only without a handler. */
export function activeColumn({ onChange, savingId }: ActiveSwitch): GridColDef<ProductListRow> {
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

/** A link to the product on the current site, when it has one. */
export function siteLinkColumn(): GridColDef<ProductListRow> {
  return {
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
  };
}
