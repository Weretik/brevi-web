import { useGetSiteSeoSettingsQuery } from '@admin/content/data-access';
import { SeoSettingsView } from '@admin/content/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Box, Button, Paper } from '@mui/material';
import { useState } from 'react';

import { SeoSettingsDrawer } from './seo-settings-drawer';

import type { SeoSettingsViewer } from '@admin/content/model';

/**
 * «Контент → Налаштування SEO сайту»: Google Analytics, Tag Manager, the Search Console and Bing
 * verification codes and the sharing picture the site places on every page. Read view first;
 * «Редагувати» opens the side panel.
 */
export function SeoSettingsContent({ viewer }: { viewer: SeoSettingsViewer }) {
  const query = useGetSiteSeoSettingsQuery();
  const settings = query.currentData;
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Налаштування SEO сайту"
        actions={
          viewer.canEdit && settings ? (
            <Button variant="contained" onClick={() => setEditing(true)}>
              Редагувати
            </Button>
          ) : null
        }
        subtitle="Коди аналітики та підтвердження сайту в Google і Bing, а також фото для поширення посилань. Підключення сервісів робить SEO-фахівець, тут лише вставляються його коди."
      />
      {notice && (
        <Alert severity="success" onClose={() => setNotice(null)} sx={{ mb: 2 }}>
          {notice}
        </Alert>
      )}
      <ReferenceListAlerts
        error={
          query.error
            ? adminApiErrorMessage(query.error, 'Не вдалося завантажити налаштування SEO.')
            : null
        }
        loading={query.isLoading}
        onRetry={() => void query.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {settings && (
        <Paper variant="outlined" sx={{ p: 2.5, maxWidth: 720 }}>
          <SeoSettingsView settings={settings} />
        </Paper>
      )}
      {editing && settings && (
        <SeoSettingsDrawer
          settings={settings}
          onClose={() => setEditing(false)}
          onDone={(text) => {
            setEditing(false);
            setNotice(text);
          }}
        />
      )}
    </Box>
  );
}
