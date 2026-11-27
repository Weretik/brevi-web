import { countGrantedPages, filterAccessAreas } from '@admin/users/model';
import { useState } from 'react';

import type {
  AccessArea,
  AccessAreaGroup,
  AccessGrants,
  AccessPageFilter,
} from '@admin/users/model';
import type { AccessListView } from '@admin/users/ui';

interface Options {
  areas: readonly AccessArea[];
  groups: readonly AccessAreaGroup[];
  grants: AccessGrants;
  changed: ReadonlySet<string>;
}

/** Search, «Усі · Видані · Змінені», folded groups and «Порівняти ролі» of «Права доступу». */
export function useAccessListView({ areas, changed, grants, groups }: Options) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<AccessPageFilter>('all');
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());
  const [comparing, setComparing] = useState(false);

  const allCollapsed = groups.length > 0 && groups.every((group) => collapsed.has(group.title));

  const view: AccessListView = {
    search,
    filter,
    counts: { all: areas.length, granted: countGrantedPages(grants, areas), changed: changed.size },
    collapsed,
    allCollapsed,
    onSearchChange: setSearch,
    onFilterChange: setFilter,
    onToggleGroup: (title) =>
      setCollapsed((current) => {
        const next = new Set(current);
        if (next.has(title)) next.delete(title);
        else next.add(title);
        return next;
      }),
    onToggleAll: () =>
      setCollapsed(allCollapsed ? new Set() : new Set(groups.map((group) => group.title))),
  };

  /** Groups with the pages left after search, for «Порівняти ролі». */
  const searchedGroups = groups
    .map((group) => ({
      ...group,
      areas: filterAccessAreas(group.areas, { search, filter: 'all', grants, changed }),
    }))
    .filter((group) => group.areas.length > 0);

  return {
    view,
    comparing,
    searchedGroups,
    toggleComparing: () => setComparing((current) => !current),
    stopComparing: () => setComparing(false),
    /** «Показати зміни» in the save bar. */
    showChanges: () => {
      setComparing(false);
      setSearch('');
      setFilter('changed');
    },
  };
}
