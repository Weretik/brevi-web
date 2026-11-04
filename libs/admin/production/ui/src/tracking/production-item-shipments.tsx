import { formatDay } from '@admin/production/model';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { Button, IconButton, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';

import type { ProductionItem } from '@admin/production/model';

interface Props {
  item: ProductionItem;
  /** Absent: the person may not ship. */
  onShip?: () => void;
  onCancel?: (shipmentId: number) => void;
  busy?: boolean;
}

/** «Відвантаження» of an item: how much went to the client and when. */
export function ProductionItemShipments({ item, onShip, onCancel, busy = false }: Props) {
  const remaining = item.quantity - item.shippedQuantity;
  return (
    <Stack sx={{ gap: 0.5 }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
          Відвантажено {item.shippedQuantity} з {item.quantity} шт.
        </Typography>
        {onShip && remaining > 0 && (
          <Button
            size="small"
            startIcon={<LocalShippingOutlinedIcon />}
            disabled={busy}
            aria-label={`Відвантажити позицію ${item.position}: ${item.modelName}`}
            onClick={onShip}
          >
            Відвантажити
          </Button>
        )}
      </Stack>
      {item.shipments.length > 0 && (
        <List dense disablePadding aria-label={`Відвантаження: ${item.modelName}`}>
          {item.shipments.map((shipment) => (
            <ListItem
              key={shipment.id}
              disableGutters
              secondaryAction={
                onCancel && (
                  <IconButton
                    edge="end"
                    size="small"
                    disabled={busy}
                    aria-label={`Скасувати відвантаження ${shipment.quantity} шт. ${formatDay(shipment.shippedOn)}`}
                    onClick={() => onCancel(shipment.id)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )
              }
            >
              <ListItemText
                primary={`${formatDay(shipment.shippedOn)} · ${shipment.quantity} шт.`}
                secondary={[shipment.comment, shipment.createdByName].filter(Boolean).join(' · ')}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Stack>
  );
}
