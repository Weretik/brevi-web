import Link from 'next/link';

import { cn } from './cn';
import { StitchLabel } from './stitch-label';

import type { ReactNode } from 'react';

type PageSectionProps = {
  /** Anchor and the id the heading gets (`<id>-title`). */
  id: string;
  title: string;
  /** Number and caption of the «Строчка» label above the heading. */
  label?: { index: string; text: string };
  /** Link on the right of the heading, for example «Весь каталог». */
  action?: { href: string; label: string };
  className?: string;
  children: ReactNode;
};

/** A page block of the «Строчка» design: stitch label, `h2`, optional link, content. */
export function PageSection({ id, title, label, action, className, children }: PageSectionProps) {
  const titleId = `${id}-title`;

  return (
    <section id={id} aria-labelledby={titleId} className={cn('scroll-mt-24', className)}>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="grid gap-2">
          {label ? <StitchLabel index={label.index}>{label.text}</StitchLabel> : null}
          <h2
            id={titleId}
            className="text-2xl leading-[1.15] font-extrabold tracking-[-0.015em] sm:text-[1.875rem]"
          >
            {title}
          </h2>
        </div>
        {action ? (
          <Link href={action.href} className="font-bold text-brand-text hover:underline">
            {action.label} <span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
