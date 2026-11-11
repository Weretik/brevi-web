import { articleDateLabel, articleProblems, articleTitle } from '@admin/content/model';
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
  TableRow,
  Typography,
} from '@mui/material';

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

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
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
              rows.map((row) => {
                const title = articleTitle(row);
                const problems = articleProblems(row);
                return (
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => onOpen(row)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell sx={{ minWidth: 300, maxWidth: 480 }}>
                      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
                        <Box
                          role="img"
                          aria-label={row.coverUrl ? `Обкладинка: ${title}` : 'Без обкладинки'}
                          sx={{
                            width: 64,
                            height: 44,
                            flexShrink: 0,
                            borderRadius: 1,
                            border: 1,
                            borderColor: 'divider',
                            bgcolor: 'action.hover',
                            backgroundImage: row.coverUrl ? `url("${row.coverUrl}")` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" noWrap title={title} sx={{ fontWeight: 600 }}>
                            {title}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={mono}
                            noWrap
                            component="div"
                          >
                            /articles/{row.slug}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ ...mono, whiteSpace: 'nowrap' }}>
                      {articleDateLabel(row.publishedOn)}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 320 }}>
                      {problems.length > 0 && (
                        <Typography variant="body2" sx={{ color: 'warning.dark' }}>
                          {problems.join(' · ')}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center" onClick={(event) => event.stopPropagation()}>
                      <Switch
                        checked={row.showOnSite}
                        disabled={!canEdit || savingId === row.id}
                        onChange={(event) => onToggle(row, event.target.checked)}
                        slotProps={{ input: { 'aria-label': `Показувати на сайті: ${title}` } }}
                      />
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
