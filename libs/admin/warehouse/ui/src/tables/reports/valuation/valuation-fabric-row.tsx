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
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';

import { price } from './valuation-format';
import { ExpandableRow, reportMono } from '../../../components/reports/expandable-row';

import type { ValuationFabric } from '@admin/warehouse/model';

/** «Тканини» of «Довідники», where a price is set. */
export const FABRICS_REFERENCE_PATH = '/references/garment-accessory?tab=fabrics';

interface Props {
  fabric: ValuationFabric;
  /** The value of the whole stock, for the share. */
  total: number;
}

/** One fabric of «Вартість» with its share of the total; it opens its colours. */
export function ValuationFabricRow({ fabric, total }: Props) {
  const share = valuationShare(fabric, total);
  return (
    <ExpandableRow
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
            {fabric.price === null && fabric.value === 0 ? '—' : formatMoney(fabric.value)}
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
                <Link href={FABRICS_REFERENCE_PATH} variant="body2">
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
}
