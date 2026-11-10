import { Breadcrumbs } from './breadcrumbs';
import { StitchLabel } from './stitch-label';

import type { BreadcrumbItem } from './breadcrumbs';

type PageHeaderProps = {
  breadcrumbs: readonly BreadcrumbItem[];
  /** Accessible name of the breadcrumb navigation. */
  breadcrumbsLabel: string;
  /** Caption of the «Строчка» label above the heading; its number is always `01`. */
  label: string;
  title: string;
  lead?: string;
};

/** Head of a content page: breadcrumbs, stitch label, `h1`, and one lead sentence. */
export function PageHeader({ breadcrumbs, breadcrumbsLabel, label, title, lead }: PageHeaderProps) {
  return (
    <section className="grid gap-8 pt-6 sm:pt-8">
      <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />
      <div className="grid gap-5">
        <StitchLabel index="01">{label}</StitchLabel>
        <h1 className="text-[2rem] leading-[1.08] font-extrabold tracking-[-0.025em] sm:text-[2.75rem]">
          {title}
        </h1>
        {lead ? (
          <p className="max-w-[44rem] text-lg leading-relaxed text-muted-foreground">{lead}</p>
        ) : null}
      </div>
    </section>
  );
}
