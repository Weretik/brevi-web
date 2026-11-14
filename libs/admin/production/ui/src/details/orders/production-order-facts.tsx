import { formatDay, itemsWord, reportPriceTierLabels } from '@admin/production/model';
import { Box, LinearProgress, Link, Paper, Typography } from '@mui/material';

import type { ProductionOrder, ProductionOrderOverview } from '@admin/production/model';
import type { ReactNode } from 'react';

interface Props {
  order: ProductionOrder;
  overview: ProductionOrderOverview;
  /** Absent for an old order from «Цех»: it keeps only the old КП number. */
  onOpenQuote?: () => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box
      component="div"
      sx={{
        px: 2,
        py: 1.25,
        minWidth: 0,
        borderRight: 1,
        borderBottom: 1,
        borderColor: 'divider',
        mr: '-1px',
        mb: '-1px',
      }}
    >
      <Typography component="dt" variant="overline" color="text.secondary" sx={{ lineHeight: 1.6 }}>
        {label}
      </Typography>
      <Typography component="dd" variant="body2" sx={{ m: 0, fontWeight: 600 }}>
        {children}
      </Typography>
    </Box>
  );
}

const dueRange = ({ dueFrom, dueTo }: ProductionOrderOverview) =>
  dueFrom === dueTo ? formatDay(dueFrom) : `${formatDay(dueFrom)} – ${formatDay(dueTo)}`;

/**
 * One strip of the order facts (the «Цех» metric strip): КП, manager, date, items, due dates and shipped
 * pieces. «Коментар» and «Ціна для звіту» show only when they are set; nothing shows «—».
 */
export function ProductionOrderFacts({ order, overview, onOpenQuote }: Props) {
  const shippedShare = overview.quantity > 0 ? (overview.shipped / overview.quantity) * 100 : 0;
  const late = overview.overdue.length > 0;
  return (
    <Paper variant="outlined" sx={{ mb: 2, overflow: 'hidden' }}>
      <Box
        component="dl"
        aria-label="Про завдання"
        sx={{
          m: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
        }}
      >
        {order.quoteNumber && (
          <Fact label="КП">
            {onOpenQuote ? (
              <Link
                component="button"
                type="button"
                underline="hover"
                onClick={onOpenQuote}
                sx={{ ...mono, color: 'primary.dark', font: 'inherit', fontWeight: 600 }}
              >
                {order.quoteNumber}
              </Link>
            ) : (
              <Box component="span" sx={mono}>
                {order.quoteNumber}
              </Box>
            )}
          </Fact>
        )}
        <Fact label="Менеджер">{order.managerName}</Fact>
        <Fact label="Створено">
          <Box component="span" sx={mono}>
            {formatDay(order.orderDate)}
          </Box>
        </Fact>
        <Fact label="Позиції">
          <Box component="span" sx={mono}>
            {overview.itemsCount} {itemsWord(overview.itemsCount)} · {overview.quantity} шт.
          </Box>
        </Fact>
        {overview.dueFrom && (
          <Fact label="Готово до">
            <Box component="span" sx={{ ...mono, color: late ? 'error.main' : undefined }}>
              {dueRange(overview)}
            </Box>
          </Fact>
        )}
        <Fact label="Відвантажено">
          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearProgress
              variant="determinate"
              value={shippedShare}
              color="success"
              aria-hidden
              sx={{ width: 64, height: 6, borderRadius: 3, flexShrink: 0 }}
            />
            <Box component="span" sx={mono}>
              {overview.shipped} / {overview.quantity}
            </Box>
          </Box>
        </Fact>
        {order.permissions.seesReportPrice && order.priceTier && (
          <Fact label="Ціна для звіту">{reportPriceTierLabels[order.priceTier]}</Fact>
        )}
        {order.comment?.trim() && (
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Fact label="Коментар">
              <Box component="span" sx={{ fontWeight: 400, whiteSpace: 'pre-line' }}>
                {order.comment}
              </Box>
            </Fact>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
