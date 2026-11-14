'use client';

import { cn } from '@site/shared/ui';
import { useEffect, useId, useRef, useState } from 'react';

import type { ReactNode } from 'react';

/** Height of the folded text: about six lines. */
const FOLDED_HEIGHT = 168;

/**
 * A long text folded to its first lines with a button to read it all. The full text is always in the page
 * for search engines and screen readers; without JavaScript, or when the text is short, it is not folded.
 */
export function CatalogExpandableText({
  more,
  less,
  children,
}: {
  more: string;
  less: string;
  children: ReactNode;
}) {
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const [foldable, setFoldable] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const height = box.current?.scrollHeight ?? 0;
    setFoldable(height > FOLDED_HEIGHT * 1.5);
  }, []);

  const folded = foldable && !open;

  return (
    <div className="grid max-w-[48rem] gap-3">
      <div
        id={id}
        ref={box}
        className={cn(
          'relative',
          folded &&
            'max-h-[10.5rem] overflow-hidden after:absolute after:inset-x-0 after:bottom-0 after:h-16 after:bg-gradient-to-b after:from-transparent after:to-background',
        )}
      >
        {children}
      </div>
      {foldable ? (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((value) => !value)}
          className="justify-self-start font-bold text-brand-text hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {open ? less : more}
        </button>
      ) : null}
    </div>
  );
}
