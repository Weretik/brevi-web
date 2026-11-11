/** A «Робочий стіл» of a role (DESK-001); `access` is its page in «Права доступу» → «Робочі столи». */
export interface DeskDefinition {
  key: DeskKey;
  /** Tab name when a person sees several desks. */
  title: string;
  /** Page title when it is the person's only desk. */
  heading: string;
  access: string;
}

export type DeskKey = 'workshop' | 'sales';

/**
 * Desks built so far, in tab order. Stage 1: the workshop desk and, until the manager desk (stage 2), the latest КП
 * as «Продажі». SEO, accountant and the director's main desk come in later stages.
 */
export const desks: readonly DeskDefinition[] = [
  { key: 'workshop', title: 'Цех', heading: 'Робочий стіл цеху', access: 'desk-workshop' },
  { key: 'sales', title: 'Продажі', heading: 'Робочий стіл менеджера', access: 'desk-sales' },
];

export const visibleDesks = (canSee: (page: string) => boolean): DeskDefinition[] =>
  desks.filter((desk) => canSee(desk.access));
