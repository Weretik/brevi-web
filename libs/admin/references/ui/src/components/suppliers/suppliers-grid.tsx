import { Stack, Typography } from '@mui/material';

import { SupplierLinkCell } from './supplier-link-cell';
import { ReferenceDataGrid } from '../reference-list/reference-data-grid';
import { ReferenceStatusPill } from '../reference-list/reference-status-pill';

import type { Supplier } from '@admin/references/model';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  rows: Supplier[];
  loading: boolean;
  searching?: boolean;
  unavailable?: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: number) => void;
}

const columns: GridColDef<Supplier>[] = [
  {
    field: 'id',
    headerName: 'ID',
    width: 72,
    align: 'right',
    headerAlign: 'right',
    cellClassName: 'reference-mono',
  },
  {
    field: 'name',
    headerName: 'Назва',
    flex: 1.5,
    minWidth: 220,
    renderCell: ({ row }) => (
      <Stack sx={{ justifyContent: 'center', height: '100%', minWidth: 0 }}>
        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
          {row.name}
        </Typography>
        {row.keepinCrmId && (
          <Typography
            variant="caption"
            color="text.secondary"
            noWrap
            sx={{ fontFamily: 'var(--admin-font-mono)', lineHeight: 1.2 }}
          >
            KeepinCRM {row.keepinCrmId}
          </Typography>
        )}
      </Stack>
    ),
  },
  {
    field: 'purchaseCategories',
    headerName: 'Що закуповуємо',
    flex: 1,
    minWidth: 160,
    valueFormatter: (value: string | null) => value || '—',
  },
  {
    field: 'contactPerson',
    headerName: 'Контактна особа',
    flex: 1,
    minWidth: 170,
    valueFormatter: (value: string | null) => value || '—',
  },
  {
    field: 'phoneNumber',
    headerName: 'Телефон',
    width: 180,
    cellClassName: 'reference-mono',
    valueFormatter: (value: string | null) => value || '—',
  },
  {
    field: 'link',
    headerName: 'Сайт',
    flex: 1,
    minWidth: 160,
    renderCell: ({ value, tabIndex }) => (
      <SupplierLinkCell value={value ?? null} tabIndex={tabIndex} />
    ),
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
    minWidth: 180,
    valueFormatter: (value: string | null) => value || '—',
  },
  {
    field: 'isActive',
    headerName: 'Статус',
    width: 170,
    type: 'boolean',
    align: 'left',
    headerAlign: 'left',
    renderCell: ({ value }) => (
      <ReferenceStatusPill
        active={Boolean(value)}
        activeLabel="Активний"
        inactiveLabel="Не використовується"
      />
    ),
  },
];

export function SuppliersGrid(props: Props) {
  return (
    <ReferenceDataGrid
      ariaLabel="Постачальники"
      columns={columns}
      emptyLabel="Постачальників поки немає"
      notFoundLabel="Постачальників не знайдено"
      menuLabel="Дії постачальника"
      {...props}
    />
  );
}
