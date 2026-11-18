import { siteCategoryName, siteCategoryProblems } from '@admin/content/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import SubdirectoryArrowRightOutlinedIcon from '@mui/icons-material/SubdirectoryArrowRightOutlined';
import {
  Box,
  IconButton,
  Stack,
  Switch,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

import type { SiteCategoryRow } from '@admin/content/model';

const mono = { fontFamily: 'var(--admin-font-mono)', fontVariantNumeric: 'tabular-nums' };

/** One category of the site tree: name and address, products, problems, the order arrows, «На сайті» and «Додати підрозділ». */
export function SiteCategoryTableRow({
  row,
  parent,
  first,
  last,
  narrowed,
  busy,
  canEdit,
  canCreate,
  onOpen,
  onToggle,
  onMove,
  onAddChild,
}: {
  row: SiteCategoryRow;
  parent: SiteCategoryRow | null;
  first: boolean;
  last: boolean;
  narrowed: boolean;
  busy: boolean;
  canEdit: boolean;
  canCreate: boolean;
  onOpen: (row: SiteCategoryRow) => void;
  onToggle: (row: SiteCategoryRow, showOnSite: boolean) => void;
  onMove: (row: SiteCategoryRow, step: -1 | 1) => void;
  onAddChild: (row: SiteCategoryRow) => void;
}) {
  const name = siteCategoryName(row);
  const problems = siteCategoryProblems(row, parent);
  const child = row.parentId !== null;
  return (
    <TableRow hover onClick={() => onOpen(row)} sx={{ cursor: 'pointer' }}>
      <TableCell sx={{ minWidth: 260, maxWidth: 420 }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1, pl: child ? 3 : 0 }}>
          {child && (
            <SubdirectoryArrowRightOutlinedIcon fontSize="small" sx={{ color: 'text.disabled' }} />
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap title={name} sx={{ fontWeight: child ? 400 : 600 }}>
              {name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={mono} noWrap component="div">
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
          disabled={!canEdit || narrowed || busy || first}
          onClick={() => onMove(row, -1)}
        >
          <ArrowUpwardOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          aria-label={`Нижче: ${name}`}
          disabled={!canEdit || narrowed || busy || last}
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
}
