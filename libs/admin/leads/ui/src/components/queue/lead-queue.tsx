import { formatLeadNext } from '@admin/leads/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, LinearProgress, Paper, Typography } from '@mui/material';

import { mono } from '../mono';

import type { LeadMyDay, LeadSummary } from '@admin/leads/model';

interface Props {
  day: LeadMyDay;
  currentId: number | null;
  now: Date;
  onSelect: (id: number) => void;
  /** Opens «Усі ліди» on the free leads. */
  onFindMore: () => void;
}

function hint(lead: LeadSummary): string {
  if (lead.lastResultName) return `${lead.lastResultName} · ${lead.callCount}-й дзвінок`;
  return lead.category ? `Новий · категорія ${lead.category}` : 'Новий';
}

function Item({
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

/** «Мій день» aside: progress of the day, today's queue, then what is planned later. */
export function LeadQueue({ day, currentId, now, onSelect, onFindMore }: Props) {
  const progress = day.plannedToday ? Math.round((day.callsToday / day.plannedToday) * 100) : 0;
  return (
    <Paper
      variant="outlined"
      component="aside"
      aria-label="План на сьогодні"
      sx={{ overflow: 'hidden' }}
    >
      <Box sx={{ p: 1.75, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="overline" component="p" color="text.secondary">
          Прогрес дня
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75, my: 0.75 }}>
          <Typography sx={{ ...mono, fontSize: 28, fontWeight: 600 }}>{day.callsToday}</Typography>
          <Typography variant="body2" color="text.secondary">
            з {day.plannedToday} дзвінків
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          aria-label="Прогрес дня"
          sx={{ height: 6, borderRadius: 999 }}
        />
      </Box>
      <Typography
        variant="overline"
        component="h2"
        color="text.secondary"
        sx={{ px: 1.75, pt: 1.5, pb: 0.5 }}
      >
        Черга · {day.queue.length}
      </Typography>
      {day.queue.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 1.75, pb: 1.5 }}>
          На сьогодні дзвінків немає
        </Typography>
      ) : (
        day.queue.map((lead) => (
          <Item
            key={lead.id}
            lead={lead}
            now={now}
            current={lead.id === currentId}
            onSelect={onSelect}
          />
        ))
      )}
      {day.later.length > 0 && (
        <>
          <Typography
            variant="overline"
            component="h2"
            color="text.secondary"
            sx={{ px: 1.75, pt: 1.5, pb: 0.5 }}
          >
            Пізніше · {day.later.length}
          </Typography>
          {day.later.slice(0, 8).map((lead) => (
            <Item
              key={lead.id}
              lead={lead}
              now={now}
              current={lead.id === currentId}
              onSelect={onSelect}
            />
          ))}
        </>
      )}
      <Box sx={{ p: 1.5 }}>
        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          startIcon={<AddOutlinedIcon />}
          disabled={day.free === 0}
          onClick={onFindMore}
          sx={{ height: 40 }}
        >
          {day.free ? `Набрати вільних · ${day.free}` : 'Вільних лідів немає'}
        </Button>
      </Box>
    </Paper>
  );
}
