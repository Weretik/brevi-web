import {
  formatSignedMinor,
  formatLedgerDate,
  movementSourceLabels,
  transactionCounterpartyLabel,
  verificationProblemLabels,
} from '@admin/accounting/model';
import { Box, Stack, Typography } from '@mui/material';

import { FinanceProblemPill } from '../../components/status/finance-problem-pill';

import type { FinanceTransaction } from '@admin/accounting/model';
import type { GridColDef } from '@mui/x-data-grid';

/** A journal row; `name` labels the row menu. */
export type FinanceTransactionRow = FinanceTransaction & { name: string };

const voided = (row: FinanceTransaction) => row.status === 'Void';
const struck = (row: FinanceTransaction) =>
  voided(row) ? { textDecoration: 'line-through', color: 'text.disabled' } : undefined;

export const signedTransactionAmount = (row: FinanceTransaction) =>
  formatSignedMinor(row.type, row.amountMinor, row.currency);

const twoLines = { py: 0.5, lineHeight: 1.3, minWidth: 0 } as const;
const clipped = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const;

export const financeTransactionColumns: GridColDef<FinanceTransactionRow>[] = [
  {
    field: 'date',
    headerName: 'Дата',
    width: 112,
    renderCell: ({ row }) => (
      <Stack sx={twoLines}>
        <Box component="span" sx={{ fontFamily: 'var(--admin-font-mono)', ...struck(row) }}>
          {formatLedgerDate(row.date)}
        </Box>
        {row.source !== 'Manual' && (
          <Typography variant="caption" color="text.secondary">
            {movementSourceLabels[row.source]}
          </Typography>
        )}
      </Stack>
    ),
  },
  {
    field: 'description',
    headerName: 'Опис і контрагент',
    flex: 1,
    minWidth: 260,
    sortable: false,
    renderCell: ({ row }) => {
      const label = transactionCounterpartyLabel(row);
      const counterpartyProblem =
        row.verification === 'NeedsCounterpartyReview'
          ? verificationProblemLabels.NeedsCounterpartyReview
          : null;
      return (
        <Stack sx={twoLines}>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', minWidth: 0 }}>
            {voided(row) && <FinanceProblemPill label="Анульовано" />}
            <Box component="span" sx={{ fontWeight: 600, ...clipped, ...struck(row) }}>
              {row.description || row.comment || '—'}
            </Box>
          </Stack>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={clipped}>
              {[label.name === '—' ? null : label.name, label.caption]
                .filter(Boolean)
                .join(' · ') || 'Без контрагента'}
            </Typography>
            {label.missing && <FinanceProblemPill label="Немає в довіднику" />}
            {counterpartyProblem && <FinanceProblemPill label={counterpartyProblem} />}
          </Stack>
        </Stack>
      );
    },
  },
  {
    field: 'categoryRootName',
    headerName: 'Категорія',
    width: 220,
    sortable: false,
    renderCell: ({ row }) =>
      row.categoryRootName ? (
        <Box component="span" sx={clipped}>
          {[row.categoryRootName, row.subcategoryName].filter(Boolean).join(' › ')}
        </Box>
      ) : (
        <FinanceProblemPill label={verificationProblemLabels.NeedsCategory ?? 'Без категорії'} />
      ),
  },
  { field: 'accountName', headerName: 'Рахунок', width: 170, sortable: false },
  {
    field: 'amountMinor',
    headerName: 'Сума',
    width: 150,
    align: 'right',
    headerAlign: 'right',
    cellClassName: 'reference-mono',
    renderCell: ({ row }) => (
      <Box
        component="span"
        sx={{
          fontWeight: 600,
          color: row.type === 'Income' ? 'success.main' : 'error.main',
          ...struck(row),
        }}
      >
        {signedTransactionAmount(row)}
      </Box>
    ),
  },
];
