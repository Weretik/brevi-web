import { siteCategoryName, siteCategoryProblems } from '@admin/content/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import SubdirectoryArrowRightOutlinedIcon from '@mui/icons-material/SubdirectoryArrowRightOutlined';
import {
  Box,
  IconButton,
  LinearProgress,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

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

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
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
                const name = siteCategoryName(row);
                const parent = row.parentId === null ? null : (byId.get(row.parentId) ?? null);
                const problems = siteCategoryProblems(row, parent);
                const around = neighbours(row);
                const place = around.indexOf(row);
                const busy = savingId === row.id;
                const child = row.parentId !== null;
                return (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => onOpen(row)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell sx={{ minWidth: 260, maxWidth: 420 }}>
                      <Stack
                        direction="row"
                        sx={{ alignItems: 'center', gap: 1, pl: child ? 3 : 0 }}
                      >
                        {child && (
                          <SubdirectoryArrowRightOutlinedIcon
                            fontSize="small"
                            sx={{ color: 'text.disabled' }}
                          />
                        )}
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            noWrap
                            title={name}
                            sx={{ fontWeight: child ? 400 : 600 }}
                          >
                            {name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={mono}
                            noWrap
                            component="div"
                          >
                            /catalog/{row.slug}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell align="right" sx={mono}>
                      {row.productCount}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 320 }}>
                      {problems.length > 0 && (
                        <Typography variant="body2" sx={{ color: 'warning.dark' }}>
                          {problems.join(' · ')}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ whiteSpace: 'nowrap' }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <IconButton
                        size="small"
                        aria-label={`Вище: ${name}`}
                        disabled={!canEdit || narrowed || busy || place === 0}
                        onClick={() => onMove(row, -1)}
                      >
                        <ArrowUpwardOutlinedIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label={`Нижче: ${name}`}
                        disabled={!canEdit || narrowed || busy || place === around.length - 1}
                        onClick={() => onMove(row, 1)}
                      >
                        <ArrowDownwardOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center" onClick={(event) => event.stopPropagation()}>
                      <Switch
                        checked={row.showOnSite}
                        disabled={!canEdit || busy}
                        onChange={(event) => onToggle(row, event.target.checked)}
                        slotProps={{ input: { 'aria-label': `Показувати на сайті: ${name}` } }}
                      />
                    </TableCell>
                    <TableCell align="right" onClick={(event) => event.stopPropagation()}>
                      {canCreate && !child && (
                        <Tooltip title="Додати підрозділ">
                          <IconButton
                            size="small"
                            aria-label={`Додати підрозділ: ${name}`}
                            onClick={() => onAddChild(row)}
                          >
                            <AddOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
