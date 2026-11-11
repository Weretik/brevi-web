import { Box, Card, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { numericTextSx } from '../../model/numeric-text';

import type { HardwareList } from '../../model/stock-shortages';

interface HardwareOrderCardProps {
  list: HardwareList;
}

/** «Фурнітура до замовлення» for the orders in work, the largest needs first. */
export function HardwareOrderCard({ list }: HardwareOrderCardProps) {
  return (
    <Card aria-labelledby="hardware-order-title" component="section" sx={{ minWidth: 0, p: 2 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography component="h2" id="hardware-order-title" variant="h6">
          Фурнітура до замовлення
        </Typography>
        <Link
          component={RouterLink}
          sx={{ fontSize: 13, fontWeight: 700 }}
          to="/warehouse/hardware"
          underline="hover"
        >
          Увесь список
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
            <Box component="span" sx={{ ...numericTextSx, flex: 'none', fontSize: 13 }}>
              {row.quantity}
            </Box>
          </Stack>
        ))}
      </Stack>
      {list.more > 0 && (
        <Typography color="text.secondary" component="p" sx={{ mt: 1 }} variant="caption">
          І ще {list.more} — у звіті «Фурнітура до замовлення».
        </Typography>
      )}
    </Card>
  );
}
