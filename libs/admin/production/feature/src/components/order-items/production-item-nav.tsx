import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';

import type { ProductionItem, ProductionOrder } from '@admin/production/model';

interface Props {
  order: ProductionOrder;
  item: ProductionItem;
  onMove: (item: ProductionItem) => void;
}

/** Arrows to the previous and next item of the order with «2 з 5» between them; nothing for a single item. */
export function ProductionItemNav({ order, item, onMove }: Props) {
  if (order.items.length < 2) return null;
  const index = order.items.findIndex((x) => x.id === item.id);
  const previous = order.items[index - 1];
  const next = order.items[index + 1];
  return (
    <Stack direction="row" sx={{ mr: 'auto', order: -1, alignItems: 'center', gap: 0.5 }}>
      <Tooltip title="Попередня позиція">
        <span>
          <IconButton
            aria-label="Попередня позиція"
            disabled={!previous}
            onClick={() => previous && onMove(previous)}
          >
            <ChevronLeftIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontFamily: 'var(--admin-font-mono)' }}
      >
        {index + 1} з {order.items.length}
      </Typography>
      <Tooltip title="Наступна позиція">
        <span>
          <IconButton
            aria-label="Наступна позиція"
            disabled={!next}
            onClick={() => next && onMove(next)}
          >
            <ChevronRightIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
