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

import { SiteCategoryTableRow } from './site-category-table-row';

import type { SiteCategoryRow } from '@admin/content/model';

interface Props {
  /** Rows in site order: every category followed by its subcategories. */
  rows: readonly SiteCategoryRow[];
  loading: boolean;
  /** Search is on: an empty list means «nothing found», and the order cannot be changed. */
  narrowed: boolean;
  unavailable: boolean;
  canCreate: boolean;
  canEdit: boolean;
  /** Category whose switch or place is being saved. */
  savingId: number | null;
  onOpen: (row: SiteCategoryRow) => void;
  onToggle: (row: SiteCategoryRow, showOnSite: boolean) => void;
  onMove: (row: SiteCategoryRow, step: -1 | 1) => void;
  onAddChild: (row: SiteCategoryRow) => void;
}

const columns = 6;

/**
 * «Контент → Розділи»: the category tree of the site. Subcategories sit under their category; the
 * arrows change the place among neighbours, the switch shows or hides. Only problems are marked.
 */
export function SiteCategoriesTable({
  rows,
  loading,
  narrowed,
  unavailable,
  canCreate,
  canEdit,
  savingId,
  onOpen,
  onToggle,
  onMove,
  onAddChild,
}: Props) {
  const byId = new Map(rows.map((row) => [row.id, row]));
  const neighbours = (row: SiteCategoryRow) =>
    rows.filter((item) => item.parentId === row.parentId);
  const empty = unavailable
    ? 'Список недоступний. Повторіть запит.'
    : narrowed
      ? 'Розділів за цим запитом не знайдено.'
      : 'Розділів сайту ще немає. Додайте перший.';

  return (
    <Box sx={{ minWidth: 0 }}>
      {loading && <LinearProgress aria-label="Завантаження розділів" />}
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
          aria-label="Розділи сайту"
          sx={{ minWidth: 860, '& td, & th': { px: 1.25 } }}
        >
          <TableHead sx={{ '& th': { bgcolor: 'background.paper' } }}>
            <TableRow>
              <TableCell>Розділ</TableCell>
              <TableCell align="right">Товарів</TableCell>
              <TableCell>Чого бракує сайту</TableCell>
              <TableCell align="center">Порядок</TableCell>
              <TableCell align="center">На сайті</TableCell>
              <TableCell />
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
              rows.map((row) => {
                const around = neighbours(row);
                const place = around.indexOf(row);
                return (
                  <SiteCategoryTableRow
                    key={row.id}
                    row={row}
                    parent={row.parentId === null ? null : (byId.get(row.parentId) ?? null)}
                    first={place === 0}
                    last={place === around.length - 1}
                    narrowed={narrowed}
                    busy={savingId === row.id}
                    canEdit={canEdit}
                    canCreate={canCreate}
                    onOpen={onOpen}
                    onToggle={onToggle}
                    onMove={onMove}
                    onAddChild={onAddChild}
                  />
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
