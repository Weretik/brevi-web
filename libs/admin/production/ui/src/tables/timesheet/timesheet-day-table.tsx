import { formatHours, hoursInput } from '@admin/production/model';
import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import type { TimesheetDraft, TimesheetRow } from '@admin/production/model';

interface Props {
  rows: readonly TimesheetRow[];
  draft: TimesheetDraft;
  /** Workers whose typed hours are wrong. */
  invalid: ReadonlySet<number>;
  /** Workers whose typed hours differ from the saved ones. */
  changed: ReadonlySet<number>;
  canEdit: boolean;
  busy: boolean;
  onChange: (employeeId: number, value: string) => void;
}

/** Only what needs attention: a wrong value, unsaved hours, a day not marked, an absence. */
function state(row: TimesheetRow, isInvalid: boolean, isChanged: boolean) {
  if (isInvalid) return { text: 'Години від 0 до 24, крок 0,25', color: 'error.main' };
  if (isChanged) return { text: 'Не збережено', color: 'warning.main' };
  if (row.minutes === null) return { text: 'Не відмічено', color: 'text.secondary' };
  if (row.minutes === 0) return { text: 'Відсутній', color: 'text.secondary' };
  return null;
}

/** «Робочий час» of a day: hours of every worker; empty means not marked, 0 means absent. */
export function TimesheetDayTable({
  rows,
  draft,
  invalid,
  changed,
  canEdit,
  busy,
  onChange,
}: Props) {
  if (rows.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        У «Працівники цеху» ще немає працівників.
      </Typography>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Години працівників">
        <TableHead>
          <TableRow>
            <TableCell>Працівник</TableCell>
            <TableCell>Посада</TableCell>
            <TableCell sx={{ width: 140 }}>Години</TableCell>
            {canEdit && <TableCell sx={{ width: 110 }} />}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const typed = draft[row.employeeId];
            const value = typed ?? (row.minutes === null ? '' : hoursInput(row.minutes));
            const note = state(row, invalid.has(row.employeeId), changed.has(row.employeeId));
            return (
              <TableRow key={row.employeeId}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {row.name}
                  </Typography>
                  {!row.isActive && (
                    <Typography variant="caption" color="text.secondary">
                      Не працює
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{row.position}</TableCell>
                <TableCell>
                  {canEdit ? (
                    <TextField
                      size="small"
                      value={value}
                      placeholder="—"
                      disabled={busy}
                      error={invalid.has(row.employeeId)}
                      onChange={(event) => onChange(row.employeeId, event.target.value)}
                      slotProps={{
                        htmlInput: {
                          inputMode: 'decimal',
                          'aria-label': `Години: ${row.name}`,
                        },
                        input: { endAdornment: <Typography variant="caption">год</Typography> },
                      }}
                    />
                  ) : (
                    <Typography variant="body2" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
                      {row.minutes === null ? '—' : `${formatHours(row.minutes)} год`}
                    </Typography>
                  )}
                </TableCell>
                {canEdit && (
                  <TableCell>
                    <Stack direction="row" sx={{ gap: 0.5 }}>
                      {['8', '0'].map((hours) => (
                        <Button
                          key={hours}
                          size="small"
                          variant="outlined"
                          disabled={busy}
                          aria-label={`${hours} год: ${row.name}`}
                          sx={{ minWidth: 40 }}
                          onClick={() => onChange(row.employeeId, hours)}
                        >
                          {hours}
                        </Button>
                      ))}
                    </Stack>
                  </TableCell>
                )}
                <TableCell>
                  {note && (
                    <Typography variant="body2" sx={{ color: note.color }}>
                      {note.text}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
