import {
  fabricIssuePurposeLabels,
  fabricLayerLabels,
  formatDay,
  formatMeters,
} from '@admin/warehouse/model';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import {
  Alert,
  Box,
  Button,
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

import type { FabricIssue, FabricPlanPart, ItemFabric } from '@admin/warehouse/model';

interface Props {
  fabric: ItemFabric;
  busy?: boolean;
  /** Absent: the person may not issue, or the order is closed. */
  onIssue?: () => void;
  onRefreshPlan?: () => void;
  onReverse?: (issue: FabricIssue) => void;
}

const signed = (value: number) => `${value > 0 ? '+' : ''}${formatMeters(value)}`;

const short = (part: FabricPlanPart) =>
  part.reserved > 0 && part.stockAvailable < 0
    ? `На складі не вистачає ${formatMeters(-part.stockAvailable)}`
    : null;

function IssueCard({
  issue,
  busy,
  onReverse,
}: {
  issue: FabricIssue;
  busy: boolean;
  onReverse?: (issue: FabricIssue) => void;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5, opacity: issue.isReversed ? 0.65 : 1 }}>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Видача {formatDay(issue.issuedOn)}
          {issue.issuedQuantity !== null && ` · ${issue.issuedQuantity} шт.`} ·{' '}
          {issue.createdByName}
        </Typography>
        {onReverse && !issue.isReversed && (
          <Button
            size="small"
            startIcon={<UndoOutlinedIcon />}
            disabled={busy}
            onClick={() => onReverse(issue)}
          >
            Сторно видачі
          </Button>
        )}
      </Stack>
      {issue.isReversed && (
        <Typography variant="caption" color="text.secondary" component="p">
          Сторновано{issue.reversedByName ? ` · ${issue.reversedByName}` : ''}
          {issue.reverseReason ? `: ${issue.reverseReason}` : ''}
        </Typography>
      )}
      {issue.note && (
        <Typography variant="body2" color="text.secondary">
          {issue.note}
        </Typography>
      )}
      <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
        {issue.lines.map((line) => (
          <li key={line.id}>
            <Typography
              variant="body2"
              sx={{ textDecoration: line.isVoided ? 'line-through' : undefined }}
            >
              {fabricIssuePurposeLabels[line.purpose]}
              {line.layer && line.layer !== 'Upper'
                ? ` (${fabricLayerLabels[line.layer]})`
                : ''}: {line.fabricCode} · {line.color} — {formatMeters(line.meters)}
              {line.isVoided ? ' · скасовано' : ''}
              {line.note ? ` · ${line.note}` : ''}
            </Typography>
          </li>
        ))}
      </Box>
      {issue.comparison.length > 0 && (
        <Table size="small" aria-label={`План і факт видачі ${formatDay(issue.issuedOn)}`}>
          <TableHead>
            <TableRow>
              <TableCell>Плановий колір</TableCell>
              <TableCell align="right">План</TableCell>
              <TableCell align="right">Факт</TableCell>
              <TableCell align="right">Різниця</TableCell>
              <TableCell align="right">На виріб</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {issue.comparison.map((row) => (
              <TableRow key={`${row.planFabricCode}|${row.planColorKey}`}>
                <TableCell>{row.color}</TableCell>
                <TableCell align="right">{formatMeters(row.plan)}</TableCell>
                <TableCell align="right">{formatMeters(row.actual)}</TableCell>
                <TableCell
                  align="right"
                  sx={{ color: row.difference > 0 ? 'error.main' : undefined }}
                  title={row.difference > 0 ? 'Перевитрата' : undefined}
                >
                  {signed(row.difference)}
                </TableCell>
                <TableCell align="right">{row.perProduct.toLocaleString('uk-UA')} м</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

/**
 * The fabric card of an item: the plan by part (saved at the first issue), what issues covered, and
 * the issues with plan and fact.
 */
export function ItemFabricCard({ fabric, busy = false, onIssue, onRefreshPlan, onReverse }: Props) {
  return (
    <Stack sx={{ gap: 1.5 }}>
      <Stack
        direction="row"
        sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}
      >
        <Typography variant="body2" color="text.secondary">
          {fabric.fabricCode
            ? `${fabric.fabricCode} · ${fabric.fabricName ?? ''}`
            : 'Тканина не вказана'}{' '}
          · {fabric.quantity} шт.
          {fabric.issued > 0 && ` · видано ${formatMeters(fabric.issued)}`}
          {fabric.planVersion > 0 && ` · збережений план, версія ${fabric.planVersion}`}
        </Typography>
        <Stack direction="row" sx={{ gap: 1 }}>
          {onRefreshPlan && fabric.planVersion > 0 && (
            <Button
              size="small"
              startIcon={<RefreshOutlinedIcon />}
              disabled={busy}
              onClick={onRefreshPlan}
            >
              Оновити план
            </Button>
          )}
          {onIssue && (
            <Button size="small" variant="outlined" disabled={busy} onClick={onIssue}>
              Видати тканину
            </Button>
          )}
        </Stack>
      </Stack>
      {!fabric.isOpen && (
        <Alert severity="info">Завдання вже не «Нове»: тканину на нього не видають.</Alert>
      )}
      {fabric.planMissing && <Alert severity="warning">{fabric.planMissing}</Alert>}
      {fabric.plan.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" aria-label="План тканини">
            <TableHead>
              <TableRow>
                <TableCell>Тканина й колір</TableCell>
                <TableCell align="right">План</TableCell>
                <TableCell align="right">Покрито</TableCell>
                <TableCell align="right">Ще розкроїти</TableCell>
                <TableCell align="right">Видано</TableCell>
                <TableCell align="right">Бронь</TableCell>
                <TableCell align="right">Доступно</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fabric.plan.map((part) => {
                const problem = short(part);
                return (
                  <TableRow key={`${part.fabricCode}|${part.colorKey}`}>
                    <TableCell>
                      {part.fabricCode} · {part.color}
                      {part.layer !== 'Upper' ? ` (${fabricLayerLabels[part.layer]})` : ''}
                    </TableCell>
                    <TableCell align="right">{formatMeters(part.planned)}</TableCell>
                    <TableCell align="right">{formatMeters(part.covered)}</TableCell>
                    <TableCell align="right">{formatMeters(part.missing)}</TableCell>
                    <TableCell align="right">{formatMeters(part.issued)}</TableCell>
                    <TableCell align="right">{formatMeters(part.reserved)}</TableCell>
                    <TableCell
                      align="right"
                      title={problem ?? undefined}
                      sx={{ color: problem ? 'error.main' : undefined }}
                    >
                      {part.stockId === null
                        ? 'немає на складі'
                        : formatMeters(part.stockAvailable)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {fabric.issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} busy={busy} onReverse={onReverse} />
      ))}
    </Stack>
  );
}
