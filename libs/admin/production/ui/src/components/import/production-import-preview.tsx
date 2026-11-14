import {
  Alert,
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

import type { ProductionImportAction, ProductionImportResult } from '@admin/production/model';

const actionLabels: Record<ProductionImportAction, string> = {
  created: 'Додати',
  updated: 'Оновити',
  unchanged: 'Без змін',
  error: 'Помилка',
};

const doneLabels: Record<ProductionImportAction, string> = {
  created: 'Додано',
  updated: 'Оновлено',
  unchanged: 'Без змін',
  error: 'Помилка',
};

interface Props {
  result: ProductionImportResult;
  keyLabel: string;
  detailLabel: string;
}

/** What an import will do (preview) or did, row by row; error rows first. */
export function ProductionImportPreview({ result, keyLabel, detailLabel }: Props) {
  const labels = result.dryRun ? actionLabels : doneLabels;
  const lines = [...result.lines].sort(
    (a, b) => Number(b.action === 'error') - Number(a.action === 'error'),
  );
  return (
    <Stack sx={{ gap: 1.5 }}>
      {result.errors > 0 && (
        <Alert severity="error">
          Рядків з помилками: {result.errors}. Поки їх не виправити у файлі, нічого не збережеться.
        </Alert>
      )}
      <Typography variant="body2" role="status">
        {labels.created}: {result.created} · {labels.updated}: {result.updated} · Без змін:{' '}
        {result.unchanged}
      </Typography>
      {result.notes?.map((note) => (
        <Alert key={note} severity="info">
          {note}
        </Alert>
      ))}
      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 420 }}>
        <Table stickyHeader size="small" aria-label="Рядки імпорту">
          <TableHead>
            <TableRow>
              <TableCell>{keyLabel}</TableCell>
              <TableCell>{detailLabel}</TableCell>
              <TableCell>Дія</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lines.map((line, index) => (
              <TableRow key={`${line.key}-${index}`}>
                <TableCell sx={{ fontFamily: 'var(--admin-font-mono)' }}>{line.key}</TableCell>
                <TableCell>{line.detail ?? '—'}</TableCell>
                <TableCell sx={{ color: line.action === 'error' ? 'error.main' : undefined }}>
                  {line.error ?? labels[line.action]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
