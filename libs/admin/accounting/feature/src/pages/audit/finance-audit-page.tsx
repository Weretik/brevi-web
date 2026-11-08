import {
  auditActionLabels,
  auditActions,
  auditEntities,
  auditEntityLabels,
} from '@admin/accounting/model';
import { FinanceAuditGrid } from '@admin/accounting/ui';
import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { Box, MenuItem, Paper, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import { FinanceAuditDrawer } from '../../components/audit/finance-audit-drawer';
import { useFinanceAudit } from '../../hooks/audit/use-finance-audit';

import type { AuditAction, AuditEntity, FinanceAuditEntry } from '@admin/accounting/model';

/** «Бухгалтерія → Журнал змін» (ACC-001 stage 8): every change of finance records, newest first. */
export function FinanceAuditPage() {
  const view = useFinanceAudit();
  const [open, setOpen] = useState<FinanceAuditEntry | null>(null);
  const pageSize = view.data?.pageSize ?? 50;

  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Бухгалтерія"
        title="Журнал змін"
        subtitle="Хто, коли й що змінив у рахунках, категоріях, операціях, переказах і контрагентах."
        actions={null}
      />
      <Stack sx={{ gap: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 2 }}>
          <TextField
            select
            label="Що"
            value={view.entity ?? ''}
            onChange={(event) => view.setEntity((event.target.value || null) as AuditEntity | null)}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">Усі записи</MenuItem>
            {auditEntities.map((entity) => (
              <MenuItem key={entity} value={entity}>
                {auditEntityLabels[entity]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Дія"
            value={view.action ?? ''}
            onChange={(event) => view.setAction((event.target.value || null) as AuditAction | null)}
            sx={{ minWidth: 260 }}
          >
            <MenuItem value="">Усі дії</MenuItem>
            {auditActions.map((action) => (
              <MenuItem key={action} value={action}>
                {auditActionLabels[action]}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <ReferenceListAlerts
          error={view.error}
          loading={view.loading}
          onRetry={view.retry}
          actionMessage={null}
          onCloseActionMessage={() => undefined}
        />
        <Paper variant="outlined" sx={{ minWidth: 0, overflow: 'hidden' }}>
          <FinanceAuditGrid
            rows={view.data?.items ?? []}
            rowCount={view.data?.total ?? 0}
            loading={view.loading}
            paginationModel={{ page: view.page - 1, pageSize }}
            onPaginationModelChange={(model) => view.setPage(model.page + 1)}
            onOpen={setOpen}
            emptyLabel={view.error ? 'Журнал недоступний. Повторіть запит.' : 'Змін поки немає'}
          />
        </Paper>
      </Stack>
      {open && <FinanceAuditDrawer key={open.id} entry={open} onClose={() => setOpen(null)} />}
    </Box>
  );
}

export default FinanceAuditPage;
