import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';

import { useOpenDesks } from '../../hooks/use-open-desks';
import { Desk } from '../desks/desk';

import type { DashboardViewer } from '../../model/desk-views/dashboard-view';
import type { DeskDefinition } from '../../model/desks/desks';

/** The main desk with every other desk folded under it; an unfolded desk is remembered and loads only when open. */
export function FoldedDesks({
  others,
  viewer,
}: {
  others: DeskDefinition[];
  viewer: DashboardViewer;
}) {
  const { isOpen, toggle } = useOpenDesks();
  return (
    <Stack spacing={2}>
      <Desk deskKey="main" viewer={viewer} />
      {others.map((desk) => (
        <Accordion
          disableGutters
          expanded={isOpen(desk.key)}
          key={desk.key}
          onChange={() => toggle(desk.key)}
          slotProps={{ transition: { unmountOnExit: true } }}
          variant="outlined"
        >
          <AccordionSummary
            aria-controls={`desk-panel-${desk.key}`}
            expandIcon={<ExpandMoreIcon />}
            id={`desk-fold-${desk.key}`}
          >
            <Typography component="h2" variant="h6">
              {desk.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails id={`desk-panel-${desk.key}`}>
            <Desk deskKey={desk.key} viewer={viewer} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  );
}
