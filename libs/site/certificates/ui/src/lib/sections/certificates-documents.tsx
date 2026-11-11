import Image from 'next/image';

import type { CertificateCard } from '../data/certificate-cards';
import type { CertificatesDictionary } from '../i18n/certificates-dictionary';

/**
 * Cards of the documents: the scan thumbnail, what the document is, what clothing it covers, and its
 * standards. Thumbnails are prepared small copies; each links to the full scan, which opens in a new tab.
 */
export function CertificatesDocuments({
  documents,
  dictionary,
}: {
  documents: readonly CertificateCard[];
  dictionary: CertificatesDictionary['documents'];
}) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {documents.map((document) => {
        const { title, scope } = document;
        const name = scope ? `${title}. ${scope}` : title;

        return (
          <li
            key={document.key}
            className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-start gap-4 rounded-lg border border-border bg-background p-4 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-5 sm:p-5"
          >
            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${dictionary.open}: ${name}`}
              className="block overflow-hidden rounded-md border border-border hover:border-brand"
            >
              <Image
                src={document.thumbnailUrl}
                alt={name}
                width={document.width}
                height={document.height}
                unoptimized
                className="h-auto w-full"
              />
            </a>
            <div className="grid gap-2">
              <h3 className="leading-snug font-bold">{title}</h3>
              {scope ? (
                <p className="text-[0.9375rem] leading-relaxed text-muted-foreground">{scope}</p>
              ) : null}
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
