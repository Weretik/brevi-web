import { quoteSettingsSections } from '@admin/quotes/model';
import { Box, ButtonBase, Stack, Typography } from '@mui/material';

import { quoteSettingsProblemsLabel } from '../form/quote-settings-layout';

import type { QuoteSettingsSectionId } from '@admin/quotes/model';

interface Props {
  active: QuoteSettingsSectionId;
  changed: readonly QuoteSettingsSectionId[];
  errorCounts: Partial<Record<QuoteSettingsSectionId, number>>;
  /** `row` on narrow screens: the sections scroll sideways above the form. */
  layout: 'column' | 'row';
  onSelect: (id: QuoteSettingsSectionId) => void;
}

/** «Розділи»: jumps to a section and shows only where something changed or is wrong. */
export function QuoteSettingsNav({ active, changed, errorCounts, layout, onSelect }: Props) {
  const column = layout === 'column';
  return (
    <Box component="nav" aria-label="Розділи налаштувань">
      {column && (
        <Typography
          variant="overline"
          color="text.secondary"
          sx={{ display: 'block', fontWeight: 600, px: 1.5, mb: 0.5 }}
        >
          Розділи
        </Typography>
      )}
      <Stack
        component="ul"
        direction={column ? 'column' : 'row'}
        sx={{
          listStyle: 'none',
          m: 0,
          p: 0,
          gap: 0.5,
          ...(!column && { overflowX: 'auto', pb: 0.5 }),
        }}
      >
        {quoteSettingsSections.map((section) => {
          const current = section.id === active;
          const problems = errorCounts[section.id] ?? 0;
          const isChanged = changed.includes(section.id);
          return (
            <Box component="li" key={section.id} sx={{ flexShrink: 0 }}>
              <ButtonBase
                onClick={() => onSelect(section.id)}
                aria-current={current ? 'location' : undefined}
                sx={{
                  width: column ? '100%' : 'auto',
                  minHeight: 40,
                  px: 1.5,
                  gap: 1,
                  justifyContent: 'space-between',
                  borderRadius: 1,
                  border: 1,
                  borderColor: current ? 'divider' : 'transparent',
                  bgcolor: current ? 'background.paper' : 'transparent',
                  boxShadow: current && column ? 'inset 3px 0 0 #FD9600' : 'none',
                  fontWeight: current ? 700 : 500,
                  color: current ? 'text.primary' : 'text.secondary',
                  textAlign: 'left',
                  '&:hover': { bgcolor: 'background.paper' },
                }}
              >
                <span>{section.title}</span>
                {problems > 0 ? (
                  <Typography
                    component="span"
                    variant="caption"
                    sx={{ color: 'error.main', fontWeight: 600, whiteSpace: 'nowrap' }}
                  >
                    {quoteSettingsProblemsLabel(problems)}
                  </Typography>
                ) : isChanged ? (
                  <Box
                    component="span"
                    role="img"
                    aria-label="є зміни"
                    sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }}
                  />
                ) : null}
              </ButtonBase>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
