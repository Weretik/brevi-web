import Image from 'next/image';

import {
  CERTIFICATE_THUMB_SIZE,
  certificateScanPath,
  certificateThumbPath,
} from '../data/certificate-documents';

import type { CertificateDocument } from '../data/certificate-documents';
import type { CertificatesDictionary } from '../i18n/certificates-dictionary';

/**
 * Cards of the documents: the scan thumbnail, what the document is, what clothing it covers, and its
 * standards. Thumbnails are prepared files; each links to the full scan, which opens in a new tab.
 */
export function CertificatesDocuments({
  documents,
  dictionary,
}: {
  documents: readonly CertificateDocument[];
  dictionary: CertificatesDictionary['documents'];
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {documents.map((document) => {
        const title = dictionary.kinds[document.kind];
        const scope = dictionary.scopes[document.scope];

        return (
          <li
            key={document.id}
            className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-4 rounded-lg border border-border bg-background p-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-5 sm:p-5"
          >
            <a
              href={certificateScanPath(document)}
              target="_blank"
              rel="noopener"
              aria-label={`${dictionary.open}: ${title}. ${scope}`}
              className="block overflow-hidden rounded-md border border-border hover:border-brand"
            >
              <Image
                src={certificateThumbPath(document)}
                alt={`${title}. ${scope}`}
                width={CERTIFICATE_THUMB_SIZE.width}
                height={CERTIFICATE_THUMB_SIZE.height}
                unoptimized
                className="h-auto w-full"
              />
            </a>
            <div className="grid gap-2">
              <h3 className="leading-snug font-bold">{title}</h3>
              <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">{scope}</p>
              {document.standards.length > 0 ? (
                <ul
                  aria-label={dictionary.standards}
                  className="grid gap-1 font-mono text-[0.8125rem] text-muted-foreground"
                >
                  {document.standards.map((standard) => (
                    <li key={standard}>{standard}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
