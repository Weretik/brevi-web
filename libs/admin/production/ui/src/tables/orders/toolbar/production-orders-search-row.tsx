import { ReferenceSearchBar } from '@admin/references/ui';
import TuneIcon from '@mui/icons-material/Tune';
import { Badge, Button, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';

export type ProductionOrdersView = 'list' | 'summary';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  /** Filters set in the side panel, shown on the «Фільтри» badge. */
  filterCount: number;
  onOpenFilters: () => void;
  view: ProductionOrdersView;
  onViewChange: (view: ProductionOrdersView) => void;
}

/** «Виробничі завдання»: search, the «Фільтри» button and the «Список» / «Зведення за моделями» switch. */
export function ProductionOrdersSearchRow({
  search,
  onSearchChange,
  filterCount,
  onOpenFilters,
  view,
  onViewChange,
}: Props) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      sx={{ gap: 1, alignItems: { md: 'flex-start' }, '& > .MuiTextField-root': { mb: 0 } }}
    >
      <ReferenceSearchBar
        placeholder="Номер завдання або КП, клієнт, модель"
        label="Пошук завдань"
        value={search}
        onChange={onSearchChange}
      />
      <Stack direction="row" sx={{ gap: 1, flexShrink: 0 }}>
        <Badge badgeContent={filterCount} color="primary">
          <Button
            variant="outlined"
            startIcon={<TuneIcon />}
            aria-haspopup="dialog"
            onClick={onOpenFilters}
            sx={{ height: 48, bgcolor: 'background.paper' }}
          >
            Фільтри
          </Button>
        </Badge>
        <ToggleButtonGroup
          exclusive
          value={view}
          aria-label="Вигляд"
          onChange={(_event, next: ProductionOrdersView | null) => next && onViewChange(next)}
          sx={{ height: 48, bgcolor: 'background.paper' }}
        >
          <ToggleButton value="list">Список</ToggleButton>
          <ToggleButton value="summary">Зведення за моделями</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
}
