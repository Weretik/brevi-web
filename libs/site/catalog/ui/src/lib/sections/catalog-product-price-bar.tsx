'use client';

import { buttonVariants, cn } from '@site/shared/ui';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Phone and tablet strip above the bottom bar of the site: the lowest price of the model and «Заявка».
 * It hides while the order card (`targetId`) or the site footer is on the screen, so the price is not
 * shown twice and the footer stays readable; without
 * JavaScript it stays visible.
 */
export function CatalogProductPriceBar({
  targetId,
  price,
  label,
  request,
  requestHref,
}: {
  targetId: string;
  /** «від 2 638» with the currency. */
  price: string;
  label: string;
  request: string;
  requestHref: string;
}) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const targets = [document.getElementById(targetId), document.querySelector('footer')].filter(
      (item): item is HTMLElement => item !== null,
    );
    if (targets.length === 0 || typeof IntersectionObserver === 'undefined') return;
    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreen.add(entry.target);
        else onScreen.delete(entry.target);
      }
      setHidden(onScreen.size > 0);
    });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [targetId]);

  return (
    <aside
      aria-label={label}
      className={cn(
        'fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-20 flex items-center justify-between gap-3 border-t border-border-strong bg-background px-4 py-2.5 transition-transform motion-reduce:transition-none lg:hidden',
        hidden && 'pointer-events-none translate-y-full opacity-0',
      )}
    >
      <p className="text-lg font-extrabold tabular-nums">{price}</p>
      <Link
        href={requestHref}
        rel="nofollow"
        tabIndex={hidden ? -1 : undefined}
        className={buttonVariants({ variant: 'brand' })}
      >
        {request}
      </Link>
    </aside>
  );
}
