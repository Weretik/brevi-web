/** Scope of a document: workwear against general industrial dirt, or against low temperatures. */
export type CertificateScope = 'general' | 'cold';

/** Kind of a document, in the order of the live `brevi.com.ua` page. */
export type CertificateKind = 'type' | 'declaration' | 'annex' | 'sanitary';

export type CertificateDocument = {
  /** File name: `/assets/certificates/<id>.webp` and `<id>-thumb.webp`. */
  id: `${CertificateKind}-${CertificateScope}`;
  kind: CertificateKind;
  scope: CertificateScope;
  /** Standards named next to the document; the same in both languages. */
  standards: readonly string[];
};

/** Pixel size of every thumbnail: the scans share one page format. */
export const CERTIFICATE_THUMB_SIZE = { width: 425, height: 600 } as const;

const GENERAL_STANDARDS = [
  'ДСТУ EN ISO 13688:2016 (EN ISO 13688:2013, IDT)',
  'ДСТУ EN 1149-1:2017 (EN 1149-1:2006, IDT)',
  'ГОСТ 27575-87; ГОСТ 27574-87',
] as const;

const COLD_STANDARDS = [
  'ДСТУ EN ISO 13688:2016 (EN ISO 13688:2013, IDT)',
  'ДСТУ EN 14058-2008 (EN 14058:2004, IDT)',
  'ДСТУ EN 1149-1:2017 (EN 1149-1:2006, IDT)',
] as const;

/** Documents of the live `brevi.com.ua` page «Сертифікати», in its order. */
export const CERTIFICATE_DOCUMENTS: readonly CertificateDocument[] = [
  { id: 'type-general', kind: 'type', scope: 'general', standards: GENERAL_STANDARDS },
  { id: 'type-cold', kind: 'type', scope: 'cold', standards: COLD_STANDARDS },
  {
    id: 'declaration-general',
    kind: 'declaration',
    scope: 'general',
    standards: GENERAL_STANDARDS,
  },
  { id: 'declaration-cold', kind: 'declaration', scope: 'cold', standards: COLD_STANDARDS },
  { id: 'annex-general', kind: 'annex', scope: 'general', standards: [] },
  { id: 'annex-cold', kind: 'annex', scope: 'cold', standards: [] },
  {
    id: 'sanitary-general',
    kind: 'sanitary',
    scope: 'general',
    standards: ['ДСТУ EN ISO 13688:2016'],
  },
  { id: 'sanitary-cold', kind: 'sanitary', scope: 'cold', standards: ['ДСТУ EN 14058:2008'] },
];

const ASSETS = '/assets/certificates';

export const CONFORMITY_MARK_PATH = `${ASSETS}/conformity-mark.webp`;

export function certificateScanPath(document: CertificateDocument): string {
  return `${ASSETS}/${document.id}.webp`;
}

export function certificateThumbPath(document: CertificateDocument): string {
  return `${ASSETS}/${document.id}-thumb.webp`;
}
