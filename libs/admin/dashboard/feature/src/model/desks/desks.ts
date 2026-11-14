/** A «Робочий стіл» of a role (DESK-001); `access` is its page in «Права доступу» → «Робочі столи». */
export interface DeskDefinition {
  key: DeskKey;
  /** Tab name when a person sees several desks. */
  title: string;
  /** Page title when it is the person's only desk. */
  heading: string;
  access: string;
}

export type DeskKey = 'main' | 'workshop' | 'sales' | 'seo' | 'accounting';

/**
 * The desks in order: the main desk of the director and administrators (stage 5), the workshop (stage 1), «Продажі»
 * (stage 2), SEO (stage 3) and the accountant (stage 4). With the main desk the others fold under it; without it
 * several desks get tabs.
 */
export const desks: readonly DeskDefinition[] = [
  { key: 'main', title: 'Головне', heading: 'Робочий стіл', access: 'desk-main' },
  { key: 'workshop', title: 'Цех', heading: 'Робочий стіл цеху', access: 'desk-workshop' },
  { key: 'sales', title: 'Продажі', heading: 'Робочий стіл менеджера', access: 'desk-sales' },
  { key: 'seo', title: 'SEO', heading: 'Робочий стіл SEO', access: 'desk-seo' },
  {
    key: 'accounting',
    title: 'Бухгалтерія',
    heading: 'Робочий стіл бухгалтера',
    access: 'desk-accounting',
  },
];

export const visibleDesks = (canSee: (page: string) => boolean): DeskDefinition[] =>
  desks.filter((desk) => canSee(desk.access));
