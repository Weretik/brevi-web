import { leadOutcomeHint } from '@admin/leads/model';
import { Box, Button, Typography } from '@mui/material';

import type { LeadCallResult } from '@admin/leads/model';

const tones = { Client: 'success.main', Closed: 'error.main' } as const;

interface Props {
  results: readonly LeadCallResult[];
  selectedId: LeadCallResult['id'] | null | undefined;
  error?: string;
  disabled: boolean;
  onSelect: (id: LeadCallResult['id']) => void;
}

/** «Чим закінчився дзвінок?»: one button per result with what it means. */
export function LeadCallResultButtons({ results, selectedId, error, disabled, onSelect }: Props) {
  return (
    <Box component="fieldset" sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
      <Typography variant="overline" component="legend" color="text.secondary" sx={{ mb: 1 }}>
        Чим закінчився дзвінок?
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(4, minmax(0, 1fr))',
          },
          gap: 1,
        }}
      >
        {results.map((result) => {
          const active = result.id === selectedId;
          return (
            <Button
              key={result.id}
              type="button"
              variant="outlined"
              color="inherit"
              aria-pressed={active}
              disabled={disabled}
              onClick={() => onSelect(result.id)}
              sx={{
                minHeight: 56,
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                textAlign: 'left',
                textTransform: 'none',
                px: 1.75,
                borderColor: active ? 'primary.main' : 'divider',
                bgcolor: active ? 'primary.light' : 'background.paper',
                color:
                  result.outcome in tones
                    ? tones[result.outcome as keyof typeof tones]
                    : 'text.primary',
              }}
            >
              <Typography
                variant="body2"
                component="span"
                sx={{ fontWeight: 600, color: 'inherit' }}
              >
                {result.name}
              </Typography>
              <Typography variant="caption" component="span" color="text.secondary">
                {leadOutcomeHint(result.outcome, result.retryDays)}
              </Typography>
            </Button>
          );
        })}
      </Box>
      {error && (
        <Typography variant="caption" color="error" role="alert" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
