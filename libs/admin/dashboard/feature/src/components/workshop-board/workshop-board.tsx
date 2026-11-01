import { Box, Card, Chip, Stack, Typography } from '@mui/material';

import { WorkshopOrderCard } from './workshop-order-card';
import { numericTextSx } from '../../model/numeric-text';

import type { WorkshopStage } from '../../model/dashboard-demo';

interface WorkshopBoardProps {
  stages: readonly WorkshopStage[];
}

const stageDotColor: Record<WorkshopStage['tone'], string> = {
  neutral: 'text.disabled',
  primary: 'primary.main',
  secondary: 'info.main',
  info: 'warning.main',
  success: 'success.main',
};

/** Workshop orders grouped by production stage (kanban). */
export function WorkshopBoard({ stages }: WorkshopBoardProps) {
  return (
    <Card component="section" aria-labelledby="workshop-board-title" sx={{ p: 2 }}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <Typography component="h2" id="workshop-board-title" variant="h6">
          Дошка цеху
        </Typography>
        <Stack direction="row" spacing={0.75}>
          <Chip color="secondary" label="Усі" size="small" />
          <Chip label="Мої" size="small" variant="outlined" />
          <Chip label="Термінові" size="small" variant="outlined" />
        </Stack>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: `repeat(${stages.length}, minmax(200px, 1fr))`,
          overflowX: 'auto',
          pb: 0.5,
        }}
      >
        {stages.map((stage) => (
          <Box
            aria-label={stage.label}
            component="section"
            key={stage.id}
            sx={{
              bgcolor: 'action.hover',
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              p: 1.25,
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                pb: 1.25,
                px: 0.5,
              }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  fontSize: 12.5,
                  fontWeight: 700,
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    bgcolor: stageDotColor[stage.tone],
                    borderRadius: '50%',
                    height: 8,
                    width: 8,
                  }}
                />
                {stage.label}
              </Box>
              <Box
                sx={{
                  ...numericTextSx,
                  bgcolor: 'background.paper',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 999,
                  fontSize: 11,
                  px: 1,
                }}
              >
                {stage.orders.length}
              </Box>
            </Box>
            <Stack component="ul" spacing={1} sx={{ m: 0, p: 0 }}>
              {stage.orders.map((order) => (
                <WorkshopOrderCard key={order.number} order={order} />
              ))}
            </Stack>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
