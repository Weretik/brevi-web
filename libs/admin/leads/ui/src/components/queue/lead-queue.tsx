import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Box, Button, LinearProgress, Paper, Typography } from '@mui/material';

import { LeadQueueItem as Item } from './lead-queue-item';
import { mono } from '../status/mono';

import type { LeadMyDay } from '@admin/leads/model';

interface Props {
  day: LeadMyDay;
  currentId: number | null;
  now: Date;
  onSelect: (id: number) => void;
  /** Opens «Усі ліди» on the free leads. */
  onFindMore: () => void;
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
