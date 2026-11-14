import { Paper, Table, TableBody, TableContainer, Typography } from '@mui/material';
import { Fragment } from 'react';

import { FabricStockFabricRow } from './fabric-stock-fabric-row';
import { FabricStockPairRow } from './fabric-stock-pair-row';
import { FabricStockTableHead } from './fabric-stock-table-head';

import type { FabricStockFabric, FabricStockPair, StockSortKey } from '@admin/warehouse/model';

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
        <FabricStockTableHead sort={sort} onSort={onSort} />
        <TableBody>
          {fabrics.map((fabric) => {
            const open = expanded.has(fabric.fabricCode);
            return (
              <Fragment key={fabric.fabricCode}>
                <FabricStockFabricRow fabric={fabric} open={open} onToggle={onToggle} />
                {open &&
                  fabric.colors.map((color) => (
                    <FabricStockPairRow
                      key={color.colorKey}
                      fabric={fabric}
                      color={color}
                      onOpen={onOpen}
                    />
                  ))}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
