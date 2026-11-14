import { usePageRights } from '@admin/shared/ui';
import { useGetFabricStockQuery } from '@admin/warehouse/data-access';
import {
  filterFabricStock,
  searchFabricStock,
  sortFabricStock,
  stockProblemCounts,
} from '@admin/warehouse/model';
import { useMemo, useState } from 'react';

import type { FabricStockPair, StockProblem, StockSortKey } from '@admin/warehouse/model';

type Panel =
  | { kind: 'receipt' | 'issue' | 'item-issue' | 'opening' | 'transfer' }
  | { kind: 'pair' | 'adjust'; pair: FabricStockPair };

/** «Залишки»: the fabrics with the search, problem and supplier chips and the sort, which fabric rows are open, the side panel and the message. */
export function useFabricStockPage() {
  const stock = useGetFabricStockQuery();
  const [search, setSearch] = useState('');
  const [problem, setProblem] = useState<StockProblem>('all');
  const [supplier, setSupplier] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: StockSortKey; descending: boolean }>({
    key: 'name',
    descending: false,
  });
  const [opened, setOpened] = useState<ReadonlySet<string>>(() => new Set());
  const [closed, setClosed] = useState<ReadonlySet<string>>(() => new Set());
  const [panel, setPanel] = useState<Panel | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const data = stock.data;
  const narrowed = search.trim().length > 0 || problem !== 'all' || supplier !== null;
  const bySupplier = useMemo(
    () => filterFabricStock(searchFabricStock(data?.fabrics ?? [], search), 'all', supplier),
    [data, search, supplier],
  );
  const counts = useMemo(() => stockProblemCounts(bySupplier), [bySupplier]);
  const fabrics = useMemo(
    () => sortFabricStock(filterFabricStock(bySupplier, problem, null), sort.key, sort.descending),
    [bySupplier, problem, sort],
  );
  const expanded = useMemo(
    () =>
      new Set(
        fabrics
          .map((x) => x.fabricCode)
          .filter((code) => (narrowed ? !closed.has(code) : opened.has(code))),
      ),
    [fabrics, narrowed, opened, closed],
  );
  const toggle = (code: string) => {
    const flip = (set: ReadonlySet<string>) => {
      const next = new Set(set);
      if (!next.delete(code)) next.add(code);
      return next;
    };
    if (narrowed) setClosed(flip);
    else setOpened(flip);
  };
  // Openings, receipts, issues and «Уточнити» are new records: «Створення» on «Склад тканин».
  const { canCreate } = usePageRights();
  const canMove = Boolean(data?.permissions.canMove) && canCreate;
  const saved = (text: string) => {
    setMessage(text);
    setPanel(null);
  };
  return {
    stock,
    search,
    setSearch,
    problem,
    setProblem,
    supplier,
    setSupplier,
    sort,
    setSort,
    panel,
    setPanel,
    message,
    setMessage,
    data,
    narrowed,
    counts,
    fabrics,
    expanded,
    toggle,
    canMove,
    saved,
  };
}
