import { formatProductionDate } from '@admin/production/model';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Alert, Button, Link, Stack, Typography } from '@mui/material';

import type { ProductionTelegram } from '@admin/production/model';

interface Props {
  telegram: ProductionTelegram;
  canSend: boolean;
  /** WorkshopChief and Admin get a way to set the group. */
  onOpenSettings?: () => void;
  busy: boolean;
  onSend: () => void;
}

/**
 * The message to the workshop group. It is shown only when there is something to do or a problem:
 * not sent yet, a failure with its reason, or the group not set.
 */
export function ProductionOrderTelegram({
  telegram,
  canSend,
  onOpenSettings,
  busy,
  onSend,
}: Props) {
  if (telegram.status === 'Sent')
    return (
      <Typography variant="body2" color="text.secondary">
        Надіслано в цех {formatProductionDate(telegram.sentAt)}
        {telegram.sentByName ? ` · ${telegram.sentByName}` : ''}
      </Typography>
    );
  if (telegram.status === 'Sending')
    return (
      <Typography variant="body2" color="text.secondary" role="status">
        Повідомлення в цех надсилається…
      </Typography>
    );
  return (
    <Stack sx={{ gap: 1 }}>
      {telegram.status === 'Failed' && (
        <Alert severity="error">
          Повідомлення в цех не надіслано: {telegram.error ?? 'невідома помилка'}.
        </Alert>
      )}
      {!telegram.ready && (
        <Alert severity="warning">
          Групу цеху в Telegram не налаштовано, тому повідомлення не можна надіслати.
          {onOpenSettings && (
            <>
              {' '}
              <Link component="button" type="button" onClick={onOpenSettings}>
                Налаштування цеху
              </Link>
            </>
          )}
        </Alert>
      )}
      {canSend && (
        <div>
          <Button
            variant="outlined"
            startIcon={<SendOutlinedIcon />}
            disabled={busy}
            onClick={onSend}
          >
            {telegram.status === 'Failed' ? 'Надіслати ще раз' : 'Надіслати в цех'}
          </Button>
        </div>
      )}
    </Stack>
  );
}
