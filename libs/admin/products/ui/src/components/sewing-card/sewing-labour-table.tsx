import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { SewingLineActions } from './sewing-line-actions';
import { sewingPriceFormat } from '../sewing-pricing/sewing-price-format';

import type { SewingLabourLine } from '@admin/products/model';

interface Props {
  lines: SewingLabourLine[];
  /** False when no Article has a live price, so line costs are unknown. */
  costsKnown: boolean;
  canManage?: boolean;
  busy?: boolean;
  onOpen?: (key: string) => void;
  onEdit?: (key: string) => void;
  onDelete?: (key: string) => void;
}

const minutes = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 2 });
const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;

/** «Трудовитрати» tab summary, as the sheet «Трудовитрати виробів»: time and pay of each operation. */
export function SewingLabourTable({
  lines,
  costsKnown,
  canManage = false,
  busy = false,
  onOpen,
  onEdit,
  onDelete,
}: Props) {
  const actions = canManage && onEdit && onDelete;
  const totalMinutes = lines.reduce((sum, line) => sum + (line.minutes ?? 0), 0);
  const totalCost = lines.reduce((sum, line) => sum + (line.cost ?? 0), 0);
  if (!lines.length) {
    return (
      <Typography sx={{ color: 'text.secondary' }}>
        Операцій поки немає.{canManage ? ' Додайте першу операцію.' : ''}
      </Typography>
    );
  }
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Трудовитрати моделі">
        <TableHead>
          <TableRow>
            <TableCell>Операція</TableCell>
            <TableCell align="right">Кількість</TableCell>
            <TableCell align="right">Час, хв</TableCell>
            <TableCell align="right">Вартість</TableCell>
            <TableCell>Коментар</TableCell>
            {actions && <TableCell />}
          </TableRow>
        </TableHead>
        <TableBody>
          {lines.map((line) => (
            <TableRow
              key={line.key}
              hover={Boolean(onOpen)}
              sx={onOpen ? { cursor: 'pointer' } : undefined}
              onClick={onOpen ? () => onOpen(line.key) : undefined}
            >
              <TableCell sx={{ minWidth: 220 }}>{line.name}</TableCell>
              <TableCell align="right" sx={mono}>
                {minutes.format(line.quantity)}
              </TableCell>
              <TableCell align="right" sx={mono}>
                {line.minutes === null ? '—' : minutes.format(line.minutes)}
                {line.manual && (
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{ color: 'text.secondary', ml: 0.5 }}
                  >
                    вручну
                  </Typography>
                )}
              </TableCell>
              <TableCell align="right" sx={mono}>
                {line.cost === null ? '—' : sewingPriceFormat(line.cost)}
              </TableCell>
              <TableCell sx={{ minWidth: 160, color: 'text.secondary' }}>
                {line.comment || '—'}
              </TableCell>
              {actions && (
                <TableCell padding="none" sx={{ pr: 1 }}>
                  <SewingLineActions
                    name={line.name}
                    disabled={busy}
                    onEdit={() => onEdit(line.key)}
                    onDelete={() => onDelete(line.key)}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Разом</TableCell>
            <TableCell />
            <TableCell align="right" sx={{ ...mono, fontWeight: 600 }}>
              {minutes.format(totalMinutes)}
            </TableCell>
            <TableCell align="right" sx={{ ...mono, fontWeight: 600 }}>
              {costsKnown ? sewingPriceFormat(totalCost) : '—'}
            </TableCell>
            <TableCell sx={{ color: 'text.secondary' }}>
              {costsKnown
                ? 'Зарплата швачки з урахуванням збирання'
                : 'Вартість з’явиться, коли тканина розраховується'}
            </TableCell>
            {actions && <TableCell />}
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
