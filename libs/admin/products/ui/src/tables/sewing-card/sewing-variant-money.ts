import { sewingPriceFormat } from '../../components/sewing-pricing/tiers/sewing-price-format';

import type { SewingCostKind, SewingVariantRow } from '@admin/products/model';
import type { GridColDef } from '@mui/x-data-grid';

/** Cost kinds summed into «Праця». */
export const labourKinds: SewingCostKind[] = [
  'seamstress',
  'cutting',
  'master',
  'manager',
  'bonus',
];
export const money = (value: number | null) => (value === null ? '—' : sewingPriceFormat(value));
export const metres = new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 3 });
/** The sum of the given cost kinds; null until the model is calculated. */
export const amount = (row: SewingVariantRow, kinds: SewingCostKind[]) =>
  row.summary?.calculated
    ? row.summary.costs
        .filter((cost) => kinds.includes(cost.kind))
        .reduce((sum, cost) => sum + cost.amount, 0)
    : null;

/** A right-aligned money column. */
export function moneyColumn(
  field: string,
  headerName: string,
  value: (row: SewingVariantRow) => number | null,
  strong = false,
): GridColDef<SewingVariantRow> {
  return {
    field,
    headerName,
    width: 120,
    sortable: false,
    align: 'right',
    headerAlign: 'right',
    cellClassName: strong ? 'sewing-mono sewing-strong' : 'sewing-mono',
    valueGetter: (_value, row) => value(row),
    valueFormatter: (value: number | null) => money(value),
  };
}
