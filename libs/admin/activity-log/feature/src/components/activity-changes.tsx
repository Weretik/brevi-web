import { Box, Typography } from '@mui/material';

import type { ActivityChange } from '@admin/activity-log/model';

interface Props {
  changes: readonly ActivityChange[];
  /** How many changes to show; the rest become «ще N». All when not set. */
  limit?: number;
}

const empty = '—';

/** «Поле: було → стало» per changed field (R-01, R-03); an empty value is «—». */
export function ActivityChanges({ changes, limit }: Props) {
  const shown = limit === undefined ? changes : changes.slice(0, limit);
  const rest = changes.length - shown.length;
  return (
    <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', minWidth: 0 }}>
      {shown.map((change, index) => (
        <Typography key={`${change.field}-${index}`} component="li" variant="body2">
          <Box component="span" sx={{ color: 'text.secondary' }}>
            {change.field}:
          </Box>{' '}
          <Box component="span" sx={{ textDecoration: change.from ? 'line-through' : undefined }}>
            {change.from ?? empty}
          </Box>{' '}
          → {change.to ?? empty}
        </Typography>
      ))}
      {rest > 0 && (
        <Typography component="li" variant="caption" color="text.secondary">
          ще {rest}
        </Typography>
      )}
    </Box>
  );
}
