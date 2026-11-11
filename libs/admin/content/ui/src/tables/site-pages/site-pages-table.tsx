import { sitePageProblems } from '@admin/content/model';
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

import type { SitePage } from '@admin/content/model';

interface Props {
  rows: readonly SitePage[];
  loading: boolean;
  unavailable: boolean;
  onOpen: (row: SitePage) => void;
}

const mono = { fontFamily: 'var(--admin-font-mono)', fontSize: 13 };

/** «Контент → Сторінки сайту»: the fixed pages with their search title; only problems are marked. */
export function SitePagesTable({ rows, loading, unavailable, onOpen }: Props) {
  return (
    <Box sx={{ minWidth: 0 }}>
      {loading && <LinearProgress aria-label="Завантаження сторінок" />}
      <TableContainer sx={{ borderTop: 1, borderColor: 'divider', overflowX: 'auto' }}>
        <Table
          size="small"
          aria-label="Сторінки сайту"
          sx={{ minWidth: 720, '& td, & th': { px: 1.25 } }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Сторінка</TableCell>
              <TableCell>Адреса</TableCell>
              <TableCell>Заголовок у пошуку</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Stack sx={{ py: 4, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {unavailable ? 'Список недоступний. Повторіть запит.' : 'Сторінок немає.'}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const problems = sitePageProblems(row);
                return (
                  <TableRow
                    key={row.key}
                    hover
                    onClick={() => onOpen(row)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{row.name}</TableCell>
                    <TableCell sx={mono}>{row.path}</TableCell>
                    <TableCell sx={{ maxWidth: 480 }}>
                      <Typography variant="body2" noWrap>
                        {row.texts.uk.title ?? 'Текст сайту'}
                      </Typography>
                      {problems.length > 0 && (
                        <Typography variant="caption" color="warning.dark">
                          {problems.join(' · ')}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
