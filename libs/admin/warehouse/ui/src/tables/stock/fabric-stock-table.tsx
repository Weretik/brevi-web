import { formatMeters } from '@admin/warehouse/model';
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { FabricStockFabric, FabricStockPair } from '@admin/warehouse/model';

interface Props {
  fabrics: readonly FabricStockFabric[];
  /** The search hides everything: say so instead of «склад порожній». */
  searching: boolean;
  /** «Уточнити» for people who may move stock; a colour chip opens it. */
  onAdjust: ((pair: FabricStockPair) => void) | null;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/**
 * «Залишки»: a fabric with its composition and density, every colour with metres, and the total.
 * Only a shortage gets a mark: negative metres stay in the table in red.
 */
export function FabricStockTable({ fabrics, searching, onAdjust }: Props) {
  if (fabrics.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">
          {searching
            ? 'За цим пошуком тканин і кольорів на складі немає.'
            : 'На складі поки нічого немає. Почніть з «Початкові залишки».'}
        </Typography>
      </Paper>
    );
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Залишки тканин">
        <TableHead>
          <TableRow sx={{ bgcolor: 'action.hover' }}>
            <TableCell sx={{ width: '34%' }}>Тканина</TableCell>
            <TableCell>Колір і метраж</TableCell>
            <TableCell align="right" sx={{ width: 120 }}>
              Разом, м
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fabrics.map((fabric) => (
            <TableRow key={fabric.fabricCode} sx={{ verticalAlign: 'top' }}>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {fabric.fabricName}
                </Typography>
                <Typography variant="caption" color="text.secondary" component="div">
                  <Box component="span" sx={mono}>
                    {fabric.codes.join(' = ')}
                  </Box>
                  {[fabric.composition, fabric.density].filter(Boolean).length > 0 &&
                    ` · ${[fabric.composition, fabric.density].filter(Boolean).join(' · ')}`}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  {fabric.colors.map((color) => {
                    const label = `${color.color} · ${formatMeters(color.meters)}`;
                    return (
                      <Chip
                        key={color.colorKey}
                        size="small"
                        variant="outlined"
                        color={color.meters < 0 ? 'error' : 'default'}
                        label={label}
                        aria-label={onAdjust ? `Уточнити: ${fabric.fabricName}, ${label}` : label}
                        onClick={onAdjust ? () => onAdjust({ fabric, color }) : undefined}
                        sx={{ ...mono, fontWeight: color.meters < 0 ? 600 : 400 }}
                      />
                    );
                  })}
                </Box>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  ...mono,
                  fontWeight: 600,
                  color: fabric.meters < 0 ? 'error.main' : undefined,
                }}
              >
                {formatMeters(fabric.meters)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
