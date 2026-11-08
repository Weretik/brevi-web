import {
  bankDuplicateLabels,
  bankLineLocked,
  bankLineProblemLabels,
  formatLedgerDate,
  formatSignedMinor,
  transactionCounterpartyLabel,
} from '@admin/accounting/model';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, IconButton, Stack, Switch, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { BankStatementLine } from '@admin/accounting/model';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';

interface Props {
  rows: BankStatementLine[];
  rowCount: number;
  loading: boolean;
  /** A booked statement shows its lines read-only. */
  readOnly: boolean;
  paginationModel: GridPaginationModel;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  onOpen: (line: BankStatementLine) => void;
  /** «Проводити» right in the table; off for errors and records already in the books. */
  onToggle: (line: BankStatementLine, book: boolean) => void;
  /** Lines being saved: their switch waits. */
  savingIds: ReadonlySet<string>;
  emptyLabel: string;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
const twoLines = { py: 0.5, lineHeight: 1.3, minWidth: 0 } as const;
const clipped = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const;

/** Who the line is with: the picked counterparty, a one-off name, the own account, or the bank name. */
function partyOf(line: BankStatementLine): { name: string; caption: string | null } {
  if (line.transferAccountName) return { name: line.transferAccountName, caption: 'Переказ' };
  if (line.counterparty || line.oneoffName) {
    const label = transactionCounterpartyLabel(line);
    return { name: label.name, caption: label.caption };
  }
  return {
    name: line.bankName || '—',
    caption: line.edrpou ? `ЄДРПОУ ${line.edrpou}` : null,
  };
}

function problemsOf(line: BankStatementLine): string[] {
  const problems: string[] = [];
  if (line.duplicate !== 'None') problems.push(bankDuplicateLabels[line.duplicate]);
  const state = bankLineProblemLabels[line.state];
  if (state) problems.push(state);
  return problems;
}

/** Lines of one statement, 100 per page from the server; a click or the pencil opens the panel. */
export function BankLinesGrid({
  rows,
  rowCount,
  loading,
  readOnly,
  paginationModel,
  onPaginationModelChange,
  onOpen,
  onToggle,
  savingIds,
  emptyLabel,
}: Props) {
  const theme = useTheme();
  const columns: GridColDef<BankStatementLine>[] = [
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
      renderCell: ({ row }) => {
        const party = partyOf(row);
        const problems = problemsOf(row);
        return (
          <Stack sx={twoLines}>
            <Stack direction="row" sx={{ gap: 1, alignItems: 'center', minWidth: 0 }}>
              <Box component="span" sx={{ fontWeight: 600, ...clipped }}>
                {party.name}
              </Box>
              {party.caption && (
                <Typography variant="caption" color="text.secondary" sx={clipped}>
                  {party.caption}
                </Typography>
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={clipped}>
              {row.error || row.description || row.purpose || '—'}
            </Typography>
            {problems.length > 0 && (
              <Stack direction="row" sx={{ gap: 0.5, flexWrap: 'wrap', pt: 0.25 }}>
                {problems.map((problem) => (
                  <FinanceProblemPill key={problem} label={problem} />
                ))}
              </Stack>
            )}
          </Stack>
        );
      },
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

  return (
    <Box sx={{ width: '100%', minWidth: 0, height: 'var(--admin-table-height)' }}>
      <DataGrid
        aria-label="Рядки виписки"
        rows={rows}
        columns={columns.map((column) => ({
          ...column,
          sortable: false,
          disableColumnMenu: true,
        }))}
        loading={loading}
        getRowHeight={() => 'auto'}
        columnHeaderHeight={44}
        disableRowSelectionOnClick
        onRowClick={({ row }) => onOpen(row)}
        paginationMode="server"
        rowCount={rowCount}
        paginationModel={paginationModel}
        onPaginationModelChange={onPaginationModelChange}
        pageSizeOptions={[paginationModel.pageSize]}
        localeText={{
          ...theme.components?.MuiDataGrid?.defaultProps?.localeText,
          noRowsLabel: emptyLabel,
        }}
        sx={{
          border: 0,
          borderTop: 1,
          borderColor: 'divider',
          borderRadius: 0,
          '& .MuiDataGrid-row': { cursor: 'pointer' },
          '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center', minHeight: 52 },
          '& .reference-mono': mono,
        }}
      />
    </Box>
  );
}
