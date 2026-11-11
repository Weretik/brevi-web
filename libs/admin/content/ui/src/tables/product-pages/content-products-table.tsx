import {
  contentProductPageSizes,
  contentProductProblems,
  contentProductTypeLabel,
} from '@admin/content/model';
import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import {
  Box,
  LinearProgress,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

import type { ContentProductPage, ContentProductRow } from '@admin/content/model';

interface Props {
  page: ContentProductPage | undefined;
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

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
const columns = 6;
const formatDate = (value: string) =>
  new Date(value).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' });

function Photo({ url }: { url: string | null }) {
  const frame = {
    width: 44,
    height: 44,
    borderRadius: 1,
    border: 1,
    borderColor: 'divider',
    bgcolor: 'background.paper',
  };
  return url ? (
    <Box component="img" src={url} alt="" loading="lazy" sx={{ ...frame, objectFit: 'contain' }} />
  ) : (
    <Box sx={{ ...frame, display: 'grid', placeItems: 'center', color: 'text.disabled' }}>
      <ImageNotSupportedOutlinedIcon fontSize="small" />
    </Box>
  );
}

/**
 * «Контент → Товари»: every product of «Товари» with the «На сайті» switch and what its page still
 * misses. Only problems are marked; a row opens the side panel.
 */
export function ContentProductsTable({
  page,
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
              items.map((row) => {
                const problems = contentProductProblems(row);
                return (
                  <TableRow
                    key={row.productId}
                    hover
                    onClick={() => onOpen(row)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Photo url={row.mainPhotoUrl} />
                    </TableCell>
                    <TableCell sx={{ minWidth: 220, maxWidth: 360 }}>
                      <Typography variant="body2" noWrap title={row.name}>
                        {row.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={mono}
                        noWrap
                        component="div"
                      >
                        {[row.code, row.slug ? `/product/${row.slug}` : null]
                          .filter(Boolean)
                          .join(' · ') || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="body2">{row.sectionName ?? '—'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {contentProductTypeLabel(row.type)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 320 }}>
                      {problems.length > 0 && (
                        <Typography variant="body2" sx={{ color: 'warning.dark' }}>
                          {problems.join(' · ')}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="body2" color="text.secondary" sx={mono}>
                        {row.updatedAtUtc ? formatDate(row.updatedAtUtc) : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" onClick={(event) => event.stopPropagation()}>
                      <Switch
                        checked={row.showOnSite}
                        disabled={!canEdit || savingId === row.productId}
                        onChange={(event) => onToggle(row, event.target.checked)}
                        slotProps={{
                          input: { 'aria-label': `Показувати на сайті: ${row.name}` },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
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
