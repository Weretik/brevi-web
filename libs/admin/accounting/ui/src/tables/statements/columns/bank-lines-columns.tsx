import { bankLineLocked, formatLedgerDate, formatSignedMinor } from '@admin/accounting/model';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, IconButton, Stack, Switch, Tooltip, Typography } from '@mui/material';

import { BankLinePurposeCell } from './bank-line-purpose-cell';

import type { BankStatementLine } from '@admin/accounting/model';
import type { GridColDef } from '@mui/x-data-grid';

export const bankLineMono = {
  fontFamily: 'var(--admin-font-mono)',
  fontVariantNumeric: 'tabular-nums',
};
const mono = bankLineMono;
const twoLines = { py: 0.5, lineHeight: 1.3, minWidth: 0 } as const;
const clipped = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const;

/** The columns of a statement's lines; a booked statement shows them read-only. */
export function bankLinesColumns({
  readOnly,
  savingIds,
  onToggle,
  onOpen,
}: {
  readOnly: boolean;
  savingIds: ReadonlySet<string>;
  onToggle: (line: BankStatementLine, book: boolean) => void;
  onOpen: (line: BankStatementLine) => void;
}): GridColDef<BankStatementLine>[] {
  return [
    {
      field: 'rowNumber',
      headerName: '№',
      width: 64,
      align: 'right',
      headerAlign: 'right',
      cellClassName: 'reference-mono',
    },
    {
      field: 'date',
      headerName: 'Дата',
      width: 108,
      renderCell: ({ row }) => (
        <Stack sx={twoLines}>
          <Box component="span" sx={mono}>
            {row.date ? formatLedgerDate(row.date) : '—'}
          </Box>
          {row.time && (
            <Typography variant="caption" color="text.secondary" sx={mono}>
              {row.time.slice(0, 5)}
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      field: 'purpose',
      headerName: 'Контрагент і призначення',
      flex: 1,
      minWidth: 280,
      renderCell: ({ row }) => <BankLinePurposeCell row={row} />,
    },
    {
      field: 'categoryRootName',
      headerName: 'Категорія',
      width: 200,
      renderCell: ({ row }) => (
        <Box component="span" sx={clipped}>
          {row.transferAccountId
            ? '—'
            : [row.categoryRootName, row.subcategoryName].filter(Boolean).join(' › ') || '—'}
        </Box>
      ),
    },
    {
      field: 'amountMinor',
      headerName: 'Сума',
      width: 150,
      align: 'right',
      headerAlign: 'right',
      renderCell: ({ row }) =>
        row.type && row.amountMinor !== null ? (
          <Box
            component="span"
            sx={{
              ...mono,
              fontWeight: 600,
              color: row.type === 'Income' ? 'success.main' : 'error.main',
              ...(row.willBook ? {} : { color: 'text.disabled' }),
            }}
          >
            {formatSignedMinor(row.type, row.amountMinor, row.currency ?? 'UAH')}
          </Box>
        ) : (
          '—'
        ),
    },
    {
      field: 'willBook',
      headerName: 'Проводити',
      width: 104,
      align: 'center',
      headerAlign: 'center',
      renderCell: ({ row, tabIndex }) => (
        <Switch
          size="small"
          checked={row.willBook}
          disabled={readOnly || bankLineLocked(row) || savingIds.has(row.id)}
          slotProps={{ input: { 'aria-label': `Проводити рядок ${row.rowNumber}`, tabIndex } }}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => onToggle(row, event.target.checked)}
        />
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 56,
      align: 'center',
      renderCell: ({ row, tabIndex }) => {
        const label = `${readOnly ? 'Переглянути' : 'Змінити'} рядок ${row.rowNumber}`;
        return (
          <Tooltip title={label}>
            <IconButton
              size="small"
              aria-label={label}
              tabIndex={tabIndex}
              onClick={(event) => {
                event.stopPropagation();
                onOpen(row);
              }}
              sx={{ width: 40, height: 40 }}
            >
              {readOnly ? (
                <VisibilityOutlinedIcon fontSize="small" />
              ) : (
                <EditOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];
}
