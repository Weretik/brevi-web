import { Box, Stack, Typography } from '@mui/material';

import { bankLineParty, bankLineProblems } from './bank-line-party';
import { FinanceProblemPill } from '../../../components/status/finance-problem-pill';

import type { BankStatementLine } from '@admin/accounting/model';

const twoLines = { py: 0.5, lineHeight: 1.3, minWidth: 0 } as const;
const clipped = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as const;

/** The counterparty of a line, its purpose or error, and its problem marks. */
export function BankLinePurposeCell({ row }: { row: BankStatementLine }) {
  const party = bankLineParty(row);
  const problems = bankLineProblems(row);
  return (
    <Stack sx={twoLines}>
      <Stack direction="row" sx={{ gap: 1, alignItems: 'center', minWidth: 0 }}>
        <Box component="span" sx={{ fontWeight: 600, ...clipped }}>
          {party.name}
        </Box>
        {party.caption && (
          <Typography variant="caption" color="text.secondary" sx={clipped}>
            {party.caption}
          </Typography>
        )}
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={clipped}>
        {row.error || row.description || row.purpose || '—'}
      </Typography>
      {problems.length > 0 && (
        <Stack direction="row" sx={{ gap: 0.5, flexWrap: 'wrap', pt: 0.25 }}>
          {problems.map((problem) => (
            <FinanceProblemPill key={problem} label={problem} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
