import type { DocumentTemplateDraft } from '../../models/documents/document-template-draft';

const required: readonly (readonly [keyof DocumentTemplateDraft, number, string])[] = [
  ['title', 200, 'заголовок'],
  ['vatNotice', 300, 'податкове формулювання'],
  ['openingText', 3000, 'вступний текст'],
  ['ctaTitle', 500, 'заголовок заклику'],
  ['ctaText', 3000, 'текст заклику'],
  ['ctaContactTemplate', 2000, 'контактний текст'],
];

export function documentTemplateErrors(
  value: DocumentTemplateDraft,
): Partial<Record<keyof DocumentTemplateDraft, string>> {
  const errors: Partial<Record<keyof DocumentTemplateDraft, string>> = {};
  if (value.layoutKey !== 'standard') errors.layoutKey = 'Оберіть підтримуваний макет.';
  for (const [field, max, label] of required) {
    if (!value[field].trim()) errors[field] = `Вкажіть ${label}.`;
    else if (value[field].trim().length > max) errors[field] = `Максимум ${max} символів.`;
  }
  return errors;
}
