import { formatLeadDate, leadLinkLabel } from '@admin/leads/model';
import { Box, Link, Stack, Typography } from '@mui/material';

import { mono } from '../mono';

import type { LeadDetail } from '@admin/leads/model';
import type { ReactNode } from 'react';

interface Props {
  lead: LeadDetail;
  /** The side panel is narrow: one column instead of three. */
  narrow?: boolean;
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 1.5, minWidth: 0 }}>
      <Typography variant="overline" component="p" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" component="div" sx={{ mt: 0.5, overflowWrap: 'anywhere' }}>
        {children}
      </Typography>
    </Box>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Stack direction="row" sx={{ gap: 1.5, py: 0.75, borderTop: 1, borderColor: 'divider' }}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 150, flex: 'none' }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        component="div"
        sx={{ minWidth: 0, overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}
      >
        {children}
      </Typography>
    </Stack>
  );
}

/** What the AI found about the company: the three cells a call needs, then the rest of the sheet row. */
export function LeadInfo({ lead, narrow = false }: Props) {
  const signal = lead.signal || lead.signalDate || lead.signalUrl;
  return (
    <Stack sx={{ gap: 2 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: narrow ? '1fr' : 'repeat(3, minmax(0, 1fr))' },
          gap: 1.5,
        }}
      >
        <Cell label="Сигнал">
          {signal ? (
            <>
              {lead.signal}
              {lead.factOrPlan && ` (${lead.factOrPlan.toLowerCase()})`}
              {lead.signalDate && (
                <Box component="span" sx={mono}>
                  {' · '}
                  {formatLeadDate(lead.signalDate)}
                </Box>
              )}
              {lead.signalUrl && (
                <>
                  {' · '}
                  <Link href={lead.signalUrl} target="_blank" rel="noreferrer">
                    {leadLinkLabel(lead.signalUrl)}
                  </Link>
                </>
              )}
            </>
          ) : (
            '—'
          )}
        </Cell>
        <Cell label="Чому 50+ одиниць">{lead.volumeReason ?? '—'}</Cell>
        <Cell label="Запропонувати">{lead.offer ?? '—'}</Cell>
      </Box>
      <Box>
        {lead.whomToCall && <Row label="Кому дзвонити">{lead.whomToCall}</Row>}
        {lead.callReason && <Row label="Привід для дзвінка">{lead.callReason}</Row>}
        {lead.website && (
          <Row label="Сайт">
            <Link
              href={/^https?:/i.test(lead.website) ? lead.website : `https://${lead.website}`}
              target="_blank"
              rel="noreferrer"
            >
              {lead.website}
            </Link>
          </Row>
        )}
        {lead.tenderCheck && <Row label="Тендери">{lead.tenderCheck}</Row>}
        {lead.reliability && <Row label="Достовірність">{lead.reliability}</Row>}
        {lead.category && (
          <Row label="Категорія">
            {lead.category}
            {lead.categoryDescription && ` · ${lead.categoryDescription}`}
          </Row>
        )}
        {lead.addedOn && (
          <Row label="Додано в таблицю">
            <Box component="span" sx={mono}>
              {formatLeadDate(lead.addedOn)}
            </Box>
          </Row>
        )}
        {lead.sheetNotes && <Row label="З таблиці">{lead.sheetNotes}</Row>}
        {!lead.inSheet && <Row label="Таблиця">Рядок зник із таблиці, лід лишився тут</Row>}
      </Box>
    </Stack>
  );
}
