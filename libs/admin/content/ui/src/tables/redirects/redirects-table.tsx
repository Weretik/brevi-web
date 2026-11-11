import { redirectSourceLabel } from '@admin/content/model';
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

import type { SiteRedirect } from '@admin/content/model';

interface Props {
  /** Redirects by the old address. */
  rows: readonly SiteRedirect[];
  loading: boolean;
  /** Search or filter is on: an empty list means «nothing found». */
  narrowed: boolean;
  unavailable: boolean;
  onOpen: (row: SiteRedirect) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontSize: 13 };
const columns = 4;

/** «Контент → Переадресації»: old address → page of the new site, with who made it. */
export function RedirectsTable({ rows, loading, narrowed, unavailable, onOpen }: Props) {
  const empty = unavailable
    ? 'Список недоступний. Повторіть запит.'
    : narrowed
      ? 'Переадресацій за цим запитом не знайдено.'
      : 'Переадресацій ще немає. Перенесіть адреси старого сайту або додайте першу.';

  return (
    <Box sx={{ minWidth: 0 }}>
      {loading && <LinearProgress aria-label="Завантаження переадресацій" />}
      <TableContainer
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          maxHeight: 'var(--admin-table-height)',
          overflow: 'auto',
        }}
      >
        <Table
          size="small"
          stickyHeader
          aria-label="Переадресації сайту"
          sx={{ minWidth: 760, '& td, & th': { px: 1.25 } }}
        >
          <TableHead sx={{ '& th': { bgcolor: 'background.paper' } }}>
            <TableRow>
              <TableCell>Стара адреса</TableCell>
              <TableCell>Нова сторінка</TableCell>
              <TableCell>Звідки</TableCell>
              <TableCell>Примітка</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={columns}>
                  <Stack sx={{ py: 4, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {empty}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} hover onClick={() => onOpen(row)} sx={{ cursor: 'pointer' }}>
                  <TableCell sx={{ ...mono, maxWidth: 320, wordBreak: 'break-all' }}>
                    {row.fromPath}
                  </TableCell>
                  <TableCell sx={{ ...mono, maxWidth: 320, wordBreak: 'break-all' }}>
                    {row.toPath}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {redirectSourceLabel(row.source)}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 260 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      title={row.note ?? ''}
                    >
                      {row.note}
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
