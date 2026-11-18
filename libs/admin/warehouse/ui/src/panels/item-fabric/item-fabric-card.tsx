import { fabricLayerLabels, formatMeters } from '@admin/warehouse/model';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import {
  Alert,
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

import { ItemFabricIssueCard } from './item-fabric-issue-card';

import type { FabricIssue, FabricPlanPart, ItemFabric } from '@admin/warehouse/model';

interface Props {
  fabric: ItemFabric;
  busy?: boolean;
  /** Absent: the person may not issue, or the order is closed. */
  onIssue?: () => void;
  onRefreshPlan?: () => void;
  onReverse?: (issue: FabricIssue) => void;
}

const short = (part: FabricPlanPart) =>
  part.reserved > 0 && part.stockAvailable < 0
    ? `На складі не вистачає ${formatMeters(-part.stockAvailable)}`
    : null;

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
        <ItemFabricIssueCard key={issue.id} issue={issue} busy={busy} onReverse={onReverse} />
      ))}
    </Stack>
  );
}
