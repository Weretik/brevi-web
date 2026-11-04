import type { QuoteSettingsDraft } from './quote-settings-draft';

/** The sections of «Налаштування КП», named by what the client gets. */
export type QuoteSettingsSectionId = 'company' | 'pdf' | 'letters' | 'introduction' | 'managers';

export interface QuoteSettingsSection {
  readonly id: QuoteSettingsSectionId;
  readonly title: string;
  readonly description: string;
}

export const quoteSettingsSections: readonly QuoteSettingsSection[] = [
  {
    id: 'company',
    title: 'Компанія',
    description: 'Реквізити, контакти й логотип у шапці та внизу кожного PDF.',
  },
  {
    id: 'pdf',
    title: 'PDF КП під запит',
    description: 'Тексти документа, який отримує клієнт. Реквізити беруться з розділу «Компанія».',
  },
  {
    id: 'letters',
    title: 'Лист клієнту',
    description:
      'Шаблони листа, з яким КП надсилається з Gmail. Перший підставляється сам, інші менеджер вибирає при надсиланні.',
  },
  {
    id: 'introduction',
    title: 'КП для знайомства',
    description: 'Рекламний каталог, який надсилають новому клієнту без запиту.',
  },
  {
    id: 'managers',
    title: 'Менеджери і Gmail',
    description:
      'Клієнт бачить контакт відповідального менеджера. Порожнє поле — береться з облікового запису.',
  },
];

const errorPrefixes: readonly (readonly [string, QuoteSettingsSectionId])[] = [
  ['company.', 'company'],
  ['pdf.', 'pdf'],
  ['email.', 'letters'],
  ['letter:', 'letters'],
  ['letterVariants', 'letters'],
  ['introduction.', 'introduction'],
  ['advantage:', 'introduction'],
  ['staff:', 'managers'],
];

/** The section a field error belongs to: `letter:<key>.body` → «Лист клієнту». */
export function quoteSettingsSectionOf(path: string): QuoteSettingsSectionId | null {
  return errorPrefixes.find(([prefix]) => path.startsWith(prefix))?.[1] ?? null;
}

/** How many problems each section has; a section without problems is left out. */
export function quoteSettingsErrorCounts(
  errors: Readonly<Record<string, string>>,
): Partial<Record<QuoteSettingsSectionId, number>> {
  const counts: Partial<Record<QuoteSettingsSectionId, number>> = {};
  for (const path of Object.keys(errors)) {
    const section = quoteSettingsSectionOf(path);
    if (section) counts[section] = (counts[section] ?? 0) + 1;
  }
  return counts;
}

/** What each section is compared by; the Gmail address is not part of the page. */
const sectionValue: Record<QuoteSettingsSectionId, (draft: QuoteSettingsDraft) => unknown> = {
  company: (draft) => draft.company,
  pdf: (draft) => draft.pdf,
  letters: (draft) => [
    draft.email,
    draft.letterVariants.map(({ name, subject, body }) => ({ name, subject, body })),
  ],
  introduction: (draft) => draft.introduction,
  managers: (draft) =>
    draft.staffContacts.map(({ userId, name, phone, email }) => ({ userId, name, phone, email })),
};

/** The sections whose fields differ from the saved settings, in page order. */
export function quoteSettingsChangedSections(
  saved: QuoteSettingsDraft,
  draft: QuoteSettingsDraft,
): QuoteSettingsSectionId[] {
  return quoteSettingsSections
    .map((section) => section.id)
    .filter(
      (id) => JSON.stringify(sectionValue[id](saved)) !== JSON.stringify(sectionValue[id](draft)),
    );
}
