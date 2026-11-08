import { leadScript } from '@admin/leads/model';
import { Box, Stack, Typography } from '@mui/material';

import { LeadContactList } from '../contacts/lead-contact-list';
import { mono } from '../mono';
import { LeadStagePill } from '../status/lead-stage-pill';

import type { LeadDetail } from '@admin/leads/model';

/** Top of the «Мій день» card: who we call, the call button and «Що сказати». */
export function LeadCallHeader({ lead }: { lead: LeadDetail }) {
  const place = [lead.region, lead.industry, lead.scale].filter(Boolean).join(' · ');
  return (
    <Stack sx={{ gap: 2.25 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{ justifyContent: 'space-between', gap: 1.5 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" component="p" color="text.secondary">
            Зараз дзвонимо · лід{' '}
            <Box component="span" sx={mono}>
              № {lead.sourceId}
            </Box>
            {lead.category && ` · категорія ${lead.category}`}
          </Typography>
          <Typography variant="h2" component="h2" sx={{ fontSize: 28, mt: 0.75, mb: 0.25 }}>
            {lead.company}
          </Typography>
          <Stack direction="row" sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            {place && (
              <Typography variant="body2" color="text.secondary">
                {place}
              </Typography>
            )}
            {(lead.isOverdue || lead.stage !== 'InWork') && (
              <LeadStagePill stage={lead.stage} overdue={lead.isOverdue} />
            )}
          </Stack>
        </Box>
        <Box sx={{ flex: 'none', maxWidth: { md: '50%' } }}>
          <LeadContactList lead={lead} callFirst />
        </Box>
      </Stack>
      <Box sx={{ bgcolor: 'grey.900', color: 'grey.100', borderRadius: 2, px: 2.5, py: 2.25 }}>
        <Typography variant="overline" component="p" sx={{ color: 'grey.400' }}>
          Що сказати
        </Typography>
        <Typography sx={{ fontSize: 18, fontWeight: 600, lineHeight: 1.45, mt: 0.75 }}>
          «{leadScript(lead)}»
        </Typography>
        {lead.whomToCall && (
          <Typography variant="body2" sx={{ color: 'grey.400', mt: 1.25 }}>
            Просити: {lead.whomToCall}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}
