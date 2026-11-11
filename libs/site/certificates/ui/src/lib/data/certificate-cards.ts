import {
  CERTIFICATE_DOCUMENTS,
  CERTIFICATE_THUMB_SIZE,
  certificateScanPath,
  certificateThumbPath,
} from './certificate-documents';

import type { CertificatesDictionary } from '../i18n/certificates-dictionary';

/** A document card the page shows: from «Контент → Сертифікати» or one of the site's own scans. */
export type CertificateCard = {
  key: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  title: string;
  /** What clothing the document covers; empty hides the line. */
  scope: string;
  standards: readonly string[];
};

/** The site's own documents with their texts in the page language, shown while the Admin has none. */
export function staticCertificateCards(
  dictionary: CertificatesDictionary['documents'],
): CertificateCard[] {
  return CERTIFICATE_DOCUMENTS.map((document) => ({
    key: document.id,
    url: certificateScanPath(document),
    thumbnailUrl: certificateThumbPath(document),
    ...CERTIFICATE_THUMB_SIZE,
    title: dictionary.kinds[document.kind],
    scope: dictionary.scopes[document.scope],
    standards: document.standards,
  }));
}
