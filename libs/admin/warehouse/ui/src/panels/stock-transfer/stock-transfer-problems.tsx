import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { StockTransferProblem } from '@admin/warehouse/model';

/** Errors or notes of a transfer check, by table; nothing when there are none. */
export function StockTransferProblems({
  title,
  label,
  problems,
}: {
  title: string;
  label: string;
  problems: StockTransferProblem[];
}) {
  if (problems.length === 0) return null;
  return (
    <Stack sx={{ gap: 1 }}>
      <Typography variant="subtitle2">
        {title}: {problems.length}
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 360 }}>
        <Table stickyHeader size="small" aria-label={label}>
          <TableHead>
            <TableRow>
              <TableCell>Таблиця</TableCell>
              <TableCell>Що</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {problems.map((problem, index) => (
              <TableRow key={`${problem.table}-${problem.rowId ?? ''}-${index}`}>
                <TableCell sx={{ fontFamily: 'var(--admin-font-mono)', whiteSpace: 'nowrap' }}>
                  {problem.table}
                </TableCell>
                <TableCell>{problem.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
