import { formatLeadMoment } from '@admin/leads/model';
import { Alert, Box, Typography } from '@mui/material';

import { LeadStatsCard } from './lead-stats-card';
import { mono } from '../mono';

import type { LeadSyncState } from '@admin/leads/model';
import type { ReactNode } from 'react';

interface Props {
  sync: LeadSyncState | null;
  /** «Синхронізувати зараз», only with the right to it. */
  action?: ReactNode;
}

/** The Google Sheet «Лиды Brevi»: when it was read and, only on a problem, what went wrong. */
export function LeadSyncCard({ sync, action }: Props) {
  return (
    <LeadStatsCard title="Таблиця «Лиды Brevi»" action={action}>
      <Box sx={{ px: 2, py: 1.5, display: 'grid', gap: 1 }}>
        {sync?.error && (
          <Alert severity="error">Остання синхронізація не вдалася: {sync.error}</Alert>
        )}
        {!sync?.error && sync?.warning && <Alert severity="warning">{sync.warning}</Alert>}
        <Typography variant="body2">
          {sync?.lastSuccessAt ? (
            <>
              Оновлено{' '}
              <Box component="span" sx={mono}>
                {formatLeadMoment(sync.lastSuccessAt)}
              </Box>
              , рядків у таблиці:{' '}
              <Box component="span" sx={mono}>
                {sync.rows}
              </Box>
            </>
          ) : (
            'Таблицю ще не синхронізували'
          )}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Синхронізація йде щоранку в будні о 09:00 разом з іншими даними. Записи менеджерів із
          таблиці перенесено при першій синхронізації, далі результати дзвінків ведуться тут.
        </Typography>
      </Box>
    </LeadStatsCard>
  );
}
