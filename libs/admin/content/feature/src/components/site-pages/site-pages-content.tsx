import { useGetSitePagesQuery } from '@admin/content/data-access';
import { SitePagesTable } from '@admin/content/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Box, Paper } from '@mui/material';
import { useState } from 'react';

import { SitePageDrawer } from './site-page-drawer';

import type { SitePage, SitePagesViewer } from '@admin/content/model';

const noRows: SitePage[] = [];

/**
 * «Контент → Сторінки сайту»: the search title and description of each fixed page of the site in Ukrainian and
 * Russian. Products, categories and articles keep their SEO in their own sections.
 */
export function SitePagesContent({ viewer }: { viewer: SitePagesViewer }) {
  const list = useGetSitePagesQuery();
  const rows = list.currentData ?? noRows;
  const [openedKey, setOpenedKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const opened = rows.find((row) => row.key === openedKey) ?? null;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Сторінки сайту"
        actions={null}
        subtitle="Заголовки й описи постійних сторінок сайту в пошуку Google і Bing. SEO товарів, розділів і статей задається в їхніх розділах."
      />
      {notice && (
        <Alert severity="success" onClose={() => setNotice(null)} sx={{ mb: 2 }}>
          {notice}
        </Alert>
      )}
      <ReferenceListAlerts
        error={
          list.error ? adminApiErrorMessage(list.error, 'Не вдалося завантажити сторінки.') : null
        }
        loading={list.isLoading}
        onRetry={() => void list.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
        <SitePagesTable
          rows={rows}
          loading={list.isFetching}
          unavailable={Boolean(list.error)}
          onOpen={(row) => setOpenedKey(row.key)}
        />
      </Paper>
      {opened && (
        <SitePageDrawer
          key={`${opened.key}-${opened.revision}`}
          page={opened}
          viewer={viewer}
          onClose={() => setOpenedKey(null)}
          onDone={(text) => {
            setOpenedKey(null);
            setNotice(text);
          }}
        />
      )}
    </Box>
  );
}
