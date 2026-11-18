import { articleDateLabel, articleProblems, articleTitle } from '@admin/content/model';
import { Box, Stack, Switch, TableCell, TableRow, Typography } from '@mui/material';

import type { ArticleRow } from '@admin/content/model';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** One article: the cover with the title and address, the date, what the site misses, and «На сайті». */
export function ArticleTableRow({
  row,
  canEdit,
  saving,
  onOpen,
  onToggle,
}: {
  row: ArticleRow;
  canEdit: boolean;
  saving: boolean;
  onOpen: (row: ArticleRow) => void;
  onToggle: (row: ArticleRow, showOnSite: boolean) => void;
}) {
  const title = articleTitle(row);
  const problems = articleProblems(row);
  return (
    <TableRow hover onClick={() => onOpen(row)} sx={{ cursor: 'pointer' }}>
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
            <Typography variant="caption" color="text.secondary" sx={mono} noWrap component="div">
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
          disabled={!canEdit || saving}
          onChange={(event) => onToggle(row, event.target.checked)}
          slotProps={{ input: { 'aria-label': `Показувати на сайті: ${title}` } }}
        />
      </TableCell>
    </TableRow>
  );
}
