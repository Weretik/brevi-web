import { useGetSiteCompanyQuery } from '@admin/content/data-access';
import { SiteCompanyView } from '@admin/content/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { adminApiErrorMessage } from '@admin/shared/api-client';
import { Alert, Box, Button, Paper } from '@mui/material';
import { useState } from 'react';

import { SiteCompanyDrawer } from './site-company-drawer';

import type { SiteCompanyViewer } from '@admin/content/model';

/**
 * «Контент → Контакти та компанія»: the company phone, email, address, hours, client managers, payment details
 * and profile links the site shows. Read view first; «Редагувати» opens the side panel.
 */
export function SiteCompanyContent({ viewer }: { viewer: SiteCompanyViewer }) {
  const query = useGetSiteCompanyQuery();
  const company = query.currentData;
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        title="Контакти та компанія"
        actions={
          viewer.canEdit && company ? (
            <Button variant="contained" onClick={() => setEditing(true)}>
              Редагувати
            </Button>
          ) : null
        }
        subtitle="Телефон, пошта, адреса, графік, менеджери, реквізити й соцмережі, які показує сайт. Пошукові системи теж беруть їх звідси."
      />
      {notice && (
        <Alert severity="success" onClose={() => setNotice(null)} sx={{ mb: 2 }}>
          {notice}
        </Alert>
      )}
      <ReferenceListAlerts
        error={
          query.error ? adminApiErrorMessage(query.error, 'Не вдалося завантажити контакти.') : null
        }
        loading={query.isLoading}
        onRetry={() => void query.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {company && (
        <Paper variant="outlined" sx={{ p: 2.5, maxWidth: 820 }}>
          <SiteCompanyView company={company} />
        </Paper>
      )}
      {editing && company && (
        <SiteCompanyDrawer
          key={company.revision}
          company={company}
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
