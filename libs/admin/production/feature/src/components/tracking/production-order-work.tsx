import { ProductionFiles, ProductionOrderTelegram } from '@admin/production/ui';
import { Alert, Paper, Stack, Typography } from '@mui/material';

import type {
  ProductionFileKind,
  ProductionOrder,
  ProductionOrderFile,
} from '@admin/production/model';

interface Props {
  order: ProductionOrder;
  filesBusy: boolean;
  telegramBusy: boolean;
  onUpload: (kind: ProductionFileKind, file: File) => void;
  onDeleteFile: (file: ProductionOrderFile) => void;
  onSendTelegram: () => void;
  onOpenSettings?: () => void;
}

/** The whole order: the cancel reason, its files and the message to the workshop group. */
export function ProductionOrderWork({
  order,
  filesBusy,
  telegramBusy,
  onUpload,
  onDeleteFile,
  onSendTelegram,
  onOpenSettings,
}: Props) {
  const { permissions } = order;
  const files = order.files.filter((file) => file.itemId === null);
  const showTelegram = order.status === 'New' || order.telegram.status === 'Sent';
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack sx={{ gap: 2 }}>
        {order.status === 'Cancelled' && order.cancelReason && (
          <Alert severity="warning">Скасовано: {order.cancelReason}</Alert>
        )}
        {(files.length > 0 || permissions.canManageFiles) && (
          <div>
            <Typography variant="overline" color="text.secondary" component="h3">
              Файли завдання
            </Typography>
            <ProductionFiles
              label="Файли завдання"
              files={files}
              busy={filesBusy}
              onUpload={permissions.canManageFiles ? onUpload : undefined}
              onDelete={permissions.canManageFiles ? onDeleteFile : undefined}
            />
          </div>
        )}
        {showTelegram && (
          <div>
            <Typography variant="overline" color="text.secondary" component="h3">
              Telegram
            </Typography>
            <ProductionOrderTelegram
              telegram={order.telegram}
              canSend={permissions.canSendTelegram}
              busy={telegramBusy}
              onOpenSettings={onOpenSettings}
              onSend={onSendTelegram}
            />
          </div>
        )}
      </Stack>
    </Paper>
  );
}
