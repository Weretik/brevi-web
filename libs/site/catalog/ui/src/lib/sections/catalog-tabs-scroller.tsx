'use client';

import { useEffect, useRef } from 'react';

import type { ReactNode } from 'react';

/**
 * A row that scrolls sideways on a narrow screen and brings the open tab (`aria-current="page"`) into view
 * on load, so on «Жилети» the visitor sees «Жилети» and not only the first tabs.
 */
export function CatalogTabsScroller({ label, children }: { label: string; children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const row = root.current;
    const current = row?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!row || !current || row.scrollWidth <= row.clientWidth) return;
    row.scrollLeft = current.offsetLeft - (row.clientWidth - current.offsetWidth) / 2;
  }, []);

  return (
    <nav
      ref={root}
      aria-label={label}
      className="relative -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
    >
      {children}
    </nav>
  );
}
