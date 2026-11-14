import { Box, Card, LinearProgress, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { numericTextSx } from '../../model/numeric-text';

import type { WeekHours } from '../../model/desk-views/dashboard-view';

interface WeekHoursCardProps {
  rows: readonly WeekHours[];
}

/** «Робочий час» of this week by worker, against a 40-hour week. */
export function WeekHoursCard({ rows }: WeekHoursCardProps) {
  return (
    <Card aria-labelledby="week-hours-title" component="section" sx={{ p: 2 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography component="h2" id="week-hours-title" variant="h6">
          Години цього тижня
        </Typography>
        <Link
          component={RouterLink}
          sx={{ fontSize: 13, fontWeight: 700 }}
          to="/production/people?tab=timesheet"
          underline="hover"
        >
          Робочий час
        </Link>
      </Stack>
      {rows.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          Працівників цеху ще немає.
        </Typography>
      ) : (
        <Stack component="ul" sx={{ m: 0, p: 0 }}>
          {rows.map((row) => (
            <Box
              component="li"
              key={row.name}
              sx={{
                alignItems: 'center',
                display: 'flex',
                fontSize: 13,
                gap: 1.25,
                listStyle: 'none',
                py: 0.75,
              }}
            >
              <Box
                component="span"
                sx={{ flex: 'none', overflow: 'hidden', textOverflow: 'ellipsis', width: 120 }}
              >
                {row.name}
              </Box>
              <LinearProgress
                aria-label={`Години ${row.name}`}
                color="inherit"
                sx={{
                  bgcolor: 'action.hover',
                  borderRadius: 3,
                  color: 'text.secondary',
                  flex: 1,
                  height: 6,
                }}
                value={row.load}
                variant="determinate"
              />
              <Box
                component="span"
                sx={{ ...numericTextSx, flex: 'none', textAlign: 'right', width: 56 }}
              >
                {row.hours} год
              </Box>
            </Box>
          ))}
        </Stack>
      )}
    </Card>
  );
}
