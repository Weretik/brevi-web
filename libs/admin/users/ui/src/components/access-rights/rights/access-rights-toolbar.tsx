import { ReferenceFilterChip, ReferenceSearchBar } from '@admin/references/ui';
import { Button, Stack } from '@mui/material';

import type { AccessPageFilter } from '@admin/users/model';

interface AccessRightsToolbarProps {
  search: string;
  filter: AccessPageFilter;
  counts: Readonly<Record<AccessPageFilter, number>>;
  allCollapsed: boolean;
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: AccessPageFilter) => void;
  onToggleAll: () => void;
}

const filters: readonly { value: AccessPageFilter; label: string }[] = [
  { value: 'all', label: 'Усі' },
  { value: 'granted', label: 'Видані' },
  { value: 'changed', label: 'Змінені' },
];

/** Search by page or group, «Усі · Видані · Змінені», and folding every group at once. */
export function AccessRightsToolbar({
  allCollapsed,
  counts,
  filter,
  onFilterChange,
  onSearchChange,
  onToggleAll,
  search,
}: AccessRightsToolbarProps) {
  return (
    <div>
      <ReferenceSearchBar
        label="Пошук сторінки"
        onChange={onSearchChange}
        placeholder="Знайти сторінку: «склад», «КП»…"
        value={search}
      />
      <Stack
        direction="row"
        sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}
      >
        <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
          {filters.map((item) => (
            <ReferenceFilterChip
              count={counts[item.value]}
              key={item.value}
              label={item.label}
              onClick={() => onFilterChange(item.value)}
              selected={filter === item.value}
            />
          ))}
        </Stack>
        <Button onClick={onToggleAll} size="small">
          {allCollapsed ? 'Розгорнути все' : 'Згорнути все'}
        </Button>
      </Stack>
    </div>
  );
}
