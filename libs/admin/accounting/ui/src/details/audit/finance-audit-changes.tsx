import { auditActionLabels, auditEntityLabels, financeAuditChanges } from '@admin/accounting/model';
import { ReferenceFormSection } from '@admin/references/ui';
import { Box, Stack, Typography } from '@mui/material';

import { formatAuditMoment } from '../../tables/audit/finance-audit-grid';

import type { FinanceAuditEntry } from '@admin/accounting/model';

const cell = { py: 0.75, borderBottom: 1, borderColor: 'divider', verticalAlign: 'top' } as const;

/** One «Журнал змін» entry: who, when, and each field that changed with its old and new value. */
export function FinanceAuditChanges({ entry }: { entry: FinanceAuditEntry }) {
  const changes = financeAuditChanges(entry);
  return (
    <Stack sx={{ gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {auditEntityLabels[entry.entity]} · {auditActionLabels[entry.action]} ·{' '}
        {formatAuditMoment(entry.at)} · {entry.by}
      </Typography>
      <ReferenceFormSection title="Що змінилося">
        {changes.length ? (
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <Box component="thead">
              <Box component="tr">
                {['Поле', 'Було', 'Стало'].map((head) => (
                  <Box
                    key={head}
                    component="th"
                    sx={{ ...cell, textAlign: 'left', color: 'text.secondary', fontWeight: 500 }}
                  >
                    {head}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {changes.map((change) => (
                <Box key={change.field} component="tr">
                  <Box component="td" sx={{ ...cell, pr: 2, color: 'text.secondary' }}>
                    {change.field}
                  </Box>
                  <Box component="td" sx={{ ...cell, pr: 2, wordBreak: 'break-word' }}>
                    {change.before}
                  </Box>
                  <Box component="td" sx={{ ...cell, wordBreak: 'break-word', fontWeight: 500 }}>
                    {change.after}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Видимі поля не змінилися.
          </Typography>
        )}
      </ReferenceFormSection>
    </Stack>
  );
}
