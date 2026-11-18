import { formatLeadNext } from '@admin/leads/model';
import { Box, Typography } from '@mui/material';

import { mono } from '../status/mono';

import type { LeadSummary } from '@admin/leads/model';

function hint(lead: LeadSummary): string {
  if (lead.lastResultName) return `${lead.lastResultName} · ${lead.callCount}-й дзвінок`;
  return lead.category ? `Новий · категорія ${lead.category}` : 'Новий';
}

/** One lead of the queue: when to call, the company and the last result. */
export function LeadQueueItem({
  lead,
  now,
  current,
  onSelect,
}: {
  lead: LeadSummary;
  now: Date;
  current: boolean;
  onSelect: (id: number) => void;
}) {
  return (
    <Box
      component="button"
      type="button"
      aria-current={current || undefined}
      onClick={() => onSelect(lead.id)}
      sx={{
        all: 'unset',
        boxSizing: 'border-box',
        width: '100%',
        cursor: 'pointer',
        display: 'grid',
        gridTemplateColumns: '92px minmax(0, 1fr)',
        gap: 1.25,
        px: 1.75,
        py: 1.25,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: current ? 'primary.light' : 'transparent',
        boxShadow: current ? (theme) => `inset 3px 0 0 ${theme.palette.primary.main}` : 'none',
        '&:hover': { bgcolor: current ? 'primary.light' : 'action.hover' },
        '&:focus-visible': { outline: 2, outlineColor: 'primary.main', outlineOffset: -2 },
      }}
    >
      <Typography
        variant="body2"
        sx={{ ...mono, color: lead.isOverdue ? 'error.main' : 'text.primary', fontSize: 12 }}
      >
        {lead.nextContactAt ? formatLeadNext(lead.nextContactAt, now) : '—'}
      </Typography>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>
          {lead.company}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap component="p">
          {hint(lead)}
        </Typography>
      </Box>
    </Box>
  );
}
