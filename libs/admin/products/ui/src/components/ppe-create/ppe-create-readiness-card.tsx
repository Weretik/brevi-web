import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Paper, Stack, Typography } from '@mui/material';

import { SewingCardStatusPill } from '../sewing-card/sewing-card-status-pill';

import type { PpeCreateReadinessItem } from '@admin/products/model';

interface Props {
  items: readonly PpeCreateReadinessItem[];
}

/** «Готовність»: the sheet instruction steps, ticked from the form as the user fills it. */
export function PpeCreateReadinessCard({ items }: Props) {
  const done = items.filter((item) => item.done).length;
  const requiredDone = items.every((item) => item.done || item.optional);
  return (
    <Paper variant="outlined" component="section" aria-label="Готовність" sx={{ p: 2 }}>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}
      >
        <Typography variant="h6" component="h2">
          Готовність
        </Typography>
        <SewingCardStatusPill
          label={`${done} з ${items.length}`}
          tone={requiredDone ? 'success' : 'warning'}
        />
      </Stack>
      <Stack component="ul" sx={{ m: 0, p: 0, listStyle: 'none', gap: 1 }}>
        {items.map((item) => (
          <Stack
            key={item.label}
            component="li"
            direction="row"
            sx={{ gap: 1, alignItems: 'center' }}
          >
            {item.done ? (
              <CheckCircleIcon
                fontSize="small"
                sx={{ color: 'success.main' }}
                titleAccess="Готово"
              />
            ) : (
              <RadioButtonUncheckedIcon
                fontSize="small"
                sx={{ color: 'text.disabled' }}
                titleAccess="Ще ні"
              />
            )}
            <Typography
              variant="body2"
              sx={{ color: item.done ? 'text.primary' : 'text.secondary' }}
            >
              {item.label}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}
