import { fabricIssuePurposeLabels, formatDay, formatMeters } from '@admin/production/model';
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

import type { FabricIssue, FabricPlanPart, ProductionItemFabric } from '@admin/production/model';

interface Props {
  fabric: ProductionItemFabric;
  busy?: boolean;
  /** Absent: the person may not issue (or the order is not «Нове»). */
  onIssue?: () => void;
  onReverse?: (issue: FabricIssue) => void;
}

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
          Видача {formatDay(issue.issuedOn)} · {issue.createdByName}
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
            <Typography variant="body2">
              {fabricIssuePurposeLabels[line.purpose]}: {line.fabricCode} · {line.color} —{' '}
              {formatMeters(line.meters)}
              {line.purpose !== 'Additional' && line.coveredMeters !== line.meters
                ? ` (з плану ${formatMeters(line.coveredMeters)})`
                : ''}
            </Typography>
          </li>
        ))}
      </Box>
    </Paper>
  );
}

/** «Тканина» of an item: the plan by colour, what issues covered, and the issues. */
export function ProductionItemFabricPanel({ fabric, busy = false, onIssue, onReverse }: Props) {
  return (
    <Stack sx={{ gap: 1.5 }}>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          {fabric.fabricCode
            ? `${fabric.fabricCode} · ${fabric.fabricName ?? ''}`
            : 'Тканина не вказана'}
          {fabric.issued > 0 && ` · видано ${formatMeters(fabric.issued)}`}
        </Typography>
        {onIssue && (
          <Button size="small" variant="outlined" disabled={busy} onClick={onIssue}>
            Видати тканину
          </Button>
        )}
      </Stack>
      {!fabric.hasNorm && (
        <Alert severity="warning">
          Немає норми тканини для цієї моделі, тому бронь не рахується. Додайте її в «Норми витрати
          тканини».
        </Alert>
      )}
      {fabric.plan.length > 0 && (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small" aria-label="План тканини">
            <TableHead>
              <TableRow>
                <TableCell>Колір</TableCell>
                <TableCell align="right">План</TableCell>
                <TableCell align="right">Покрито</TableCell>
                <TableCell align="right">Видано</TableCell>
                <TableCell align="right">Бронь</TableCell>
                <TableCell align="right">Доступно</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fabric.plan.map((part) => {
                const problem = short(part);
                return (
                  <TableRow key={part.colorKey}>
                    <TableCell>{part.color}</TableCell>
                    <TableCell align="right">{formatMeters(part.planned)}</TableCell>
                    <TableCell align="right">{formatMeters(part.covered)}</TableCell>
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
