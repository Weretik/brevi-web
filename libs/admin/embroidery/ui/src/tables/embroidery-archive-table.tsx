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

import type { EmbroideryArchiveAction, EmbroideryArchiveResult } from '@admin/embroidery/model';

const checkLabels: Record<EmbroideryArchiveAction, string> = {
  created: 'Буде перенесено',
  unchanged: 'Уже перенесено',
  error: 'Помилка',
};

const date = (value: string) => new Date(value).toLocaleDateString('uk-UA');

interface Props {
  result: EmbroideryArchiveResult;
}

/** What «Імпорт архіву» will do or did, one old calculation per row; errors first. */
export function EmbroideryArchiveTable({ result }: Props) {
  const lines = [...result.lines].sort(
    (a, b) => Number(b.action === 'error') - Number(a.action === 'error'),
  );
  return (
    <Stack sx={{ gap: 1.5 }}>
      {result.errors > 0 && (
        <Alert severity="error">
          Розрахунків з помилками: {result.errors}. Поки вони у файлі, нічого не перенесеться.
        </Alert>
      )}
      <Typography variant="body2" role="status">
        {result.dryRun ? 'Буде перенесено' : 'Перенесено'}: {result.created} · Уже перенесено:{' '}
        {result.unchanged}
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 420 }}>
        <Table stickyHeader size="small" aria-label="Розрахунки архіву">
          <TableHead>
            <TableRow>
              <TableCell>Назва</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Автор</TableCell>
              <TableCell>Результат</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lines.map((line) => (
              <TableRow key={line.legacyId}>
                <TableCell>{line.name || 'Без назви'}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>{date(line.createdAt)}</TableCell>
                <TableCell>{line.createdByName}</TableCell>
                <TableCell sx={{ color: line.action === 'error' ? 'error.main' : undefined }}>
                  {line.message ??
                    (line.number && line.action === 'created'
                      ? line.number
                      : checkLabels[line.action])}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
