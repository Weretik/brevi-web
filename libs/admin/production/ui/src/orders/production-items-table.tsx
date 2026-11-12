import { formatDay, nextItemStage, productionStageLabels } from '@admin/production/model';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { ProductionItemSteps } from '../tracking/production-item-steps';

import type {
  ProductionItem,
  ProductionOrderOverview,
  ProductionStage,
} from '@admin/production/model';

interface Props {
  items: readonly ProductionItem[];
  overview: ProductionOrderOverview;
  /** The item open in the side panel. */
  selectedId: number | null;
  busy: boolean;
  onOpen: (item: ProductionItem) => void;
  /** Absent: the person may not tick stages, or the order is not «Нове». */
  onNextStage?: (item: ProductionItem, stage: ProductionStage) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/**
 * «Позиції» of an order: one row per item with its stage bar, due date (red when late, amber when due
 * soon) and shipped pieces. A row opens the item side panel; «→ next stage» ticks the next stage.
 */
export function ProductionItemsTable({
  items,
  overview,
  selectedId,
  busy,
  onOpen,
  onNextStage,
}: Props) {
  const late = new Set(overview.overdue.map((x) => x.item.id));
  const soon = new Set(overview.soon.map((x) => x.item.id));
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label="Позиції завдання">
        <TableHead>
          <TableRow>
            <TableCell>Позиція</TableCell>
            <TableCell align="right">Шт.</TableCell>
            <TableCell>Готово до</TableCell>
            <TableCell sx={{ minWidth: 180 }}>Етап</TableCell>
            <TableCell align="right">Відвантажено</TableCell>
            {onNextStage && <TableCell aria-label="Наступний етап" />}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => {
            const next = onNextStage ? nextItemStage(item) : null;
            const line = [item.fabricCode, [item.mainColor, ...item.additionalColors].join(' + ')]
              .filter(Boolean)
              .join(' · ');
            return (
              <TableRow
                key={item.id}
                hover
                selected={item.id === selectedId}
                tabIndex={0}
                aria-label={`Відкрити позицію ${item.position}: ${item.modelName}`}
                onClick={() => onOpen(item)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && event.target === event.currentTarget) onOpen(item);
                }}
                sx={{ cursor: 'pointer', '& td': { py: 1.25 } }}
              >
                <TableCell sx={{ minWidth: 220 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {item.position}. {item.modelName}
                  </Typography>
                  {line && (
                    <Typography variant="caption" color="text.secondary">
                      {line}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right" sx={mono}>
                  {item.quantity}
                </TableCell>
                <TableCell
                  sx={{
                    ...mono,
                    whiteSpace: 'nowrap',
                    color: late.has(item.id)
                      ? 'error.main'
                      : soon.has(item.id)
                        ? 'warning.main'
                        : undefined,
                    fontWeight: late.has(item.id) || soon.has(item.id) ? 600 : undefined,
                  }}
                >
                  {formatDay(item.dueDate)}
                </TableCell>
                <TableCell>
                  <ProductionItemSteps item={item} />
                </TableCell>
                <TableCell align="right" sx={{ ...mono, whiteSpace: 'nowrap' }}>
                  {item.shippedQuantity} / {item.quantity}
                </TableCell>
                {onNextStage && (
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    {next && (
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={busy}
                        aria-label={`Відмітити етап «${productionStageLabels[next]}»: ${item.modelName}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          onNextStage(item, next);
                        }}
                      >
                        → {productionStageLabels[next]}
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
