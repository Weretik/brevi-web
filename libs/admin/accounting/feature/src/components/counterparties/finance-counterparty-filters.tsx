import {
  financeCounterpartyTabCount,
  financeCounterpartyTabLabels,
  financeCounterpartyTabs,
} from '@admin/accounting/model';
import { ReferenceFilterChip, ReferenceFilterRow, ReferenceSearchBar } from '@admin/references/ui';

import type { useFinanceCounterpartyList } from '../../hooks/counterparties/use-finance-counterparty-list';

/** Search and the tab chips of «Контрагенти» with their counts, and «Показати архівні». */
export function FinanceCounterpartyFilters({
  list,
}: {
  list: ReturnType<typeof useFinanceCounterpartyList>;
}) {
  const page = list.page;
  const counts = page?.counts;
  return (
    <>
      <ReferenceSearchBar
        placeholder="Знайти за назвою, іншою назвою, ЄДРПОУ або IBAN"
        label="Пошук контрагентів"
        value={list.search}
        onChange={list.setSearch}
      />
      <ReferenceFilterRow
        filters={[
          ...financeCounterpartyTabs.map((tab) => (
            <ReferenceFilterChip
              key={tab}
              label={financeCounterpartyTabLabels[tab]}
              count={counts ? financeCounterpartyTabCount(counts, tab) : undefined}
              selected={list.tab === tab}
              onClick={() => list.setTab(tab)}
            />
          )),
          <ReferenceFilterChip
            key="archived"
            label="Показати архівні"
            selected={list.includeArchived}
            onClick={list.toggleArchived}
          />,
        ]}
        count={page?.total ?? 0}
        total={page?.total ?? 0}
        countLabel="Кількість контрагентів"
        selectedCount={0}
        onClearSelection={() => undefined}
      />
    </>
  );
}
