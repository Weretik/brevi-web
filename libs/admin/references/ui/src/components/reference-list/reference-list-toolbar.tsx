import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
  Button,
  Chip,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { ReferenceActivityCounts, ReferenceActivityFilter } from '@admin/references/model';

interface Props {
  searchPlaceholder: string;
  /** Accessible name of the search field, e.g. «Пошук тканин». */
  searchLabel: string;
  /** Accessible name of the counter, e.g. «Кількість тканин». */
  countLabel: string;
  activityLabels: Record<ReferenceActivityFilter, string>;
  search: string;
  onSearchChange: (value: string) => void;
  activity: ReferenceActivityFilter;
  activityCounts: ReferenceActivityCounts;
  onActivityChange: (value: ReferenceActivityFilter) => void;
  count: number;
  total: number;
  selectedCount: number;
  loading: boolean;
  deleting: boolean;
  onReload: () => void;
  onDelete: () => void;
}

const activityOrder: ReferenceActivityFilter[] = ['active', 'inactive', 'all'];

/** «Цех» list toolbar: search, activity chips with counts, counter, reload and bulk delete. */
export function ReferenceListToolbar({
  searchPlaceholder,
  searchLabel,
  countLabel,
  activityLabels,
  search,
  onSearchChange,
  activity,
  activityCounts,
  onActivityChange,
  count,
  total,
  selectedCount,
  loading,
  deleting,
  onReload,
  onDelete,
}: Props) {
  return (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      sx={{ p: 2, gap: 2, alignItems: { lg: 'center' } }}
    >
      <TextField
        size="small"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        sx={{ width: { xs: '100%', lg: 420 }, maxWidth: '100%' }}
        slotProps={{
          htmlInput: { 'aria-label': searchLabel },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="Очистити пошук"
                  sx={{ width: 40, height: 40 }}
                  onClick={() => onSearchChange('')}
                >
                  <ClearOutlinedIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
      />
      <Stack
        direction="row"
        role="group"
        aria-label="Фільтр за активністю"
        sx={{ gap: 1, flexWrap: 'wrap' }}
      >
        {activityOrder.map((value) => (
          <Chip
            key={value}
            label={`${activityLabels[value]} ${activityCounts[value]}`}
            color={activity === value ? 'secondary' : 'default'}
            variant={activity === value ? 'filled' : 'outlined'}
            aria-pressed={activity === value}
            onClick={() => onActivityChange(value)}
            sx={{ height: 28, borderRadius: '6px' }}
          />
        ))}
      </Stack>
      <Stack
        direction="row"
        sx={{ gap: 1, alignItems: 'center', flexWrap: 'wrap', ml: { lg: 'auto' } }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          role="status"
          aria-label={countLabel}
          sx={{ mr: 1, fontVariantNumeric: 'tabular-nums' }}
        >
          {count === total ? `Усього: ${total}` : `Знайдено: ${count} із ${total}`}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshOutlinedIcon />}
          disabled={loading}
          onClick={onReload}
        >
          Оновити
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          disabled={!selectedCount || deleting || loading}
          onClick={onDelete}
          sx={{ '&:not(.Mui-disabled)': { color: 'error.main' } }}
        >
          Видалити вибрані ({selectedCount})
        </Button>
      </Stack>
    </Stack>
  );
}
