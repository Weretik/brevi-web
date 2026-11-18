import { ReferencePageHeader } from '@admin/references/ui';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import { Box, Button, Stack } from '@mui/material';

export const formatTime = (value: string) =>
  new Date(value).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

interface Props {
  lastSuccess?: string | null;
  canEdit: boolean;
  syncing: boolean;
  recognition: { starting: boolean; start: () => Promise<unknown> };
  onSync: () => void;
}

/** Title, the last refresh time and «Розпізнати всі нові» / «Оновити зараз». */
export function PurchaseInvoicesHeader({
  lastSuccess,
  canEdit,
  syncing,
  recognition,
  onSync,
}: Props) {
  return (
    <ReferencePageHeader
      title="Рахунки на закупку"
      subtitle={
        lastSuccess ? (
          <>
            Повідомлення з Google-таблиці «финансы» оновлюються щодня. Останнє оновлення:{' '}
            <Box component="span" sx={{ fontFamily: 'var(--admin-font-mono)' }}>
              {formatTime(lastSuccess)}
            </Box>
          </>
        ) : (
          'Повідомлення з Google-таблиці «финансы». Реєстр ще не оновлювався.'
        )
      }
      actions={
        canEdit ? (
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<AutoAwesomeOutlinedIcon />}
              disabled={syncing || recognition.starting}
              onClick={() => void recognition.start()}
            >
              Розпізнати всі нові
            </Button>
            <Button
              variant="outlined"
              startIcon={<SyncOutlinedIcon />}
              disabled={syncing}
              onClick={onSync}
            >
              {syncing ? 'Оновлення…' : 'Оновити зараз'}
            </Button>
          </Stack>
        ) : null
      }
    />
  );
}
