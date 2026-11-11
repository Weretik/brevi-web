import { List, ListItemButton, ListItemText, Typography } from '@mui/material';

import type { FabricIssueItem } from '@admin/warehouse/model';

interface Props {
  items: readonly FabricIssueItem[];
  hasMore: boolean;
  onChoose: (item: FabricIssueItem) => void;
}

/** Open items of «Швейний цех» found for «Видача на завдання». */
export function FabricIssueItemList({ items, hasMore, onChoose }: Props) {
  if (items.length === 0)
    return (
      <Typography variant="body2" color="text.secondary">
        Відкритих позицій не знайдено.
      </Typography>
    );
  return (
    <>
      <List dense disablePadding aria-label="Позиції завдань">
        {items.map((item) => (
          <ListItemButton key={item.itemId} onClick={() => onChoose(item)}>
            <ListItemText
              primary={`№ ${item.orderNumber} · ${item.clientName} · ${item.modelName}`}
              secondary={`${item.fabricCode ? `${item.fabricCode} · ${item.fabricName ?? ''}` : 'Тканина не вказана'} · ${item.quantity} шт.`}
            />
          </ListItemButton>
        ))}
      </List>
      {hasMore && (
        <Typography variant="caption" color="text.secondary">
          Показано перші {items.length}. Уточніть пошук.
        </Typography>
      )}
    </>
  );
}
