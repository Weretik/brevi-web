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

import { ArticleTableRow } from './article-table-row';

import type { ArticleRow } from '@admin/content/model';

interface Props {
  /** Articles, the newest first. */
  rows: readonly ArticleRow[];
  loading: boolean;
  /** Search is on: an empty list means «nothing found». */
  narrowed: boolean;
  unavailable: boolean;
  canEdit: boolean;
  /** Article whose switch is being saved. */
  savingId: number | null;
  onOpen: (row: ArticleRow) => void;
  onToggle: (row: ArticleRow, showOnSite: boolean) => void;
}

const columns = 4;

/**
 * «Контент → Статті»: articles of the site with the cover, the date readers see and the «На сайті»
 * switch. Only problems are marked.
 */
export function ArticlesTable({
  rows,
  loading,
  narrowed,
  unavailable,
  canEdit,
  savingId,
  onOpen,
  onToggle,
}: Props) {
  const empty = unavailable
    ? 'Список недоступний. Повторіть запит.'
    : narrowed
      ? 'Статей за цим запитом не знайдено.'
      : 'Статей ще немає. Додайте першу.';

  return (
    <Box sx={{ minWidth: 0 }}>
      {loading && <LinearProgress aria-label="Завантаження статей" />}
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
          aria-label="Статті сайту"
          sx={{ minWidth: 760, '& td, & th': { px: 1.25 } }}
        >
          <TableHead sx={{ '& th': { bgcolor: 'background.paper' } }}>
            <TableRow>
              <TableCell>Стаття</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Чого бракує сайту</TableCell>
              <TableCell align="center">На сайті</TableCell>
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
                <ArticleTableRow
                  key={row.id}
                  row={row}
                  canEdit={canEdit}
                  saving={savingId === row.id}
                  onOpen={onOpen}
                  onToggle={onToggle}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
