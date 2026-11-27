import { sewingBlockerReasons } from '@admin/products/model';
import { ReferenceStatusPill } from '@admin/references/ui';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, IconButton, Tooltip } from '@mui/material';

import { amount, labourKinds, metres, money, moneyColumn } from './sewing-variant-money';
import { SewingCardStatusPill } from '../../components/sewing-card/sewing-card-status-pill';

import type { SewingVariantRow } from '@admin/products/model';
import type { GridColDef } from '@mui/x-data-grid';

/** Columns of «Тканини»: fabric, SKU, metres, the cost parts for Admin, three prices and actions. */
export function sewingVariantColumns(
  canManage: boolean,
  showCost: boolean,
  onEdit: (row: SewingVariantRow) => void,
  onDelete: (row: SewingVariantRow) => void,
): GridColDef<SewingVariantRow>[] {
  return [
    {
      field: 'fabricName',
      headerName: 'Тканина',
      flex: 1.4,
      minWidth: 200,
      sortable: false,
      cellClassName: 'sewing-strong',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, py: 1 }}>
          <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.fabricName ?? (row.fabricId === null ? 'Без тканини' : `Тканина ${row.fabricId}`)}
          </Box>
          {!row.active && (
            <ReferenceStatusPill active={false} activeLabel="" inactiveLabel="Вимкнена" />
          )}
        </Box>
      ),
    },
    {
      field: 'saleSku',
      headerName: 'Артикул',
      width: 100,
      sortable: false,
      cellClassName: 'sewing-mono',
    },
    {
      field: 'fabricQuantity',
      headerName: 'Розхід, м',
      width: 100,
      sortable: false,
      align: 'right',
      headerAlign: 'right',
      cellClassName: 'sewing-mono',
      valueFormatter: (value: number | null) => (value === null ? '—' : metres.format(value)),
    },
    ...(showCost
      ? [
          moneyColumn('materials', 'Матеріали', (row) => amount(row, ['materials', 'otherCosts'])),
          moneyColumn('labour', 'Праця', (row) => amount(row, labourKinds)),
          moneyColumn('overhead', 'Накладні', (row) => amount(row, ['overhead'])),
          moneyColumn('fullCost', 'Собівартість', (row) => row.summary?.fullCost ?? null, true),
        ]
      : []),
    {
      ...moneyColumn('retail', '1–9 шт.', (row) => row.summary?.prices?.retail ?? null, true),
      minWidth: 150,
      // Only a problem is shown: the reasons replace the missing price (CAT-013).
      renderCell: ({ row }) =>
        !row.summary || row.summary.calculated ? (
          money(row.summary?.prices?.retail ?? null)
        ) : (
          <Box
            sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', py: 1, justifyContent: 'flex-end' }}
          >
            {sewingBlockerReasons(row.summary.blockers).map((reason) => (
              <SewingCardStatusPill key={reason} label={reason} tone="warning" />
            ))}
          </Box>
        ),
    },
    moneyColumn('wholesale', '10–40 шт.', (row) => row.summary?.prices?.wholesale ?? null),
    moneyColumn(
      'largeWholesale',
      'Від 41 шт.',
      (row) => row.summary?.prices?.largeWholesale ?? null,
    ),
    ...(canManage
      ? [
          {
            field: 'actions',
            headerName: '',
            width: 96,
            sortable: false,
            renderCell: ({ row }) => (
              <Box sx={{ display: 'flex' }}>
                <Tooltip title="Змінити">
                  <IconButton
                    size="small"
                    aria-label={`Змінити тканину: ${row.fabricName ?? row.saleSku}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(row);
                    }}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Видалити">
                  <IconButton
                    size="small"
                    aria-label={`Видалити тканину: ${row.fabricName ?? row.saleSku}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(row);
                    }}
                  >
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            ),
          } satisfies GridColDef<SewingVariantRow>,
        ]
      : []),
  ];
}
