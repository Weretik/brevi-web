import { ProductionFiles, ProductionOrderTelegram } from '@admin/production/ui';
import { Alert, Box, Paper, Typography } from '@mui/material';

import type {
  ProductionFileKind,
  ProductionOrder,
  ProductionOrderFile,
} from '@admin/production/model';
import type { ReactNode } from 'react';

interface Props {
  order: ProductionOrder;
  filesBusy: boolean;
  telegramBusy: boolean;
  onUpload: (kind: ProductionFileKind, file: File) => void;
  onDeleteFile: (file: ProductionOrderFile) => void;
  onSendTelegram: () => void;
  onOpenSettings?: () => void;
}

function Cell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Paper variant="outlined" sx={{ px: 2, py: 1.5, minWidth: 0 }}>
      <Typography variant="overline" color="text.secondary" component="h3">
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

/**
 * The whole order: the cancel reason, its files and the message to the workshop group. A message already
 * sent is history («Історія змін»), so the Telegram cell shows only what still needs doing or went wrong.
 */
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
  const showFiles = files.length > 0 || permissions.canManageFiles;
  const showTelegram = order.status === 'New' && order.telegram.status !== 'Sent';
  const cancelled = order.status === 'Cancelled' && order.cancelReason;
  if (!showFiles && !showTelegram && !cancelled) return null;
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      {cancelled && <Alert severity="warning">Скасовано: {order.cancelReason}</Alert>}
      {(showFiles || showTelegram) && (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: showFiles && showTelegram ? '1fr 1fr' : '1fr' },
          }}
        >
          {showFiles && (
            <Cell title="Файли завдання">
              <ProductionFiles
                label="Файли завдання"
                files={files}
                busy={filesBusy}
                onUpload={permissions.canManageFiles ? onUpload : undefined}
                onDelete={permissions.canManageFiles ? onDeleteFile : undefined}
              />
            </Cell>
          )}
          {showTelegram && (
            <Cell title="Telegram">
              <ProductionOrderTelegram
                telegram={order.telegram}
                canSend={permissions.canSendTelegram}
                busy={telegramBusy}
                onOpenSettings={onOpenSettings}
                onSend={onSendTelegram}
              />
            </Cell>
          )}
        </Box>
      )}
    </Box>
  );
}
