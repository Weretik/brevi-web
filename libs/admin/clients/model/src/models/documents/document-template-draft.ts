/** Editable public document copy; no quote or PDF data is kept here. */
export interface DocumentTemplateDraft {
  layoutKey: 'standard';
  title: string;
  vatNotice: string;
  openingText: string;
  ctaTitle: string;
  ctaText: string;
  ctaContactTemplate: string;
}

export const emptyDocumentTemplateDraft = (): DocumentTemplateDraft => ({
  layoutKey: 'standard',
  title: '',
  vatNotice: 'Усі ціни вказані в грн з ПДВ.',
  openingText: '',
  ctaTitle: '',
  ctaText: '',
  ctaContactTemplate: '',
});
