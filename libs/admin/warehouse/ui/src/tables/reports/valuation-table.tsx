import {
  formatMeters,
  formatMetersNumber,
  formatMoney,
  valuationShare,
} from '@admin/warehouse/model';
import {
  Box,
  Chip,
  LinearProgress,
  Link,
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
import { Link as RouterLink } from 'react-router-dom';

import { ExpandableRow, reportMono } from '../../components/reports/expandable-row';

import type { ValuationFabric, ValuationReport, ValuationShortage } from '@admin/warehouse/model';

const price = (value: number | null) => (value === null ? '—' : `${formatMoney(value)}/м`);

/** «Тканини» of «Довідники», where a price is set. */
export const FABRICS_REFERENCE_PATH = '/references/garment-accessory?tab=fabrics';

interface Props {
  report: ValuationReport;
  fabrics: readonly ValuationFabric[];
  /** A chip hides everything. */
  filtered: boolean;
}

/**
 * «Вартість»: one row per fabric with its metres, price, value and share of the total, the most valuable first; a
 * fabric without a price is marked with a link to «Тканини». A row opens its colours.
 */
export function ValuationTable({ report, fabrics, filtered }: Props) {
  if (fabrics.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">
          {filtered
            ? 'За цим фільтром нічого немає.'
            : 'На складі немає тканини з додатним залишком.'}
        </Typography>
      </Paper>
    );
  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{ maxHeight: 'var(--admin-table-height)', overflow: 'auto' }}
    >
      <Table
        size="small"
        stickyHeader
        aria-label="Вартість тканин на складі"
        sx={{ minWidth: 760, '& td, & th': { px: 1.25 } }}
      >
        <TableHead sx={{ '& th': { bgcolor: 'background.paper' } }}>
          <TableRow>
            <TableCell sx={{ width: 40 }} />
            <TableCell>Тканина</TableCell>
            <TableCell align="right" sx={{ width: 120 }}>
              Залишок, м
            </TableCell>
            <TableCell align="right" sx={{ width: 130 }}>
              Ціна, грн/м
            </TableCell>
            <TableCell align="right" sx={{ width: 150 }}>
              Вартість
            </TableCell>
            <TableCell sx={{ width: 200 }}>Частка</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fabrics.map((fabric) => {
            const share = valuationShare(fabric, report.value);
            return (
              <ExpandableRow
                key={fabric.fabricCode}
                label={fabric.fabricName}
                columns={6}
                cells={
                  <>
                    <TableCell>
                      <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                        {fabric.fabricName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" component="div">
                        <Box component="span" sx={reportMono}>
                          {fabric.fabricCode}
                        </Box>
                        {` · ${fabric.colors.length} кол.`}
                        {fabric.priceFabricCode && fabric.priceFabricCode !== fabric.fabricCode
                          ? ` · ціна з ${fabric.priceFabricCode}`
                          : ''}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={reportMono}>
                      {formatMetersNumber(fabric.meters)}
                    </TableCell>
                    <TableCell align="right" sx={reportMono}>
                      {fabric.price === null ? '—' : formatMoney(fabric.price).replace(' грн', '')}
                    </TableCell>
                    <TableCell align="right" sx={{ ...reportMono, fontWeight: 600 }}>
                      {fabric.price === null && fabric.value === 0
                        ? '—'
                        : formatMoney(fabric.value)}
                    </TableCell>
                    <TableCell>
                      {fabric.unpricedMeters > 0 ? (
                        <>
                          <Chip
                            size="small"
                            color="warning"
                            variant="outlined"
                            label={
                              fabric.unpricedMeters < fabric.meters
                                ? `Без ціни ${formatMetersNumber(fabric.unpricedMeters)} м`
                                : 'Немає ціни'
                            }
                          />{' '}
                          <Link component={RouterLink} to={FABRICS_REFERENCE_PATH} variant="body2">
                            До «Тканини»
                          </Link>
                        </>
                      ) : (
                        <LinearProgress
                          variant="determinate"
                          value={share * 100}
                          aria-label={`Частка ${Math.round(share * 100)}%`}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      )}
                    </TableCell>
                  </>
                }
              >
                <Table size="small" aria-label={`Кольори: ${fabric.fabricName}`}>
                  <TableBody>
                    {fabric.colors.map((color) => (
                      <TableRow key={color.color}>
                        <TableCell>{color.color}</TableCell>
                        <TableCell align="right" sx={reportMono}>
                          {formatMeters(color.meters)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            ...reportMono,
                            color: color.price === null ? 'warning.main' : undefined,
                          }}
                        >
                          {color.price === null ? 'Без ціни' : price(color.price)}
                        </TableCell>
                        <TableCell align="right" sx={reportMono}>
                          {formatMoney(color.value)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ExpandableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell />
            <TableCell>{report.isPartial ? 'Разом (без тканин без ціни)' : 'Разом'}</TableCell>
            <TableCell align="right" sx={reportMono}>
              {formatMetersNumber(report.positiveMeters)}
            </TableCell>
            <TableCell />
            <TableCell align="right" sx={reportMono}>
              {formatMoney(report.value)}
            </TableCell>
            <TableCell />
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
