import { LeadsTable } from '@admin/leads/ui';
import { ReferenceFilterChip, ReferenceFilterRow, ReferenceSearchBar } from '@admin/references/ui';
import { Alert, Button } from '@mui/material';

import type { useAllLeads } from '../../hooks/all/use-all-leads';
import type { LeadScope } from '@admin/leads/model';

interface Props {
  list: ReturnType<typeof useAllLeads>;
  onOpen: (id: number) => void;
}

const scopes: readonly { scope: LeadScope; label: string; count: 'mine' | 'free' | 'all' }[] = [
  { scope: 'Free', label: 'Вільні', count: 'free' },
  { scope: 'Mine', label: 'Мої', count: 'mine' },
  { scope: 'All', label: 'Усі', count: 'all' },
];

/** «Усі ліди»: free leads to take, own leads, everything. */
export function AllLeadsTab({ list, onOpen }: Props) {
  const page = list.page;
  return (
    <>
      <ReferenceSearchBar
        label="Пошук ліда"
        placeholder="Підприємство, регіон, галузь, № з таблиці…"
        value={list.search}
        onChange={list.setSearch}
      />
      <ReferenceFilterRow
        filters={scopes.map((item) => (
          <ReferenceFilterChip
            key={item.scope}
            label={item.label}
            count={page?.[item.count]}
            selected={list.scope === item.scope}
            onClick={() => list.setScope(item.scope)}
          />
        ))}
        count={page?.total ?? 0}
        total={page?.total ?? 0}
        countLabel="Кількість лідів"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
      {list.error && (
        <Alert
          severity="error"
          sx={{ mb: 1.5 }}
          action={
            <Button color="inherit" onClick={list.retry}>
              Повторити
            </Button>
          }
        >
          {list.error}
        </Alert>
      )}
      <LeadsTable
        rows={page?.items ?? []}
        rowCount={page?.total ?? 0}
        loading={list.loading}
        narrowed={list.narrowed || list.scope !== 'All'}
        paginationModel={list.pagination}
        onPaginationModelChange={list.setPagination}
        onOpen={onOpen}
      />
    </>
  );
}
