import { formatMeters, formatMetersNumber, stockLastMovementLabel } from '@admin/warehouse/model';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { Fragment } from 'react';

import type {
  FabricStockColor,
  FabricStockFabric,
  FabricStockPair,
  StockSortKey,
} from '@admin/warehouse/model';
import type { KeyboardEvent } from 'react';

interface Props {
  fabrics: readonly FabricStockFabric[];
  /** A search or a filter hides everything: say so instead of «склад порожній». */
  filtered: boolean;
  sort: { key: StockSortKey; descending: boolean };
  onSort: (key: StockSortKey) => void;
  /** Fabric codes shown open. */
  expanded: ReadonlySet<string>;
  onToggle: (fabricCode: string) => void;
  /** A pair row opens its side panel. */
  onOpen: (pair: FabricStockPair) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
const number = formatMetersNumber;

const columns: [StockSortKey, string][] = [
  ['meters', 'Залишок, м'],
  ['booked', 'У броні'],
  ['free', 'Вільно'],
];

/** Only problems get a mark: below zero, or the plans need more than there is. */
function PairMarks({ color }: { color: FabricStockColor }) {
  if (color.meters < 0)
    return <Chip size="small" color="error" variant="outlined" label="Відʼємний" />;
  if (color.toOrder > 0)
    return (
      <Chip
        size="small"
        color="warning"
        variant="outlined"
        label={`Замовити ${number(color.toOrder)}`}
        sx={mono}
      />
    );
  return null;
}

const activate = (event: KeyboardEvent, action: () => void) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    action();
  }
};

/**
 * «Залишки»: one row per fabric and colour under a fabric row with its totals, which folds. Metres in columns that
 * sort; «У броні» is what open plans still need and «Вільно» may go below zero. A pair row opens its side panel.
 */
export function FabricStockTable({
  fabrics,
  filtered,
  sort,
  onSort,
  expanded,
  onToggle,
  onOpen,
}: Props) {
  if (fabrics.length === 0)
    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography color="text.secondary">
          {filtered
            ? 'За цим пошуком і фільтром пар на складі немає.'
            : 'На складі поки нічого немає. Почніть з «Внести початковий залишок».'}
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
        aria-label="Залишки тканин"
        sx={{ minWidth: 760, '& td, & th': { px: 1.25 } }}
      >
        <TableHead sx={{ '& th': { bgcolor: 'background.paper' } }}>
          <TableRow>
            <TableCell
              sortDirection={sort.key === 'name' ? (sort.descending ? 'desc' : 'asc') : false}
            >
              <TableSortLabel
                active={sort.key === 'name'}
                direction={sort.key === 'name' && sort.descending ? 'desc' : 'asc'}
                onClick={() => onSort('name')}
              >
                Тканина / колір
              </TableSortLabel>
            </TableCell>
            {columns.map(([key, label]) => (
              <TableCell
                key={key}
                align="right"
                sortDirection={sort.key === key ? (sort.descending ? 'desc' : 'asc') : false}
                sx={{ width: 120 }}
              >
                <TableSortLabel
                  active={sort.key === key}
                  direction={sort.key === key && !sort.descending ? 'asc' : 'desc'}
                  onClick={() => onSort(key)}
                >
                  {label}
                </TableSortLabel>
              </TableCell>
            ))}
            <TableCell sx={{ width: 200 }}>Остання операція</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fabrics.map((fabric) => {
            const open = expanded.has(fabric.fabricCode);
            const details = [fabric.composition, fabric.density].filter(Boolean).join(' · ');
            return (
              <Fragment key={fabric.fabricCode}>
                <TableRow
                  hover
                  sx={{ bgcolor: 'action.hover', cursor: 'pointer' }}
                  onClick={() => onToggle(fabric.fabricCode)}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        aria-expanded={open}
                        aria-label={`${open ? 'Згорнути' : 'Розгорнути'}: ${fabric.fabricName}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggle(fabric.fabricCode);
                        }}
                      >
                        {open ? (
                          <ExpandMoreOutlinedIcon fontSize="small" />
                        ) : (
                          <ChevronRightOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                          {fabric.fabricName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" component="span">
                          {' '}
                          <Box component="span" sx={mono}>
                            {fabric.codes.join(' = ')}
                          </Box>
                          {details && ` · ${details}`}
                          {!open && ` · ${fabric.colors.length} кол.`}
                        </Typography>
                      </Box>
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
                    {number(fabric.meters)}
                  </TableCell>
                  <TableCell align="right" sx={{ ...mono, fontWeight: 600 }}>
                    {number(fabric.booked)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      ...mono,
                      fontWeight: 600,
                      color: fabric.free < 0 ? 'error.main' : undefined,
                    }}
                  >
                    {number(fabric.free)}
                  </TableCell>
                  <TableCell />
                </TableRow>
                {open &&
                  fabric.colors.map((color) => (
                    <TableRow
                      key={color.colorKey}
                      hover
                      tabIndex={0}
                      aria-label={`${fabric.fabricName}, ${color.color}: ${formatMeters(color.meters)}`}
                      sx={{
                        cursor: 'pointer',
                        '&:focus-visible': { outline: 2, outlineColor: 'primary.main' },
                      }}
                      onClick={() => onOpen({ fabric, color })}
                      onKeyDown={(event) => activate(event, () => onOpen({ fabric, color }))}
                    >
                      <TableCell sx={{ pl: 6.5 }}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}
                        >
                          <Typography variant="body2">{color.color}</Typography>
                          <PairMarks color={color} />
                        </Box>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ ...mono, color: color.meters < 0 ? 'error.main' : undefined }}
                      >
                        {number(color.meters)}
                      </TableCell>
                      <TableCell align="right" sx={{ ...mono, color: 'text.secondary' }}>
                        {color.booked === 0 ? '0' : number(color.booked)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          ...mono,
                          color: color.free < 0 ? 'error.main' : undefined,
                          fontWeight: color.free < 0 ? 600 : undefined,
                        }}
                      >
                        {number(color.free)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {color.lastMovement ? stockLastMovementLabel(color.lastMovement) : '—'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
