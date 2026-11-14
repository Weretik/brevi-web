import { isPlanFactOverrun, planFactDeviation } from '@admin/warehouse/model';
import { Chip, Typography } from '@mui/material';

import { reportMono } from '../../../components/reports/expandable-row';

import type { PlanFactSummary } from '@admin/warehouse/model';

const percent = new Intl.NumberFormat('uk-UA', {
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
});

/** «+9,8%» red above the threshold; a mark when it cannot be compared; otherwise only the number. */
export function PlanFactDeviation({ summary }: { summary: PlanFactSummary }) {
  const deviation = planFactDeviation(summary);
  if (deviation === null)
    return (
      <Chip
        size="small"
        color="warning"
        variant="outlined"
        label={summary.planPerProduct === null ? 'Немає норми' : 'Не порівняти'}
      />
    );
  if (isPlanFactOverrun(summary))
    return (
      <Chip
        size="small"
        color="error"
        variant="outlined"
        label={`${percent.format(deviation)}%`}
        sx={reportMono}
      />
    );
  return (
    <Typography variant="body2" component="span" sx={reportMono}>
      {percent.format(deviation)}%
    </Typography>
  );
}
