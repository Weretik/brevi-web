import { ReferenceDataGrid, ReferenceStatusPill } from '@admin/references/ui';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { IconButton, Tooltip } from '@mui/material';
import { useMemo } from 'react';

import type { ProductOverview, ProductOverviewType } from '@admin/products/model';
import type { GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';

interface Props {
  type: ProductOverviewType;
  rows: ProductOverview[];
  sectionNames: ReadonlyMap<number, string>;
  loading: boolean;
  searching?: boolean;
  unavailable?: boolean;
  selection: GridRowSelectionModel;
  onSelectionChange: (selection: GridRowSelectionModel) => void;
  onView: (row: ProductOverview) => void;
  onEdit: (row: ProductOverview) => void;
  onDelete: (id: number) => void;
}

function columnsFor(
  type: ProductOverviewType,
  sectionNames: ReadonlyMap<number, string>,
): GridColDef<ProductOverview>[] {
  return [
    {
      field: 'code',
      headerName: type === 'Sewing' ? 'ID моделі' : 'Артикул сайту',
      width: 130,
      cellClassName: 'reference-mono',
      valueFormatter: (value: string | null) => value || '—',
    },
    {
      field: 'name',
      headerName: type === 'Sewing' ? 'Назва моделі' : 'Назва товару',
      flex: 1.6,
      minWidth: 240,
      cellClassName: 'reference-strong',
    },
    {
      field: 'sectionId',
      headerName: type === 'Sewing' ? 'Категорія' : 'Розділ / категорія',
      flex: 1,
      minWidth: 170,
      valueGetter: (value: number | null) =>
        value === null ? null : (sectionNames.get(value) ?? null),
      valueFormatter: (value: string | null) => value || '—',
    },
    ...(type === 'Sewing'
      ? [
          {
            field: 'season',
            headerName: 'Сезон',
            width: 100,
            valueFormatter: (value: string | null) => value || '—',
          } satisfies GridColDef<ProductOverview>,
        ]
      : []),
    {
      field: 'isActive',
      headerName: 'Статус',
      width: 120,
      renderCell: ({ value }) => (
        <ReferenceStatusPill
          active={Boolean(value)}
          activeLabel="Активний"
          inactiveLabel="Вимкнений"
        />
      ),
    },
    {
      field: 'isVerified',
      headerName: 'Перевірено',
      width: 140,
      cellClassName: 'reference-mono',
      valueGetter: (_value, row) => (row.isVerified ? (row.verifiedOn ?? 'Так') : null),
      valueFormatter: (value: string | null) => value || '—',
    },
    {
      field: 'currentSiteUrl',
      headerName: 'Сайт',
      width: 76,
      sortable: false,
      renderCell: ({ value, row }) =>
        value ? (
          <Tooltip title="Відкрити товар на сайті">
            <IconButton
              size="small"
              component="a"
              href={value as string}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Відкрити «${row.name}» на сайті`}
              onClick={(event) => event.stopPropagation()}
            >
              <OpenInNewOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          '—'
        ),
    },
  ];
}

/** One «Товари» table: sewing models or PPE site articles. */
export function ProductOverviewGrid({ type, sectionNames, ...props }: Props) {
  const columns = useMemo(() => columnsFor(type, sectionNames), [type, sectionNames]);
  return (
    <ReferenceDataGrid
      ariaLabel={type === 'Sewing' ? 'Швейна продукція' : 'ЗІЗ'}
      columns={columns}
      emptyLabel="Товарів поки немає"
      notFoundLabel="Товарів не знайдено"
      menuLabel="Дії товару"
      {...props}
    />
  );
}
