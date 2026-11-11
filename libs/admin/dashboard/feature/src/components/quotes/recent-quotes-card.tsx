import {
  Box,
  Card,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { QuoteStatusPill } from './quote-status-pill';
import { numericTextSx } from '../../model/numeric-text';

import type { RecentQuote } from '../../model/dashboard-view';

interface RecentQuotesCardProps {
  quotes: readonly RecentQuote[];
  title?: string;
}

const headerCellSx = {
  color: 'text.secondary',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
} as const;

/** The latest КП in work, newest first. */
export function RecentQuotesCard({ quotes, title = 'Останні КП' }: RecentQuotesCardProps) {
  return (
    <Card aria-labelledby="recent-quotes-title" component="section" sx={{ minWidth: 0, p: 2 }}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5,
          justifyContent: 'space-between',
          mb: 1.5,
        }}
      >
        <Typography component="h2" id="recent-quotes-title" variant="h6">
          {title}
        </Typography>
        <Link
          component={RouterLink}
          sx={{ color: 'primary.dark', fontSize: 13, fontWeight: 700 }}
          to="/crm/quotes"
          underline="hover"
        >
          Усі КП
        </Link>
      </Stack>
      {quotes.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          КП в роботі ще немає.
        </Typography>
      ) : (
        <Box sx={{ mx: -2, overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...headerCellSx, pl: 2 }}>№</TableCell>
                <TableCell sx={headerCellSx}>Клієнт</TableCell>
                <TableCell sx={headerCellSx}>Відповідальний</TableCell>
                <TableCell align="right" sx={headerCellSx}>
                  Позицій
                </TableCell>
                <TableCell sx={{ ...headerCellSx, pr: 2 }}>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quotes.map((quote) => (
                <TableRow
                  hover
                  key={quote.id}
                  sx={{ '& td': { borderColor: 'divider', whiteSpace: 'nowrap' } }}
                >
                  <TableCell sx={{ ...numericTextSx, pl: 2 }}>
                    <Link component={RouterLink} to={`/crm/quotes/${quote.id}`} underline="hover">
                      {quote.number}
                    </Link>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{quote.client}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{quote.responsible}</TableCell>
                  <TableCell align="right" sx={numericTextSx}>
                    {quote.items}
                  </TableCell>
                  <TableCell sx={{ pr: 2 }}>
                    <QuoteStatusPill label={quote.status.label} tone={quote.status.tone} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Card>
  );
}
