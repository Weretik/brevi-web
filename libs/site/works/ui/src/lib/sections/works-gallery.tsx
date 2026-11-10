import Image from 'next/image';

import { workPhotoPath, workThumbPath } from '../data/work-photos';

import type { WorkPhoto } from '../data/work-photos';
import type { WorksDictionary } from '../i18n/works-dictionary';

/** How many photos load at once; the rest load lazily while the visitor scrolls. */
const EAGER_PHOTOS = 4;

/**
 * Masonry gallery in CSS columns. Thumbnails are prepared files, so the image optimizer is not used; each
 * photo links to its large file, which opens in a new tab.
 */
export function WorksGallery({
  photos,
  dictionary,
}: {
  photos: readonly WorkPhoto[];
  dictionary: WorksDictionary['gallery'];
}) {
  return (
    <ul className="columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
      {photos.map((photo, index) => {
        const alt = `${dictionary.photoAlt} ${index + 1}`;

        return (
          <li key={photo.id} className="mb-3 break-inside-avoid sm:mb-4">
            <a
              href={workPhotoPath(photo)}
              target="_blank"
              rel="noopener"
              aria-label={`${dictionary.open}: ${alt}`}
              className="block overflow-hidden rounded-lg border border-border bg-muted hover:border-brand"
            >
              <Image
                src={workThumbPath(photo)}
                alt={alt}
                width={photo.width}
                height={photo.height}
                unoptimized
                loading={index < EAGER_PHOTOS ? 'eager' : 'lazy'}
                className="h-auto w-full"
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
