import { formatHours, formatMoney } from '@admin/production/model';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { IconButton, Link, Stack, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { mono } from './payroll-entry-cells';

import type { PayrollLine } from '@admin/production/model';

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

export type PayrollPart =
  'sewing' | 'cutting' | 'bonus' | 'master' | 'chief' | 'embroidery' | 'other';

/** Columns of the money kinds; a kind nobody earned in the month is left out. */
export const payrollParts: readonly { key: PayrollPart; label: string; count?: 'sewn' | 'cut' }[] =
  [
    { key: 'sewing', label: 'Пошив', count: 'sewn' },
    { key: 'cutting', label: 'Крій', count: 'cut' },
    { key: 'bonus', label: 'Премія' },
    { key: 'master', label: 'Майстер' },
    { key: 'chief', label: 'Начальник' },
    { key: 'embroidery', label: 'Вишивка' },
    { key: 'other', label: 'Інше' },
  ];

interface Props {
  line: PayrollLine;
  /** The money kinds shown in the month. */
  parts: typeof payrollParts;
  canEditIssued: boolean;
  busy: boolean;
  onOpen: (line: PayrollLine) => void;
  onSaveIssued: (line: PayrollLine, raw: string) => Promise<boolean>;
}

/** One worker of «Нарахування працівникам»: hours, each money kind, accrued, paid, due and issued. */
export function PayrollMonthRow({ line, parts, canEditIssued, busy, onOpen, onSaveIssued }: Props) {
  return (
    <TableRow hover>
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
      {parts.map((part) => {
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
  );
}
