import { Box, Paper, Stack, Typography } from '@mui/material';

import type { GarmentAccessoryFormValues } from '@admin/references/model';

interface Props {
  values: GarmentAccessoryFormValues;
}

export function GarmentAccessoryDetails({ values }: Props) {
  return (
    <Stack sx={{ gap: 2 }}>
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography component="h3" variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Основні дані
        </Typography>
        <Stack sx={{ gap: 2.5 }}>
          <Box>
            <Typography color="text.secondary" variant="caption">
              ID
            </Typography>
            <Typography>{values.id}</Typography>
          </Box>
          <Box>
            <Typography color="text.secondary" variant="caption">
              Назва
            </Typography>
            <Typography>{values.name}</Typography>
          </Box>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography component="h3" variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
          Закупівля
        </Typography>
        <Stack sx={{ gap: 2.5 }}>
          <Box>
            <Typography color="text.secondary" variant="caption">
              Постачальник
            </Typography>
            <Typography>{values.supplierName}</Typography>
          </Box>
          <Box>
            <Typography color="text.secondary" variant="caption">
              Ціна
            </Typography>
            <Typography>{values.price} грн</Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
