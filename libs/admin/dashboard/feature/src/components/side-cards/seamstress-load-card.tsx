import { Avatar, Box, Card, LinearProgress, Stack, Typography } from '@mui/material';

import { highSeamstressLoad } from '../../model/dashboard-demo';
import { numericTextSx } from '../../model/numeric-text';

import type { SeamstressLoad } from '../../model/dashboard-demo';

interface SeamstressLoadCardProps {
  loads: readonly SeamstressLoad[];
}

export function SeamstressLoadCard({ loads }: SeamstressLoadCardProps) {
  return (
    <Card aria-labelledby="seamstress-load-title" component="section" sx={{ p: 2 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography component="h2" id="seamstress-load-title" variant="h6">
          Швеї сьогодні
        </Typography>
        <Typography color="text.secondary" variant="caption">
          {loads.length} з 6
        </Typography>
      </Stack>
      <Stack component="ul" sx={{ m: 0, p: 0 }}>
        {loads.map((person) => (
          <Box
            component="li"
            key={person.name}
            sx={{
              alignItems: 'center',
              display: 'flex',
              fontSize: 13,
              gap: 1.25,
              listStyle: 'none',
              py: 1,
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'action.hover',
                color: 'text.primary',
                fontSize: 11,
                fontWeight: 700,
                height: 28,
                width: 28,
              }}
            >
              {person.initials}
            </Avatar>
            <Box component="span" sx={{ flex: 'none', width: 96 }}>
              {person.name}
            </Box>
            <LinearProgress
              aria-label={`Завантаження ${person.name}`}
              color={person.load >= highSeamstressLoad ? 'primary' : 'inherit'}
              sx={{
                bgcolor: 'action.hover',
                borderRadius: 3,
                color: 'text.secondary',
                flex: 1,
                height: 6,
              }}
              value={person.load}
              variant="determinate"
            />
            <Box component="span" sx={{ ...numericTextSx, textAlign: 'right', width: 38 }}>
              {person.load}%
            </Box>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
