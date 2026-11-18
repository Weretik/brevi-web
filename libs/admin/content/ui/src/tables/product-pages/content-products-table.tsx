import { contentProductPageSizes } from '@admin/content/model';
import {
  Box,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

import { ContentProductTableRow } from './content-product-table-row';

import type { ContentProductPage, ContentProductRow, SiteCategoryRow } from '@admin/content/model';

interface Props {
  page: ContentProductPage | undefined;
  /** «Розділи сайту», to name the categories of each row; null without the right to see them. */
  categories?: readonly SiteCategoryRow[] | null;
  loading: boolean;
  /** Search or a filter is on: an empty page means «nothing found». */
  narrowed: boolean;
  unavailable: boolean;
  canEdit: boolean;
  /** Product whose switch is being saved. */
  savingId: number | null;
  /** Zero-based page, as the table counts. */
  onPageChange: (model: { page: number; pageSize: number }) => void;
  onOpen: (row: ContentProductRow) => void;
  onToggle: (row: ContentProductRow, showOnSite: boolean) => void;
}

const columns = 6;

/**
 * «Контент → Товари»: every product of «Товари» with the «На сайті» switch and what its page still
 * misses. Only problems are marked; a row opens the side panel.
 */
export function ContentProductsTable({
  page,
  categories = null,
  loading,
  narrowed,
  unavailable,
  canEdit,
  savingId,
  onPageChange,
  onOpen,
  onToggle,
}: Props) {
  const items = page?.items ?? [];
  const empty = unavailable
    ? 'Список недоступний. Повторіть запит.'
    : narrowed
      ? 'Товарів за цими умовами не знайдено.'
      : 'У «Товари» ще немає товарів.';

  return (
    <Box sx={{ minWidth: 0 }}>
      {loading && <LinearProgress aria-label="Завантаження товарів" />}
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
          aria-label="Товари сайту"
          sx={{ minWidth: 860, '& td, & th': { px: 1.25 } }}
        >
          <TableHead sx={{ '& th': { bgcolor: 'background.paper' } }}>
            <TableRow>
              <TableCell sx={{ width: 60 }}>Фото</TableCell>
              <TableCell>Товар</TableCell>
              <TableCell>Розділ</TableCell>
              <TableCell>Чого бракує сайту</TableCell>
              <TableCell>Змінено</TableCell>
              <TableCell align="center">На сайті</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length === 0 && !loading ? (
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
              items.map((row) => (
                <ContentProductTableRow
                  key={row.productId}
                  row={row}
                  categories={categories}
                  canEdit={canEdit}
                  saving={savingId === row.productId}
                  onOpen={onOpen}
                  onToggle={onToggle}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={page?.total ?? 0}
        page={Math.max(0, (page?.page ?? 1) - 1)}
        rowsPerPage={page?.pageSize ?? 50}
        rowsPerPageOptions={[...contentProductPageSizes]}
        labelRowsPerPage="Рядків на сторінці"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} з ${count}`}
        onPageChange={(_, next) => onPageChange({ page: next, pageSize: page?.pageSize ?? 50 })}
        onRowsPerPageChange={(event) =>
          onPageChange({ page: 0, pageSize: Number(event.target.value) })
        }
      />
    </Box>
  );
}
