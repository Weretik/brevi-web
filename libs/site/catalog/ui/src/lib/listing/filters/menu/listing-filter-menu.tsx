'use client';

import { cn } from '@site/shared/ui';
import { ChevronDownIcon } from 'lucide-react';
import { useCallback, useId, useRef, useState } from 'react';

import { useDismiss } from './use-dismiss';

import type { ReactNode } from 'react';

/** A chip above the listing that opens the values of one filter; it names the chosen value. */
export function ListingFilterMenu({
  label,
  chosen,
  align = 'start',
  children,
}: {
  label: string;
  /** Text of the chosen value, or `null` while the filter is off. */
  chosen: string | null;
  align?: 'start' | 'end';
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(root, open, close);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'inline-flex min-h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-bold whitespace-nowrap focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
          chosen === null
            ? 'border-border-strong bg-background hover:border-foreground'
            : 'border-brand-soft bg-brand-surface text-brand-text',
        )}
      >
        {chosen === null ? label : `${label}: ${chosen}`}
        <ChevronDownIcon aria-hidden className="size-4" strokeWidth={2} />
      </button>
      {open ? (
        <div
          id={panelId}
          className={cn(
            'absolute top-12 z-30 grid w-64 gap-3 rounded-xl border border-border-strong bg-background p-3 shadow-lg',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {children(close)}
        </div>
      ) : null}
    </div>
  );
}
