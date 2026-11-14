import { previousReportPeriod, reportPeriodProblem } from '@admin/production/model';
import { useState } from 'react';

/**
 * Period of «Звіти цеху»: whole months up to `current`, and an optional comparison that follows the months right
 * before the period until the person changes it.
 */
export function useReportPeriod(current: string) {
  const [from, setFromValue] = useState(current);
  const [to, setToValue] = useState(current);
  const [compare, setCompare] = useState(false);
  const previous = previousReportPeriod(current, current);
  const [compareFrom, setCompareFrom] = useState(previous?.from ?? current);
  const [compareTo, setCompareTo] = useState(previous?.to ?? current);

  const setPeriod = (nextFrom: string, nextTo: string) => {
    setFromValue(nextFrom);
    setToValue(nextTo);
    const before = previousReportPeriod(nextFrom, nextTo);
    if (before) {
      setCompareFrom(before.from);
      setCompareTo(before.to);
    }
  };

  const problem =
    reportPeriodProblem(from, to, current) ??
    (compare ? reportPeriodProblem(compareFrom, compareTo, current) : null);

  return {
    from,
    to,
    setFrom: (value: string) => setPeriod(value, to),
    setTo: (value: string) => setPeriod(from, value),
    compare,
    setCompare,
    compareFrom,
    setCompareFrom,
    compareTo,
    setCompareTo,
    problem,
    query: compare ? { from, to, compareFrom, compareTo } : { from, to },
  };
}
