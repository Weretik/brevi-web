import { siteRequestStatusLabels, siteRequestStatusTones } from '@admin/leads/model';
import { Box } from '@mui/material';

import type { SiteRequestStatus } from '@admin/leads/model';

/** «Цех» status pill: dot, soft background, always a text label. */
export function SiteRequestStatusPill({ status }: { status: SiteRequestStatus }) {
  const tone = siteRequestStatusTones[status];
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.75,
        height: 24,
        px: 1,
        borderRadius: 999,
        typography: 'caption',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        bgcolor: tone === 'default' ? 'action.hover' : `${tone}.light`,
        color: tone === 'default' ? 'text.secondary' : `${tone}.main`,
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }}
      />
      {siteRequestStatusLabels[status]}
    </Box>
  );
}
