import {
  contentProductProblems,
  contentProductTypeLabel,
  siteCategoryPath,
} from '@admin/content/model';
import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import { Box, Switch, TableCell, TableRow, Typography } from '@mui/material';

import type { ContentProductRow, SiteCategoryRow } from '@admin/content/model';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };
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

/** The site categories of a row, or null when it is in none or they cannot be named. */
function siteCategories(row: ContentProductRow, categories: readonly SiteCategoryRow[] | null) {
  if (!categories || row.categoryIds.length === 0) return null;
  const names = categories
    .filter((category) => row.categoryIds.includes(category.id))
    .map((category) => siteCategoryPath(category, categories));
  return names.length > 0 ? names.join(', ') : null;
}

/** One product of «Товари сайту»: photo, name and address, section, what is missing, the change time and «На сайті». */
export function ContentProductTableRow({
  row,
  categories,
  canEdit,
  saving,
  onOpen,
  onToggle,
}: {
  row: ContentProductRow;
  categories: readonly SiteCategoryRow[] | null;
  canEdit: boolean;
  saving: boolean;
  onOpen: (row: ContentProductRow) => void;
  onToggle: (row: ContentProductRow, showOnSite: boolean) => void;
}) {
  const problems = contentProductProblems(row);
  const inSite = siteCategories(row, categories);
  return (
    <TableRow hover onClick={() => onOpen(row)} sx={{ cursor: 'pointer' }}>
      <TableCell>
        <Photo url={row.mainPhotoUrl} />
      </TableCell>
      <TableCell sx={{ minWidth: 220, maxWidth: 360 }}>
        <Typography variant="body2" noWrap title={row.name}>
          {row.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={mono} noWrap component="div">
          {[row.code, row.slug ? `/product/${row.slug}` : null].filter(Boolean).join(' · ') || '—'}
        </Typography>
      </TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <Typography variant="body2">{row.sectionName ?? '—'}</Typography>
        <Typography variant="caption" color="text.secondary">
          {contentProductTypeLabel(row.type)}
        </Typography>
        {inSite && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Сайт: {inSite}
          </Typography>
        )}
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
          disabled={!canEdit || saving}
          onChange={(event) => onToggle(row, event.target.checked)}
          slotProps={{
            input: { 'aria-label': `Показувати на сайті: ${row.name}` },
          }}
        />
      </TableCell>
    </TableRow>
  );
}
