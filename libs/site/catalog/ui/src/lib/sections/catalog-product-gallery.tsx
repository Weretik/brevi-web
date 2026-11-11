'use client';

import { cn } from '@site/shared/ui';
import Image from 'next/image';
import { useState } from 'react';

import type { CatalogPhoto } from '@site/catalog/model';

/**
 * Product photos on white: the chosen photo and a row of thumbnails. Without JavaScript the first photo
 * stays; the thumbnails are buttons, so the keyboard and a screen reader can switch photos. The photos are
 * on the media server and have no known size, so each fills its frame.
 */
export function CatalogProductGallery({
  photos,
  name,
  labels,
}: {
  photos: readonly CatalogPhoto[];
  name: string;
  labels: { gallery: string; photo: string; noPhoto: string };
}) {
  const [current, setCurrent] = useState(0);
  const photo = photos[current] ?? photos[0];

  if (!photo) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl border bg-white text-sm text-muted-foreground">
        {labels.noPhoto}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border bg-white">
        <Image
          src={photo.src}
          alt={current === 0 ? name : `${name}, ${labels.photo} ${current + 1}`}
          fill
          sizes="(min-width: 768px) 38rem, 100vw"
          unoptimized
          priority
          className="object-contain p-4"
        />
      </div>
      {photos.length > 1 ? (
        <ul aria-label={labels.gallery} className="flex flex-wrap gap-2">
          {photos.map((item, index) => (
            <li key={item.src}>
              <button
                type="button"
                aria-label={`${labels.photo} ${index + 1}`}
                aria-pressed={index === current}
                onClick={() => setCurrent(index)}
                className={cn(
                  'relative block size-16 overflow-hidden rounded-md border bg-white outline-none focus-visible:ring-2 focus-visible:ring-ring sm:size-[4.5rem]',
                  index === current ? 'border-2 border-brand' : 'hover:border-border-strong',
                )}
              >
                <Image
                  src={item.thumbnail ?? item.src}
                  alt=""
                  fill
                  sizes="4.5rem"
                  unoptimized
                  loading="lazy"
                  className="object-contain p-1"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
