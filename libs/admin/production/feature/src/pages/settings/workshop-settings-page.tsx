import { formatProductionDate } from '@admin/production/model';
import { WorkshopSettingsForm } from '@admin/production/ui';
import {
  ReferenceFormSection,
  ReferenceListAlerts,
  ReferencePageHeader,
} from '@admin/references/ui';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';

import { useWorkshopSettings } from '../../hooks/settings/use-workshop-settings';

/** «Швейний цех › Налаштування цеху»: where the Brevi bot posts new orders. */
export function WorkshopSettingsPage() {
  const page = useWorkshopSettings();
  const busy = page.saving || page.testing;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Швейний цех"
        title="Налаштування цеху"
        subtitle="Куди бот Brevi надсилає нові виробничі завдання"
        actions={
          <>
            <Button
              variant="outlined"
              startIcon={<SendOutlinedIcon />}
              disabled={busy || !page.canTest || page.dirty}
              onClick={() => void page.sendTest()}
            >
              Надіслати перевірку
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              disabled={busy || !page.dirty}
              onClick={() => void page.save()}
            >
              Зберегти
            </Button>
          </>
        }
      />
      <ReferenceListAlerts
        error={page.error}
        loading={page.loading}
        onRetry={() => void page.reload()}
        actionMessage={page.message}
        onCloseActionMessage={page.clearMessage}
      />
      {page.settings && page.values ? (
        <Paper variant="outlined" sx={{ p: 2, maxWidth: 640 }}>
          <Stack sx={{ gap: 2 }}>
            <ReferenceFormSection title="Telegram">
              <WorkshopSettingsForm
                values={page.values}
                chats={page.settings.chats}
                botConfigured={page.settings.botConfigured}
                errors={page.errors}
                disabled={busy}
                onChange={page.change}
              />
            </ReferenceFormSection>
            {page.settings.updatedAt && (
              <Typography variant="caption" color="text.secondary">
                Змінено {formatProductionDate(page.settings.updatedAt)}
                {page.settings.updatedByName ? ` · ${page.settings.updatedByName}` : ''}
              </Typography>
            )}
          </Stack>
        </Paper>
      ) : (
        !page.error && (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
            <CircularProgress aria-label="Відкриваємо налаштування" />
          </Box>
        )
      )}
    </Box>
  );
}

export default WorkshopSettingsPage;
