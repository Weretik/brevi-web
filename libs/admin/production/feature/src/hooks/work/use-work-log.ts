import { useGetWorkChoicesQuery, useGetWorkLogQuery } from '@admin/production/data-access';
import { shiftWorkMonth, workLogOrderOptions, workMonth } from '@admin/production/model';
import { useMemo, useState } from 'react';

/** «Журнал робіт»: the month and the employee/order filters, the log they select and the choices for new work. */
export function useWorkLog(today: string) {
  const current = workMonth(today);
  const [month, setMonth] = useState(current);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const log = useGetWorkLogQuery({ month, employeeId, orderId });
  const choices = useGetWorkChoicesQuery();

  const openOrders = useMemo(
    () => new Set((choices.data?.items ?? []).map((item) => item.orderId)),
    [choices.data],
  );
  const orders = useMemo(
    () => workLogOrderOptions(log.data?.rows ?? [], choices.data?.items ?? []),
    [log.data, choices.data],
  );

  return {
    log,
    choices: choices.data ?? null,
    month,
    shiftMonth: (step: number) => setMonth((value) => shiftWorkMonth(value, step)),
    canGoForward: month < current,
    employeeId,
    setEmployeeId,
    orderId,
    setOrderId,
    employees: choices.data?.employees ?? [],
    orders,
    /** A work can be voided only while its order is still open. */
    isOpenOrder: (id: number) => openOrders.has(id),
  };
}
