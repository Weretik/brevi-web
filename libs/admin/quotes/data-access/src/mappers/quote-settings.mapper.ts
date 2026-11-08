import type { QuoteSettings, QuoteSettingsDraft } from '@admin/quotes/model';
import type { components } from '@admin/shared/contracts';

type Schemas = components['schemas'];

/** Picks the listed fields of a section; a missing one becomes null. */
function pick<K extends string>(
  value: Partial<Record<K, string | null>>,
  keys: readonly K[],
): Record<K, string | null> {
  return Object.fromEntries(keys.map((key) => [key, value[key] ?? null])) as Record<
    K,
    string | null
  >;
}

const companyKeys = [
  'edrpou',
  'taxId',
  'iban',
  'address',
  'phone',
  'email',
  'site',
  'logoUrl',
] as const;
const pdfKeys = ['vatNotice', 'ctaTitle', 'ctaText', 'ctaContactTemplate'] as const;
const introKeys = [
  'onePpe',
  'oneSewing',
  'oneSewingOnePpe',
  'sewing',
  'ppe',
  'sewingAndPpe',
  'fallback',
] as const;
const labelKeys = [
  'contactLine',
  'codeLabel',
  'siteLink',
  'fabricsTitle',
  'recommended',
  'commentTitle',
  'clientTitle',
] as const;

/** The server answers with the standard text in place of an empty one, so a missing field is only ''. */
function filled<K extends string>(
  value: Partial<Record<K, string | null>> | null | undefined,
  keys: readonly K[],
): Record<K, string> {
  return Object.fromEntries(keys.map((key) => [key, value?.[key] ?? ''])) as Record<K, string>;
}
const introductionKeys = [
  'logoText',
  'summerTitle',
  'winterTitle',
  'subtitle',
  'summerBannerUrl',
  'winterBannerUrl',
  'modelsTitle',
  'assortmentLinkText',
  'assortmentUrl',
  'productButtonText',
  'nextStepText',
  'pricesNote',
  'accentColor',
  'summerMainCode',
  'winterMainCode',
] as const;

/** Trims a field; an empty one is sent as null. */
const text = (value: string): string | null => value.trim() || null;

function texts<T extends object>(value: T): { [K in keyof T]: string | null } {
  return Object.fromEntries(
    Object.entries(value).map(([key, field]) => [key, text(field as string)]),
  ) as { [K in keyof T]: string | null };
}

export function mapQuoteSettings(value: Schemas['CrmQuoteSettings']): QuoteSettings {
  return {
    version: value.version,
    updatedByName: value.updatedByName ?? null,
    updatedAt: value.updatedAt ?? null,
    company: { ...pick(value.company, companyKeys), name: value.company.name },
    email: value.email,
    pdf: {
      ...pick(value.pdf, pdfKeys),
      title: value.pdf.title,
      intros: filled(value.pdf.intros, introKeys),
      labels: filled(value.pdf.labels, labelKeys),
      showClient: value.pdf.labels?.showClient !== false,
    },
    introduction: {
      ...pick(value.introduction, introductionKeys),
      advantages: value.introduction.advantages.map((advantage) => ({
        title: advantage.title,
        text: advantage.text ?? null,
      })),
    },
    letterVariants: value.letterVariants,
    staffContacts: value.staffContacts.map((contact) => ({
      userId: contact.userId,
      accountName: contact.accountName,
      accountEmail: contact.accountEmail ?? null,
      name: contact.name,
      phone: contact.phone ?? null,
      email: contact.email ?? null,
      mailboxEmail: contact.mailboxEmail ?? null,
    })),
  };
}

export function toSaveQuoteSettingsInput(
  draft: QuoteSettingsDraft,
): Schemas['CrmSaveQuoteSettingsInput'] {
  const { advantages, ...introduction } = draft.introduction;
  const { intros, labels, showClient, ...pdf } = draft.pdf;
  return {
    version: draft.version,
    company: { ...texts(draft.company), name: draft.company.name.trim() },
    email: { subject: draft.email.subject.trim(), body: draft.email.body.trim() },
    pdf: {
      ...texts(pdf),
      title: pdf.title.trim(),
      intros: texts(intros),
      labels: { ...texts(labels), showClient },
    },
    introduction: {
      ...texts(introduction),
      advantages: advantages.map((advantage) => ({
        title: advantage.title.trim(),
        text: text(advantage.text),
      })),
    },
    letterVariants: draft.letterVariants.map((variant) => ({
      name: variant.name.trim(),
      subject: variant.subject.trim(),
      body: variant.body.trim(),
    })),
    staffContacts: draft.staffContacts.map((contact) => ({
      userId: contact.userId,
      name: contact.name.trim(),
      phone: text(contact.phone),
      email: text(contact.email),
    })),
  };
}
