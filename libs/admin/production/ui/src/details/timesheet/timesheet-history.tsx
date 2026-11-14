import { formatHours } from '@admin/production/model';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';

import type { TimesheetChange } from '@admin/production/model';

interface Props {
  changes: readonly TimesheetChange[];
}

const time = (value: string) =>
  new Date(value).toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' });

/** «Історія змін» of the hours of a day, newest first. */
export function TimesheetHistory({ changes }: Props) {
  if (changes.length === 0) return null;
  return (
    <Accordion variant="outlined" disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreOutlinedIcon />}>
        <Typography variant="subtitle2">Історія змін за день ({changes.length})</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack sx={{ gap: 0.75 }}>
          {[...changes].reverse().map((change) => (
            <Typography key={change.id} variant="body2">
              <strong>{change.employeeName}</strong>:{' '}
              {change.beforeMinutes === null
                ? 'перша відмітка'
                : `${formatHours(change.beforeMinutes)} →`}{' '}
              {formatHours(change.afterMinutes)} год
              <Typography variant="caption" color="text.secondary" component="span">
                {' '}
                · {time(change.changedAt)} · {change.changedByName}
              </Typography>
            </Typography>
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
