import {
  Box,
  Card,
  Chip,
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
import { formatAmount, quoteFilters } from '../../model/dashboard-demo';
import { numericTextSx } from '../../model/numeric-text';

import type { DemoQuote } from '../../model/dashboard-demo';

interface RecentQuotesCardProps {
  quotes: readonly DemoQuote[];
}

const headerCellSx = {
  color: 'text.secondary',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
} as const;

export function RecentQuotesCard({ quotes }: RecentQuotesCardProps) {
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
          Розрахунки та КП
        </Typography>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
          {quoteFilters.map((filter, index) => (
            <Chip
              color={index === 0 ? 'secondary' : 'default'}
              key={filter.label}
              label={`${filter.label} ${filter.count}`}
              size="small"
              variant={index === 0 ? 'filled' : 'outlined'}
            />
          ))}
          <Link
            component={RouterLink}
            sx={{ color: 'primary.dark', fontSize: 13, fontWeight: 700, ml: 1 }}
            to="/crm/quotes"
            underline="hover"
          >
            Усі КП
          </Link>
        </Stack>
      </Stack>
      <Box sx={{ mx: -2, overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerCellSx, pl: 2 }}>№</TableCell>
              <TableCell sx={headerCellSx}>Клієнт</TableCell>
              <TableCell sx={headerCellSx}>Виріб</TableCell>
              <TableCell align="right" sx={headerCellSx}>
                К-сть
              </TableCell>
              <TableCell align="right" sx={headerCellSx}>
                Сума, ₴
              </TableCell>
              <TableCell sx={{ ...headerCellSx, pr: 2 }}>Статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow
                hover
                key={quote.number}
                sx={{ '& td': { borderColor: 'divider', whiteSpace: 'nowrap' } }}
              >
                <TableCell sx={{ ...numericTextSx, pl: 2 }}>{quote.number}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{quote.client}</TableCell>
                <TableCell
                  sx={{ color: 'text.secondary', minWidth: 160, whiteSpace: 'normal !important' }}
                >
                  {quote.product}
                </TableCell>
                <TableCell align="right" sx={numericTextSx}>
                  {quote.quantity}
                </TableCell>
                <TableCell align="right" sx={numericTextSx}>
                  {formatAmount(quote.amount)}
                </TableCell>
                <TableCell sx={{ pr: 2 }}>
                  <QuoteStatusPill label={quote.status.label} tone={quote.status.tone} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}
