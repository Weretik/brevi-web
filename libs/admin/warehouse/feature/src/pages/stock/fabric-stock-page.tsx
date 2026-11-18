import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import { formatMeters, stockSuppliers } from '@admin/warehouse/model';
import { FabricStockFilters, FabricStockTable } from '@admin/warehouse/ui';
import { Box } from '@mui/material';

import { FabricStockActions } from './fabric-stock-actions';
import { FabricStockPanels } from './fabric-stock-panels';
import { useFabricStockPage } from '../../hooks/stock/use-fabric-stock-page';

/**
 * «Склад тканин › Залишки»: one row per fabric and colour under its fabric, with «У броні» (what open plans still
 * need), «Вільно» and the latest operation. Problem chips with counts instead of a banner; a pair opens its side
 * panel, where «Уточнити залишок» is a separate button.
 */
export function FabricStockPage() {
  const page = useFabricStockPage();
  const {
    stock,
    search,
    setSearch,
    problem,
    setProblem,
    supplier,
    setSupplier,
    sort,
    setSort,
    message,
    setMessage,
    data,
    narrowed,
    counts,
    fabrics,
    expanded,
    toggle,
  } = page;
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title="Залишки"
        subtitle={
          data
            ? `${formatMeters(data.meters)} · ${data.pairs} пар тканина + колір · ${data.fabrics.length} тканин`
            : 'Скільки тканини лежить і скільки вже зайнято під завдання'
        }
        actions={<FabricStockActions page={page} />}
      />
      <ReferenceListAlerts
        error={stock.error ? 'Не вдалося завантажити залишки.' : null}
        loading={stock.isFetching}
        onRetry={() => void stock.refetch()}
        actionMessage={message}
        onCloseActionMessage={() => setMessage(null)}
      />
      <FabricStockFilters
        search={search}
        problem={problem}
        counts={counts}
        supplier={supplier}
        suppliers={stockSuppliers(data?.fabrics ?? [])}
        shown={fabrics.reduce((sum, x) => sum + x.colors.length, 0)}
        total={data?.pairs ?? 0}
        onSearch={setSearch}
        onProblem={setProblem}
        onSupplier={setSupplier}
      />
      {data && (
        <FabricStockTable
          fabrics={fabrics}
          filtered={narrowed}
          sort={sort}
          onSort={(key) =>
            setSort((current) => ({
              key,
              descending: current.key === key ? !current.descending : key !== 'name',
            }))
          }
          expanded={expanded}
          onToggle={toggle}
          onOpen={(pair) => page.setPanel({ kind: 'pair', pair })}
        />
      )}
      <FabricStockPanels page={page} />
    </Box>
  );
}

export default FabricStockPage;
