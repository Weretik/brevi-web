import {
  fabricMovementRevisionActionLabels,
  formatDay,
  formatKyivTime,
  formatMeters,
} from '@admin/warehouse/model';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { FabricMovementRevision, FabricMovementState } from '@admin/warehouse/model';

interface Props {
  revisions: readonly FabricMovementRevision[];
}

const signed = (value: number) => `${value > 0 ? '+' : ''}${formatMeters(value)}`;

function StateCell({ state }: { state: FabricMovementState }) {
  return (
    <TableCell>
      <Typography variant="body2" sx={{ fontVariantNumeric: 'tabular-nums' }}>
        {state.isVoided ? 'Скасовано' : signed(state.delta)} · {formatDay(state.operationDate)}
      </Typography>
      <Typography variant="caption" color="text.secondary" component="div">
        {state.fabricCode} · {state.color}
      </Typography>
      {(state.supplierName || state.document) && (
        <Typography variant="caption" color="text.secondary" component="div">
          {[state.supplierName, state.document].filter(Boolean).join(' · ')}
        </Typography>
      )}
      {state.destination && (
        <Typography variant="caption" color="text.secondary" component="div">
          {state.destination}
        </Typography>
      )}
    </TableCell>
  );
}

/** «Історія правок»: every edit, void and restore with the values before and after, newest first. */
export function FabricMovementHistoryTable({ revisions }: Props) {
  if (revisions.length === 0)
    return <Typography color="text.secondary">Цей рух ще не змінювали.</Typography>;
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Історія правок">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell>Що і хто</TableCell>
            <TableCell>Було</TableCell>
            <TableCell>Стало</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {revisions.map((revision) => (
            <TableRow key={revision.id} sx={{ verticalAlign: 'top' }}>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={revision.isUndone ? { textDecoration: 'line-through' } : undefined}
                >
                  {fabricMovementRevisionActionLabels[revision.action]}
                </Typography>
                {revision.isUndone && (
                  <Typography variant="caption" color="warning.main" component="div">
                    Скасована
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" component="div">
                  {revision.createdByName}, {formatKyivTime(revision.createdAt)}
                </Typography>
                {revision.reason && (
                  <Typography variant="caption" color="text.secondary" component="div">
                    {revision.reason}
                  </Typography>
                )}
              </TableCell>
              <StateCell state={revision.before} />
              <StateCell state={revision.after} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
