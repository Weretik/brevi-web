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

import type { SewingMaterialLine } from '@admin/products/model';

interface Props {
  lines: SewingMaterialLine[];
  canManage: boolean;
  busy: boolean;
  onOpen: (key: string) => void;
  onEdit: (key: string) => void;
  onDelete: (key: string) => void;
}

const quantity = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 3 });
const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' } as const;
const money = (value: number | null) => (value === null ? '—' : sewingPriceFormat(value));

/**
 * «Комплектація» tab, as the sheet «Комплектація виробів»: the accessories and other costs shared
 * by every fabric of the model. The fabric itself is set on the «Тканини» tab.
 */
export function SewingMaterialsTable({ lines, canManage, busy, onOpen, onEdit, onDelete }: Props) {
  if (!lines.length) {
    return (
      <Typography sx={{ color: 'text.secondary' }}>
        Комплектації поки немає.{canManage ? ' Додайте фурнітуру або іншу витрату.' : ''}
      </Typography>
    );
  }
  const total = lines.reduce((sum, line) => sum + (line.total ?? 0), 0);
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Комплектація моделі">
        <TableHead>
          <TableRow>
            <TableCell>Тип</TableCell>
            <TableCell>Назва</TableCell>
            <TableCell align="right">Кількість</TableCell>
            <TableCell>Од.</TableCell>
            <TableCell align="right">Ціна</TableCell>
            <TableCell align="right">Сума</TableCell>
            <TableCell>Коментар</TableCell>
            {canManage && <TableCell />}
          </TableRow>
        </TableHead>
        <TableBody>
          {lines.map((line) => (
            <TableRow
              key={line.key}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => onOpen(line.key)}
            >
              <TableCell sx={{ color: 'text.secondary' }}>{line.kindLabel}</TableCell>
              <TableCell sx={{ minWidth: 200, fontWeight: 600 }}>{line.name}</TableCell>
              <TableCell align="right" sx={mono}>
                {quantity.format(line.quantity)}
              </TableCell>
              <TableCell>{line.unitLabel}</TableCell>
              <TableCell align="right" sx={mono}>
                {money(line.price)}
              </TableCell>
              <TableCell align="right" sx={mono}>
                {money(line.total)}
              </TableCell>
              <TableCell sx={{ minWidth: 140, color: 'text.secondary' }}>
                {line.comment || '—'}
              </TableCell>
              {canManage && (
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
            <TableCell colSpan={5} sx={{ fontWeight: 600 }}>
              Разом без тканини
            </TableCell>
            <TableCell align="right" sx={{ ...mono, fontWeight: 600 }}>
              {sewingPriceFormat(total)}
            </TableCell>
            <TableCell colSpan={canManage ? 2 : 1} />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
