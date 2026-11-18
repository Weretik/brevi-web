import {
  fabricIssuePurposeLabels,
  fabricLayerLabels,
  formatDay,
  formatMeters,
} from '@admin/warehouse/model';
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined';
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { FabricIssue } from '@admin/warehouse/model';

const signed = (value: number) => `${value > 0 ? '+' : ''}${formatMeters(value)}`;

/** One issue of an item: who and when, its lines, the plan and fact per colour and «Сторно видачі». */
export function ItemFabricIssueCard({
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
