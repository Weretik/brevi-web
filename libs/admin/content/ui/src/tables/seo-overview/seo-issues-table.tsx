import { seoAreaLabels, seoProblemText } from '@admin/content/model';
import {
  Box,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { SeoIssue } from '@admin/content/model';

interface Props {
  rows: readonly SeoIssue[];
  loading: boolean;
  /** A filter is on, so an empty list does not mean the site has no problems. */
  narrowed: boolean;
  unavailable: boolean;
  onOpen: (row: SeoIssue) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontSize: 13 };

/** «Контент → SEO-огляд»: pages shown on the site with what they miss for search. */
export function SeoIssuesTable({ rows, loading, narrowed, unavailable, onOpen }: Props) {
  const empty = unavailable
    ? 'Список недоступний. Повторіть запит.'
    : narrowed
      ? 'За цим фільтром сторінок немає.'
      : 'Сторінок із проблемами немає.';
  return (
    <Box sx={{ minWidth: 0 }}>
      {loading && <LinearProgress aria-label="Завантаження SEO-огляду" />}
      <TableContainer sx={{ borderTop: 1, borderColor: 'divider', overflowX: 'auto' }}>
        <Table
          size="small"
          aria-label="Сторінки з проблемами SEO"
          sx={{ minWidth: 720, '& td, & th': { px: 1.25 } }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Сторінка</TableCell>
              <TableCell>Розділ</TableCell>
              <TableCell>Що виправити</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Stack sx={{ py: 4, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {empty}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={`${row.area}-${row.id}`}
                  hover
                  onClick={() => onOpen(row)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell sx={{ maxWidth: 360 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                      {row.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={mono} noWrap>
                      {row.path}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{seoAreaLabels[row.area]}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="warning.dark">
                      {row.problems.map(seoProblemText).join(' · ')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
