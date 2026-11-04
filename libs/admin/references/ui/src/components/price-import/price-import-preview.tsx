import { formatUah, isPriceImportProblem, priceImportStatusLabel } from '@admin/references/model';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { PriceImportResult, PriceImportRow } from '@admin/references/model';

interface Props {
  result: PriceImportResult;
  /** Insight lists also carry wholesale and retail. */
  showTiers: boolean;
}

const price = (value: number | null) => (value === null ? '—' : formatUah(value));

function PriceChange({ from, to }: { from: number | null; to: number | null }) {
  if (from === to || to === null) return <>{price(from)}</>;
  return (
    <>
      <Box
        component="span"
        sx={{ color: 'text.secondary', textDecoration: 'line-through', mr: 0.75 }}
      >
        {price(from)}
      </Box>
      <Box component="span" sx={{ fontWeight: 600 }}>
        {price(to)}
      </Box>
    </>
  );
}

/** Products of the supplier with old and new prices; changes and problems first. */
export function PriceImportPreview({ result, showTiers }: Props) {
  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {result.applied ? 'Записано' : 'Зміниться'}: <b>{result.changed}</b> · без змін{' '}
        {result.unchanged} · пропущено {result.skipped} · проблем{' '}
        {result.rows.filter(isPriceImportProblem).length}
      </Typography>
      <TableContainer sx={{ maxHeight: 420, border: 1, borderColor: 'divider', borderRadius: 1 }}>
        <Table stickyHeader size="small" aria-label="Ціни з файлу">
          <TableHead>
            <TableRow>
              <TableCell>Код</TableCell>
              <TableCell>Товар</TableCell>
              <TableCell align="right">Ціна постачальника</TableCell>
              {showTiers && <TableCell align="right">Опт</TableCell>}
              {showTiers && <TableCell align="right">Роздріб</TableCell>}
              <TableCell>Що буде</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.rows.map((row) => (
              <PreviewRow key={row.productId} row={row} showTiers={showTiers} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function PreviewRow({ row, showTiers }: { row: PriceImportRow; showTiers: boolean }) {
  const problem = isPriceImportProblem(row);
  return (
    <TableRow>
      <TableCell className="reference-mono">{row.code ?? '—'}</TableCell>
      <TableCell sx={{ minWidth: 200 }}>{row.name}</TableCell>
      <TableCell align="right" className="reference-mono" sx={{ whiteSpace: 'nowrap' }}>
        <PriceChange from={row.oldPrice} to={row.newPrice} />
      </TableCell>
      {showTiers && (
        <TableCell align="right" className="reference-mono" sx={{ whiteSpace: 'nowrap' }}>
          <PriceChange from={row.oldWholesale} to={row.newWholesale} />
        </TableCell>
      )}
      {showTiers && (
        <TableCell align="right" className="reference-mono" sx={{ whiteSpace: 'nowrap' }}>
          <PriceChange from={row.oldRetail} to={row.newRetail} />
        </TableCell>
      )}
      <TableCell sx={{ minWidth: 160 }}>
        <Typography
          variant="body2"
          color={
            problem ? 'warning.main' : row.status === 'Changed' ? 'text.primary' : 'text.secondary'
          }
        >
          {priceImportStatusLabel(row.status)}
        </Typography>
        {row.message && (
          <Typography variant="caption" color="text.secondary">
            {row.message}
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
}
