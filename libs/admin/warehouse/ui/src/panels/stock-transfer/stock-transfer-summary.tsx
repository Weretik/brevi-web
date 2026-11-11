import { formatKyivTime, formatMeters } from '@admin/warehouse/model';
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

import type { StockTransferProblem, StockTransferResult } from '@admin/warehouse/model';

const number = (value: number | null | undefined) =>
  value === null || value === undefined ? '—' : value.toLocaleString('uk-UA');

interface Props {
  result: StockTransferResult;
}

/**
 * What the old «Цех» holds, what Brevi gets and what Brevi holds now (it is lost), then the errors
 * that block the transfer and the notes on rows moved in their own way.
 */
export function StockTransferSummary({ result }: Props) {
  const { source, target, current } = result;
  const rows: { label: string; source: string; target: string; current: string }[] = [
    {
      label: 'Рядки складу (тканина + колір)',
      source: number(source.lines),
      target: number(target?.lines),
      current: number(current.lines),
    },
    {
      label: 'Рухи',
      source: number(source.movements),
      target: number(target?.movements),
      current: number(current.movements),
    },
    {
      label: 'Правки рухів',
      source: number(source.revisions),
      target: number(target?.revisions),
      current: '—',
    },
    {
      label: 'Видачі на завдання',
      source: number(source.packages),
      target: number(target?.issues),
      current: number(current.issues),
    },
    {
      label: 'Рядки видач',
      source: number(source.issueLines),
      target: number(target?.issueLines),
      current: '—',
    },
    {
      label: 'Плани позицій',
      source: number(source.reservations),
      target: number(target?.plans),
      current: number(current.plans),
    },
    {
      label: 'Метрів на складі',
      source: formatMeters(source.meters),
      target: target ? formatMeters(target.meters) : '—',
      current: '—',
    },
  ];
  const own = current.ownLines + current.ownMovements + current.ownIssues;
  return (
    <Stack sx={{ gap: 1.5 }} role="status" aria-label="Результат перевірки">
      {result.applied && (
        <Alert severity="success">Склад тканин замінено даними старого «Цеху».</Alert>
      )}
      {result.unchanged && (
        <Alert severity="info">
          Цю вигрузку вже перенесено, і в Brevi відтоді нічого не вносили. Склад не зміниться.
        </Alert>
      )}
      {result.errors.length > 0 && (
        <Alert severity="error">
          Помилок у вигрузці: {result.errors.length}. Поки їх не виправити, склад не зміниться.
        </Alert>
      )}
      {own > 0 && !result.applied && (
        <Alert severity="warning">
          У Brevi вже внесено вручну: рядків складу {current.ownLines}, рухів {current.ownMovements}
          , видач {current.ownIssues}. Перенесення їх видалить.
        </Alert>
      )}
      {source.negativePairs > 0 && (
        <Typography variant="body2" color="warning.main">
          У старому «Цеху» відʼємний залишок у {source.negativePairs} парах; він переноситься як є.
        </Typography>
      )}
      <TableContainer component={Paper} variant="outlined">
        <Table size="small" aria-label="Порівняння складу">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align="right">Старий «Цех»</TableCell>
              <TableCell align="right">Отримає Brevi</TableCell>
              <TableCell align="right">У Brevi зараз</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell>{row.label}</TableCell>
                <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  {row.source}
                </TableCell>
                <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  {row.target}
                </TableCell>
                <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                  {row.current}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {result.lastTransferAt && (
        <Typography variant="caption" color="text.secondary">
          Попереднє перенесення: {formatKyivTime(result.lastTransferAt)}
        </Typography>
      )}
      <ProblemTable title="Помилки" label="Помилки вигрузки" problems={result.errors} />
      <ProblemTable title="Зауваження" label="Зауваження" problems={result.notes} />
    </Stack>
  );
}

function ProblemTable({
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
