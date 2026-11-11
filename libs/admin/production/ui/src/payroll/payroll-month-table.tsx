import { formatHours, formatMoney } from '@admin/production/model';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import {
  IconButton,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import type { PayrollLine, PayrollTotals } from '@admin/production/model';

interface Props {
  lines: readonly PayrollLine[];
  totals: PayrollTotals;
  /** Admin on an open month: «Видано» is typed in the table. */
  canEditIssued: boolean;
  busy: boolean;
  onOpen: (line: PayrollLine) => void;
  onSaveIssued: (line: PayrollLine, raw: string) => Promise<boolean>;
}

const mono = { fontFamily: 'var(--admin-font-mono)', whiteSpace: 'nowrap' } as const;
const money = (value: number) => (value === 0 ? '—' : formatMoney(value));

function IssuedCell({
  line,
  busy,
  onSave,
}: {
  line: PayrollLine;
  busy: boolean;
  onSave: (raw: string) => Promise<boolean>;
}) {
  const saved = line.issued === null ? '' : String(line.issued).replace('.', ',');
  const [value, setValue] = useState<string | null>(null);
  const shown = value ?? saved;
  return (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
      <TextField
        size="small"
        value={shown}
        placeholder="—"
        disabled={busy}
        sx={{ width: 110 }}
        onChange={(event) => setValue(event.target.value)}
        slotProps={{ htmlInput: { inputMode: 'decimal', 'aria-label': `Видано: ${line.name}` } }}
      />
      <IconButton
        size="small"
        aria-label={`Зберегти «Видано»: ${line.name}`}
        disabled={busy || value === null || value === saved}
        onClick={() =>
          void onSave(shown).then((done) => {
            if (done) setValue(null);
          })
        }
      >
        <SaveOutlinedIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}

type Part = 'sewing' | 'cutting' | 'bonus' | 'master' | 'chief' | 'embroidery' | 'other';

/** Columns of the money kinds; a kind nobody earned in the month is left out. */
const parts: readonly { key: Part; label: string; count?: 'sewn' | 'cut' }[] = [
  { key: 'sewing', label: 'Пошив', count: 'sewn' },
  { key: 'cutting', label: 'Крій', count: 'cut' },
  { key: 'bonus', label: 'Премія' },
  { key: 'master', label: 'Майстер' },
  { key: 'chief', label: 'Начальник' },
  { key: 'embroidery', label: 'Вишивка' },
  { key: 'other', label: 'Інше' },
];

/** «Нарахування працівникам»: what each worker earned, was paid and is due in the month. */
export function PayrollMonthTable({
  lines,
  totals,
  canEditIssued,
  busy,
  onOpen,
  onSaveIssued,
}: Props) {
  if (lines.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        За цей місяць нарахувань немає.
      </Typography>
    );
  const shown = parts.filter((part) => lines.some((line) => line[part.key] !== 0));
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Нарахування працівникам">
        <TableHead>
          <TableRow>
            <TableCell>Працівник</TableCell>
            <TableCell align="right">Години</TableCell>
            {shown.map((part) => (
              <TableCell key={part.key} align="right">
                {part.label}
              </TableCell>
            ))}
            <TableCell align="right">Нараховано</TableCell>
            <TableCell align="right">Виплачено</TableCell>
            <TableCell align="right">До видачі</TableCell>
            <TableCell>Видано</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lines.map((line) => (
            <TableRow key={line.employeeId} hover>
              <TableCell>
                <Link
                  component="button"
                  type="button"
                  onClick={() => onOpen(line)}
                  sx={{ fontWeight: 600 }}
                >
                  {line.name}
                </Link>
                <Typography variant="caption" color="text.secondary" component="div">
                  {line.position}
                  {line.isActive ? '' : ' · не працює'}
                </Typography>
              </TableCell>
              <TableCell align="right" sx={mono}>
                {line.minutes === 0 ? '—' : formatHours(line.minutes)}
              </TableCell>
              {shown.map((part) => {
                const count = part.count ? line[part.count] : 0;
                return (
                  <TableCell
                    key={part.key}
                    align="right"
                    sx={{
                      ...mono,
                      color: part.key === 'other' && line.other < 0 ? 'error.main' : undefined,
                    }}
                  >
                    {money(line[part.key])}
                    {count > 0 && (
                      <Typography variant="caption" color="text.secondary" component="div">
                        {count} шт.
                      </Typography>
                    )}
                  </TableCell>
                );
              })}
              <TableCell align="right" sx={{ ...mono, fontWeight: 700 }}>
                {formatMoney(line.accrued)}
              </TableCell>
              <TableCell align="right" sx={mono}>
                {money(line.paid)}
              </TableCell>
              <TableCell
                align="right"
                sx={{ ...mono, fontWeight: 700, color: line.due < 0 ? 'error.main' : undefined }}
              >
                {formatMoney(line.due)}
              </TableCell>
              <TableCell>
                {canEditIssued ? (
                  <IssuedCell line={line} busy={busy} onSave={(raw) => onSaveIssued(line, raw)} />
                ) : (
                  <Typography variant="body2" sx={mono}>
                    {formatMoney(line.issued)}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Разом</TableCell>
            <TableCell align="right" sx={mono}>
              {formatHours(totals.minutes)}
            </TableCell>
            {shown.map((part) => (
              <TableCell key={part.key} align="right" sx={mono}>
                {formatMoney(totals[part.key])}
              </TableCell>
            ))}
            <TableCell align="right" sx={mono}>
              {formatMoney(totals.accrued)}
            </TableCell>
            <TableCell align="right" sx={mono}>
              {formatMoney(totals.paid)}
            </TableCell>
            <TableCell align="right" sx={mono}>
              {formatMoney(totals.due)}
            </TableCell>
            <TableCell sx={mono}>{formatMoney(totals.issued)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
