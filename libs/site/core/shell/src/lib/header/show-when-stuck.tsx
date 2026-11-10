'use client';

import { useEffect, useState } from 'react';

import type { ReactNode } from 'react';

/**
 * Shows its content only after the page is scrolled past the contacts row, when just the menu row
 * stays on screen: the phone moves there so it is never out of sight.
 */
export function ShowWhenStuck({
  offset,
  children,
}: {
  /** Height of the row that scrolls away, in px. */
  offset: number;
  children: ReactNode;
}) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const update = () => setStuck(window.scrollY > offset);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [offset]);

  return (
    <div hidden={!stuck} className="max-xl:hidden [&[hidden]]:hidden">
      {children}
    </div>
  );
}
