import { formatMeters, formatMoney } from '@admin/warehouse/model';
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
import { Fragment } from 'react';

import { reportMono } from '../../components/reports/expandable-row';

import type { ValuationReport, ValuationShortage } from '@admin/warehouse/model';

const price = (value: number | null) => (value === null ? '—' : `${formatMoney(value)}/м`);

/** «Вартість тканин на складі»: colours of each fabric, its subtotal and the total. */
export function ValuationTable({ report }: { report: ValuationReport }) {
  if (report.fabrics.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">На складі немає тканини з додатним залишком.</Typography>
      </Paper>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Вартість тканин на складі">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell>Тканина</TableCell>
            <TableCell>Колір</TableCell>
            <TableCell align="right">Залишок</TableCell>
            <TableCell align="right">Ціна</TableCell>
            <TableCell align="right">Вартість</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {report.fabrics.map((fabric) => (
            <Fragment key={fabric.fabricCode}>
              {fabric.colors.map((color, index) => (
                <TableRow key={color.color}>
                  <TableCell>
                    {index === 0 && (
                      <>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {fabric.fabricName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={reportMono}>
                          {fabric.fabricCode}
                          {fabric.priceFabricCode && fabric.priceFabricCode !== fabric.fabricCode
                            ? ` · ціна з ${fabric.priceFabricCode}`
                            : ''}
                        </Typography>
                      </>
                    )}
                  </TableCell>
                  <TableCell>{color.color}</TableCell>
                  <TableCell align="right" sx={reportMono}>
                    {formatMeters(color.meters)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ ...reportMono, color: color.price === null ? 'warning.main' : undefined }}
                  >
                    {color.price === null ? 'Без ціни' : price(color.price)}
                  </TableCell>
                  <TableCell align="right" sx={reportMono}>
                    {formatMoney(color.value)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ bgcolor: 'action.hover' }}>
                <TableCell colSpan={2}>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Разом {fabric.fabricName}
                  </Typography>
                </TableCell>
                <TableCell align="right" sx={reportMono}>
                  {formatMeters(fabric.meters)}
                </TableCell>
                <TableCell />
                <TableCell align="right" sx={{ ...reportMono, fontWeight: 600 }}>
                  {fabric.price === null ? '—' : formatMoney(fabric.value)}
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>
              {report.isPartial ? 'Разом (частково, без тканин без ціни)' : 'Разом'}
            </TableCell>
            <TableCell align="right" sx={reportMono}>
              {formatMeters(report.positiveMeters)}
            </TableCell>
            <TableCell />
            <TableCell align="right" sx={reportMono}>
              {formatMoney(report.value)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

/** Negative balances: the shortage and its value, apart from the stock value. */
export function ValuationShortageTable({ rows }: { rows: readonly ValuationShortage[] }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Дефіцит">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell>Тканина</TableCell>
            <TableCell>Колір</TableCell>
            <TableCell align="right">Нестача</TableCell>
            <TableCell align="right">Ціна</TableCell>
            <TableCell align="right">Оцінка нестачі</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={`${row.fabricCode}|${row.color}`}>
              <TableCell>
                {row.fabricName}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="div"
                  sx={reportMono}
                >
                  {row.fabricCode}
                </Typography>
              </TableCell>
              <TableCell>{row.color}</TableCell>
              <TableCell align="right" sx={{ ...reportMono, color: 'error.main' }}>
                {formatMeters(row.meters)}
              </TableCell>
              <TableCell align="right" sx={reportMono}>
                {price(row.price)}
              </TableCell>
              <TableCell align="right" sx={reportMono}>
                {formatMoney(row.value)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
