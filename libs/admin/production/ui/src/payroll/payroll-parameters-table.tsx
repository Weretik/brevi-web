import { formatParameterValue, formatProductionDate } from '@admin/production/model';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { PayrollParameter } from '@admin/production/model';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

interface Props {
  rows: PayrollParameter[];
  loading: boolean;
}

/** Read-only list of the coefficients the workshop pays by; a problem gets a mark with its reason. */
export function PayrollParametersTable({ rows, loading }: Props) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label="Правила зарплати" size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell>Для чого</TableCell>
            <TableCell>Параметр</TableCell>
            <TableCell align="right">Значення</TableCell>
            <TableCell>Змінено</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && rows.length === 0
            ? [0, 1, 2].map((key) => (
                <TableRow key={key}>
                  <TableCell colSpan={4}>
                    <Skeleton />
                  </TableCell>
                </TableRow>
              ))
            : rows.map((row) => (
                <TableRow key={row.code} sx={{ height: 52 }}>
                  <TableCell sx={{ fontWeight: 600 }}>{row.purpose}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{row.name ?? '—'}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={mono}>
                      {row.code}
                    </Typography>
                    {row.problem && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: 'error.main',
                        }}
                      >
                        <ErrorOutlineOutlinedIcon fontSize="inherit" />
                        <Typography variant="caption">{row.problem}</Typography>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="right" sx={mono}>
                    {formatParameterValue(row.value, row.unit)}
                  </TableCell>
                  <TableCell sx={mono}>{formatProductionDate(row.updatedOn)}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
