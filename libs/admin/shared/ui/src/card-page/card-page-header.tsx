import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Box, Link, Stack, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface Props {
  /** «Контрагенти › Клієнти»: where the back link leads. */
  backLabel: string;
  onBack: () => void;
  /** «Клієнт» or «Постачальник». */
  kind: string;
  title: string;
  /** Short facts under the name (legal name, code, contact). */
  facts?: readonly (string | null | undefined)[];
  /** A state chip next to the name, for example «Не використовується». */
  badge?: ReactNode;
  /** Secondary actions `outlined`, then one `contained` primary action. */
  actions?: ReactNode;
}

/** The header of a client or supplier card (CARD-001): back link, name, facts and actions. */
export function CardPageHeader({ backLabel, onBack, kind, title, facts, badge, actions }: Props) {
  const line = (facts ?? []).filter((fact): fact is string => !!fact?.trim()).join(' · ');
  return (
    <Stack spacing={1.5}>
      <Link
        component="button"
        type="button"
        underline="hover"
        onClick={onBack}
        sx={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          color: 'text.secondary',
          typography: 'body2',
        }}
      >
        <ArrowBackOutlinedIcon fontSize="small" />
        {backLabel}
      </Link>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ gap: 2, alignItems: { md: 'flex-end' }, justifyContent: 'space-between' }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" color="text.secondary" component="p">
            {kind}
          </Typography>
          <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="h4" component="h1" sx={{ overflowWrap: 'anywhere' }}>
              {title}
            </Typography>
            {badge}
          </Stack>
          {line && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {line}
            </Typography>
          )}
        </Box>
        {actions && (
          <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', flexShrink: 0 }}>
            {actions}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
