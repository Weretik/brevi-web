import { countFabricNorms } from '@admin/production/model';
import { FabricNormFilterChips, FabricNormModelList } from '@admin/production/ui';
import { ReferenceFilterRow, ReferenceSearchBar } from '@admin/references/ui';
import { Box } from '@mui/material';

import type { useFabricNormsPage } from '../../hooks/norms/use-fabric-norms-page';

interface Props {
  page: ReturnType<typeof useFabricNormsPage>;
}

/** The left column of the norms page: search, filter chips and the list of models. */
export function FabricNormModelColumn({ page }: Props) {
  const { rows, search, setSearch, filter, setFilter, filtered, selected, loading, select } = page;
  return (
    <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <ReferenceSearchBar
        placeholder="Модель або MOD"
        label="Пошук моделей"
        value={search}
        onChange={setSearch}
      />
      <ReferenceFilterRow
        filters={
          <FabricNormFilterChips
            total={rows.length}
            counts={countFabricNorms(rows)}
            value={filter}
            onChange={setFilter}
          />
        }
        count={filtered.length}
        total={rows.length}
        countLabel="Кількість моделей"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
      <FabricNormModelList
        rows={filtered}
        selectedCode={selected?.modelCode ?? null}
        loading={loading}
        emptyLabel={
          rows.length === 0 ? 'Швейних моделей у «Товари» поки немає.' : 'Моделей не знайдено.'
        }
        onSelect={select}
      />
    </Box>
  );
}
