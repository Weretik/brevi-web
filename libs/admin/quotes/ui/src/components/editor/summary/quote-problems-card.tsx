import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { Card, Link, Stack, Typography } from '@mui/material';

import type { QuoteDraftProblem } from '@admin/quotes/model';

interface Props {
  problems: readonly QuoteDraftProblem[];
  onGo: (target: string) => void;
}

/** «Перед надсиланням»: only what is wrong, each a link to its place. Nothing when all is fine. */
export function QuoteProblemsCard({ problems, onGo }: Props) {
  if (problems.length === 0) return null;
  return (
    <Card
      variant="outlined"
      sx={{ p: 2, bgcolor: 'warning.light', borderColor: 'warning.main' }}
      aria-label="Перед надсиланням"
    >
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
        <WarningAmberOutlinedIcon fontSize="small" sx={{ color: 'warning.main' }} />
        <Typography variant="subtitle2" component="h2" sx={{ fontWeight: 700 }}>
          Перед надсиланням: {problems.length}
        </Typography>
      </Stack>
      <Stack component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mt: 1, gap: 0.75 }}>
        {problems.map((problem) => (
          <li key={`${problem.target}:${problem.text}`}>
            <Link
              component="button"
              type="button"
              variant="body2"
              color="primary.dark"
              onClick={() => onGo(problem.target)}
              sx={{ textAlign: 'left' }}
            >
              {problem.text}
            </Link>
          </li>
        ))}
      </Stack>
    </Card>
  );
}
