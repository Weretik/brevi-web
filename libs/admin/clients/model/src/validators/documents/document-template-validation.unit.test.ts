import { describe, expect, it } from 'vitest';

import { documentTemplateErrors } from './document-template-validation';
import { emptyDocumentTemplateDraft } from '../../models/documents/document-template-draft';

const complete = () => ({
  ...emptyDocumentTemplateDraft(),
  title: 'Комерційна пропозиція',
  openingText: 'Пропонуємо товари',
  ctaTitle: 'Зв’яжіться з нами',
  ctaText: 'Відповімо на запитання',
  ctaContactTemplate: 'Телефон продавця',
});

describe('public document template form rules', () => {
  it('uses the approved EN-005 tax wording as an editable default', () => {
    expect(emptyDocumentTemplateDraft().vatNotice).toBe('Усі ціни вказані в грн з ПДВ.');
    expect(documentTemplateErrors(complete())).toEqual({});
  });

  it('requires public copy without inventing quote or PDF data', () => {
    expect(documentTemplateErrors(emptyDocumentTemplateDraft())).toMatchObject({
      title: expect.any(String),
      openingText: expect.any(String),
      ctaTitle: expect.any(String),
    });
  });

  it('enforces the server text limits', () => {
    expect(documentTemplateErrors({ ...complete(), openingText: 'x'.repeat(3001) })).toHaveProperty(
      'openingText',
    );
  });
});
