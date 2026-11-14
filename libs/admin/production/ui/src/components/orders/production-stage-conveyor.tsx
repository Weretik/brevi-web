import { productionStageLabels } from '@admin/production/model';
import { Box, ButtonBase, Typography } from '@mui/material';

import type { ProductionStage, ProductionStageCount } from '@admin/production/model';

interface Props {
  stages: readonly ProductionStageCount[];
  selected: ProductionStage | null;
  onSelect: (stage: ProductionStage | null) => void;
}

/**
 * «Конвеєр етапів»: how many «Нове» orders stand at each stage of the workshop, with the overdue ones in red. A
 * stage is a filter of the list; a second press removes it. «Завершено» shows only when an open order reached it.
 */
export function ProductionStageConveyor({ stages, selected, onSelect }: Props) {
  const shown = stages.filter((x) => x.stage !== 'Complete' || x.count > 0 || selected === x.stage);
  if (shown.length === 0) return null;
  return (
    <Box
      role="group"
      aria-label="Етапи цеху"
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          sm: 'repeat(4, minmax(0, 1fr))',
          lg: `repeat(${shown.length}, minmax(0, 1fr))`,
        },
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        mb: 1.5,
      }}
    >
      {shown.map((item) => {
        const on = selected === item.stage;
        return (
          <ButtonBase
            key={item.stage}
            aria-pressed={on}
            aria-label={`${productionStageLabels[item.stage]}: ${item.count}${
              item.overdue ? `, прострочено ${item.overdue}` : ''
            }`}
            onClick={() => onSelect(on ? null : item.stage)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 0.5,
              px: 1.5,
              py: 1,
              textAlign: 'left',
              position: 'relative',
              borderRight: 1,
              borderBottom: { xs: 1, lg: 0 },
              borderColor: 'divider',
              bgcolor: on ? 'primary.light' : 'transparent',
              transition: (theme) => theme.transitions.create('background-color'),
              '&:hover': { bgcolor: on ? 'primary.light' : 'action.hover' },
              '&.Mui-focusVisible': { outline: 2, outlineColor: 'primary.main', outlineOffset: -2 },
              '&::after': on
                ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 3,
                    bgcolor: 'primary.main',
                  }
                : undefined,
            }}
          >
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
              sx={{ lineHeight: 1.25, minHeight: 30 }}
            >
              {productionStageLabels[item.stage]}
            </Typography>
            <Box component="span" sx={{ display: 'flex', alignItems: 'baseline', gap: 0.75 }}>
              <Typography
                component="span"
                sx={{
                  fontFamily: 'var(--admin-font-mono)',
                  fontWeight: 600,
                  fontSize: 20,
                  lineHeight: 1.2,
                  color: item.count === 0 ? 'text.disabled' : 'text.primary',
                }}
              >
                {item.count}
              </Typography>
              {item.overdue > 0 && (
                <Typography
                  component="span"
                  variant="caption"
                  color="error.main"
                  sx={{ fontWeight: 600 }}
                >
                  {item.overdue} простр.
                </Typography>
              )}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}
