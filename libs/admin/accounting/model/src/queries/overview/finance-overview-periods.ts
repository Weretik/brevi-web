import { formatLedgerDate } from '../../mappers/money/finance-money';
import { legacyArchiveStart, previousDay } from '../journal/finance-journal-filters';

import type { LedgerScope } from '../../entities/categories/finance-category';

/** A quick period of «Огляд» and «Операції»; `custom` opens the date fields. */
export type FinancePeriodKey = 'month' | 'previousMonth' | 'all' | 'custom';

export interface FinancePeriod {
  from: string;
  to: string;
}

export interface FinancePeriodChoice extends FinancePeriod {
  key: Exclude<FinancePeriodKey, 'custom'>;
  /** The button text, e.g. «Листопад». */
  label: string;
  /** The same period inside a sentence, e.g. «листопад» or «з 01.10.2026». */
  caption: string;
}

const months = [
  'січень',
  'лютий',
  'березень',
  'квітень',
  'травень',
  'червень',
  'липень',
  'серпень',
  'вересень',
  'жовтень',
  'листопад',
  'грудень',
];

const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const later = (a: string, b: string) => (a > b ? a : b);

function monthOf(date: string): { first: string; last: string; name: string } {
  const [year = 0, month = 1] = date.split('-').map(Number);
  const first = `${year}-${String(month).padStart(2, '0')}-01`;
  const next =
    month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, '0')}-01`;
  return { first, last: previousDay(next), name: months[month - 1] ?? '' };
}

/**
 * Quick periods of an area. The current books: this month (from the cutover at most), the last
 * month when it is after the cutover, and the whole books. The archive: only the whole archive.
 */
export function financePeriodChoices(
  scope: LedgerScope,
  cutoverDate: string,
  today: string,
): FinancePeriodChoice[] {
  if (scope === 'LegacyArchive')
    return [
      {
        key: 'all',
        from: legacyArchiveStart,
        to: previousDay(cutoverDate),
        label: 'Увесь архів',
        caption: `до ${formatLedgerDate(previousDay(cutoverDate))}`,
      },
    ];
  const end = later(today, cutoverDate);
  const month = monthOf(end);
  const previous = monthOf(previousDay(month.first));
  const choices: FinancePeriodChoice[] = [
    {
      key: 'month',
      from: later(month.first, cutoverDate),
      to: end,
      label: capital(month.name),
      caption: month.name,
    },
  ];
  if (previous.last >= cutoverDate)
    choices.push({
      key: 'previousMonth',
      from: later(previous.first, cutoverDate),
      to: previous.last,
      label: capital(previous.name),
      caption: previous.name,
    });
  choices.push({
    key: 'all',
    from: cutoverDate,
    to: end,
    label: `З ${formatLedgerDate(cutoverDate).slice(0, 5)}`,
    caption: `з ${formatLedgerDate(cutoverDate)}`,
  });
  return choices;
}

/** The caption of a typed period: «01.10.2026 – 15.10.2026». */
export const financePeriodCaption = ({ from, to }: FinancePeriod) =>
  `${formatLedgerDate(from)} – ${formatLedgerDate(to)}`;
