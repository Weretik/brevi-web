import { ReferenceListAlerts, ReferencePageHeader } from '@admin/references/ui';
import {
  formatMeters,
  formatPerProduct,
  isPlanFactOverrun,
  kyivToday,
  movementPeriodRange,
  planFactPeriods,
  planFactViewCounts,
  planFactViewLabels,
  planFactViews,
} from '@admin/warehouse/model';
import { PeriodChip, PlanFactTable, ReportFilterBar, ReportStats } from '@admin/warehouse/ui';
import { Alert, Box } from '@mui/material';

import { PlanFactModelDrawer } from '../../components/reports/plan-fact-model-drawer';
import { useFabricPlanFactReport } from '../../hooks/reports/use-fabric-plan-fact-report';

import type { WarehouseTabProps } from '../tabs/warehouse-tab';

const percent = new Intl.NumberFormat('uk-UA', {
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
});

/**
 * «Склад тканин › Звіти › План і факт» (WH-005, WH-010): main fabric by model for the items issued for all their
 * products, the largest overspending first; red only above 5%. The period goes by the day of the last issue.
 */
export function FabricPlanFactPage({ title, tabs }: WarehouseTabProps) {
  const {
    period,
    setPeriod,
    filter,
    setFilter,
    search,
    setSearch,
    debounced,
    view,
    setView,
    open,
    setOpen,
    valid,
    report,
    data,
    models,
    total,
    deviation,
  } = useFabricPlanFactReport();
  return (
    <Box sx={{ minWidth: 0 }}>
      <ReferencePageHeader
        overline="Склад тканин"
        title={title ?? 'План і факт'}
        subtitle="Основна тканина за моделями: лише завдання, тканину яких видано на всі вироби. Період — за днем останньої видачі."
        actions={null}
      />
      {tabs}
      <ReferenceListAlerts
        error={report.error ? 'Не вдалося порахувати план і факт.' : null}
        loading={report.isFetching}
        onRetry={() => void report.refetch()}
        actionMessage={null}
        onCloseActionMessage={() => undefined}
      />
      {data && total && (
        <ReportStats
          stats={[
            { label: 'Завдань', value: String(total.orders), hint: `${total.products} виробів` },
            {
              label: 'План / факт на виріб',
              value: `${formatPerProduct(total.planPerProduct)} / ${formatPerProduct(total.factPerProduct)}`,
            },
            {
              label: total.difference !== null && total.difference > 0 ? 'Перевитрата' : 'Різниця',
              value:
                total.difference === null
                  ? '—'
                  : `${total.difference > 0 ? '+' : ''}${formatMeters(total.difference)}`,
              tone: isPlanFactOverrun(total) ? 'error' : undefined,
              hint:
                deviation === null
                  ? 'Невідома: є завдання, які не порівняти'
                  : `${percent.format(deviation)}% до плану`,
            },
            ...(total.uncomparableItems > 0
              ? [
                  {
                    label: 'Не порівняти',
                    value: String(total.uncomparableItems),
                    tone: 'warning' as const,
                    hint: 'Немає плану або видача без виробів',
                  },
                ]
              : []),
          ]}
        />
      )}
      <ReportFilterBar
        search={search}
        searchPlaceholder="Модель, замовник, тканина або Ц-12"
        searchLabel="Пошук у «План і факт»"
        views={planFactViews}
        labels={planFactViewLabels}
        counts={data ? planFactViewCounts(data.models) : { all: 0, overrun: 0, uncomparable: 0 }}
        view={view}
        hideEmpty={['overrun', 'uncomparable']}
        shown={data ? models.length : null}
        onSearch={setSearch}
        onView={setView}
        extra={
          <PeriodChip
            periods={planFactPeriods}
            period={period}
            from={filter.from}
            to={filter.to}
            onPeriod={(next) => {
              setPeriod(next);
              if (next !== 'custom') setFilter(movementPeriodRange(next, kyivToday()));
            }}
            onDates={setFilter}
          />
        }
      />
      {!valid && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Кінець періоду раніше за початок.
        </Alert>
      )}
      {data && data.inProgressItems > 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Ще не видано на всі вироби: {data.inProgressItems} завд. Вони зʼявляться тут після повної
          видачі.
        </Alert>
      )}
      {data && total && (
        <PlanFactTable
          models={models}
          total={total}
          filtered={debounced.trim().length > 0 || view !== 'all' || period !== 'all'}
          onOpen={setOpen}
        />
      )}
      {open && <PlanFactModelDrawer model={open} onClose={() => setOpen(null)} />}
    </Box>
  );
}

export default FabricPlanFactPage;
