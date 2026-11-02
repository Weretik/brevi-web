import { parameterSection } from '../../mappers/pricing-parameters/pricing-parameter-format';

import type {
  PpeMarkupRule,
  PricingParameter,
} from '../../entities/pricing-parameters/pricing-parameter';

/** `null` shows every section. */
export type PricingParameterSectionFilter = string | null;

export interface PricingParameterSection {
  value: string;
  count: number;
}

function matches(query: string, values: (string | null)[]): boolean {
  return !query || values.some((value) => value?.toLocaleLowerCase('uk').includes(query));
}

function normalized(search: string): string {
  return search.trim().toLocaleLowerCase('uk');
}

/** Sections in sheet order with their row counts. */
export function listPricingParameterSections(
  rows: readonly PricingParameter[],
): PricingParameterSection[] {
  const sections = new Map<string, number>();
  for (const row of rows) {
    const section = parameterSection(row.group);
    sections.set(section, (sections.get(section) ?? 0) + 1);
  }
  return [...sections].map(([value, count]) => ({ value, count }));
}

/** Local search over code, name, group and comment, then the section chip. */
export function filterPricingParameters(
  rows: PricingParameter[],
  search: string,
  section: PricingParameterSectionFilter,
): PricingParameter[] {
  const query = normalized(search);
  return rows.filter(
    (row) =>
      (section === null || parameterSection(row.group) === section) &&
      matches(query, [row.code, row.name, row.group, row.comment]),
  );
}

/** Local search over the rule name, the price note and «до яких товарів належить». */
export function filterPpeMarkupRules(rows: PpeMarkupRule[], search: string): PpeMarkupRule[] {
  const query = normalized(search);
  return rows.filter((row) => matches(query, [row.name, row.priceNote, row.appliesTo]));
}
