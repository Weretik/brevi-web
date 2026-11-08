import { formatLeadMoment } from '@admin/leads/model';
import { Box, Stack, Typography } from '@mui/material';

import { mono } from '../mono';

import type { LeadCall } from '@admin/leads/model';

/** Calls of a lead, newest first, as the server sends them. */
export function LeadCallHistory({ calls }: { calls: readonly LeadCall[] }) {
  return (
    <Box>
      <Typography variant="subtitle2" component="h3" color="text.secondary" sx={{ mb: 1 }}>
        Історія дзвінків
      </Typography>
      {calls.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Ще не дзвонили
        </Typography>
      ) : (
        <Stack component="ol" sx={{ m: 0, p: 0, listStyle: 'none' }}>
          {calls.map((call) => (
            <Box
              component="li"
              key={call.id}
              sx={{ py: 1, borderTop: 1, borderColor: 'divider', display: 'grid', gap: 0.25 }}
            >
              <Stack direction="row" sx={{ gap: 1, flexWrap: 'wrap', alignItems: 'baseline' }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {call.resultName}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={mono}>
                  {formatLeadMoment(call.at)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {call.by.name}
                </Typography>
              </Stack>
              {call.comment && (
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {call.comment}
                </Typography>
              )}
              {call.nextContactAt && (
                <Typography variant="caption" color="text.secondary">
                  Наступний контакт:{' '}
                  <Box component="span" sx={mono}>
                    {formatLeadMoment(call.nextContactAt)}
                  </Box>
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
