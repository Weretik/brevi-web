import { Box, Card, Stack, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface Props {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
}

/** A numbered step of «КП для знайомства». */
export function QuoteIntroStep({ step, title, description, children }: Props) {
  return (
    <Card variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'flex-start', mb: 1.5 }}>
        <Box
          aria-hidden
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {step}
        </Box>
        <Box>
          <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
      </Stack>
      {children}
    </Card>
  );
}
