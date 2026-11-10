import { existsSync } from 'node:fs';
import path from 'node:path';

import { render, screen } from '@testing-library/react';

import {
  CERTIFICATE_DOCUMENTS,
  CONFORMITY_MARK_PATH,
  certificateScanPath,
  certificateThumbPath,
} from './data/certificate-documents';
import { getCertificatesDictionary } from './i18n/certificates-dictionary';
import { CertificatesCopies } from './sections/certificates-copies';
import { CertificatesDocuments } from './sections/certificates-documents';

const publicDir = path.join(import.meta.dirname, '../../../../../../apps/site/public');

const shape = (value: unknown): unknown => {
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]));
  }
  return typeof value;
};

describe('certificates dictionary', () => {
  it('has the same keys in both languages', () => {
    expect(shape(getCertificatesDictionary('ru'))).toEqual(shape(getCertificatesDictionary('uk')));
  });
});

describe('certificate documents', () => {
  it('lists eight unique documents whose files exist in the site public folder', () => {
    expect(CERTIFICATE_DOCUMENTS).toHaveLength(8);
    expect(new Set(CERTIFICATE_DOCUMENTS.map((document) => document.id)).size).toBe(8);
    for (const document of CERTIFICATE_DOCUMENTS) {
      expect(existsSync(path.join(publicDir, certificateScanPath(document)))).toBe(true);
      expect(existsSync(path.join(publicDir, certificateThumbPath(document)))).toBe(true);
    }
    expect(existsSync(path.join(publicDir, CONFORMITY_MARK_PATH))).toBe(true);
  });
});

describe('CertificatesDocuments', () => {
  it('shows each document with its scan link and standards', () => {
    const dictionary = getCertificatesDictionary('uk').documents;
    render(<CertificatesDocuments documents={CERTIFICATE_DOCUMENTS} dictionary={dictionary} />);

    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(8);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(8);
    expect(links[0].getAttribute('href')).toBe('/assets/certificates/type-general.webp');
    expect(links[0].getAttribute('target')).toBe('_blank');
    expect(screen.getAllByText('ДСТУ EN 14058-2008 (EN 14058:2004, IDT)')).toHaveLength(2);
    // The annexes name no standards.
    expect(screen.getAllByRole('list', { name: dictionary.standards })).toHaveLength(6);
  });
});

describe('CertificatesCopies', () => {
  it('links to the contacts page and shows the conformity mark', () => {
    const dictionary = getCertificatesDictionary('ru').copies;
    render(<CertificatesCopies id="copies" dictionary={dictionary} contactsHref="/ru/contacts" />);

    expect(screen.getByRole('link', { name: /Контакты менеджеров/ }).getAttribute('href')).toBe(
      '/ru/contacts',
    );
    expect(screen.getByRole('img', { name: dictionary.markAlt })).toBeTruthy();
  });
});
