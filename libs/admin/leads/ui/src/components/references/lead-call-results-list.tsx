import { leadOutcomeHint, leadOutcomeLabels } from '@admin/leads/model';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, IconButton, Typography } from '@mui/material';

import type { LeadCallResult } from '@admin/leads/model';

interface Props {
  results: readonly LeadCallResult[];
  /** Without the edit right the list is read-only. */
  onEdit?: (result: LeadCallResult) => void;
}

/** «Результати дзвінка» of «Довідники»: what a manager picks after a call and what it does. */
export function LeadCallResultsList({ results, onEdit }: Props) {
  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {results.map((result) => (
        <Box
          component="li"
          key={result.id}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            px: 2,
            py: 1,
            borderBottom: 1,
            borderColor: 'divider',
            minHeight: 44,
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: result.isActive ? 'text.primary' : 'text.secondary' }}
            >
              {result.name}
              {!result.isActive && ' · прихований'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {leadOutcomeLabels[result.outcome]} ·{' '}
              {leadOutcomeHint(result.outcome, result.retryDays)}
            </Typography>
          </Box>
          {onEdit && (
            <IconButton
              size="small"
              aria-label={`Редагувати «${result.name}»`}
              onClick={() => onEdit(result)}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}
    </Box>
  );
}
