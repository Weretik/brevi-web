import { Card, Chip, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import type { ShortageList } from '../../model/stock-shortages';

interface FabricShortageCardProps {
  list: ShortageList;
}

/** «Не вистачає тканини»: only fabric to order or below zero; nothing to show when all is covered. */
export function FabricShortageCard({ list }: FabricShortageCardProps) {
  return (
    <Card aria-labelledby="fabric-shortage-title" component="section" sx={{ minWidth: 0, p: 2 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography component="h2" id="fabric-shortage-title" variant="h6">
          Не вистачає тканини
        </Typography>
        <Link
          component={RouterLink}
          sx={{ fontSize: 13, fontWeight: 700 }}
          to="/warehouse/booking"
          underline="hover"
        >
          Бронь і що замовити
        </Link>
      </Stack>
      <Stack component="ul" sx={{ m: 0, p: 0 }}>
        {list.rows.map((row) => (
          <Stack
            component="li"
            direction="row"
            key={row.key}
            sx={{
              alignItems: 'center',
              borderBottom: 1,
              borderColor: 'divider',
              gap: 1,
              justifyContent: 'space-between',
              listStyle: 'none',
              py: 0.75,
              '&:last-of-type': { borderBottom: 0 },
            }}
          >
            <Typography noWrap sx={{ minWidth: 0 }} variant="body2">
              {row.name}
            </Typography>
            <Chip color={row.tone} label={row.note} size="small" sx={{ flex: 'none' }} />
          </Stack>
        ))}
      </Stack>
      {list.more > 0 && (
        <Typography color="text.secondary" sx={{ mt: 1 }} variant="caption" component="p">
          І ще {list.more} — у звіті «Бронь і що замовити».
        </Typography>
      )}
    </Card>
  );
}
