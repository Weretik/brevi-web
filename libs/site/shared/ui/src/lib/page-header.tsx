import { Breadcrumbs } from './breadcrumbs';
import { StitchLabel } from './stitch-label';

import type { BreadcrumbItem } from './breadcrumbs';

type PageHeaderProps = {
  breadcrumbs: readonly BreadcrumbItem[];
  /** Accessible name of the breadcrumb navigation. */
  breadcrumbsLabel: string;
  /** Caption of the «Строчка» label above the heading; its number is always `01`. Catalog pages have none. */
  label?: string;
  title: string;
  /** A short note next to the heading, such as «33 моделі». */
  titleNote?: string;
  lead?: string;
};

/** Head of a content page: breadcrumbs, stitch label, `h1`, and one lead sentence. */
export function PageHeader({
  breadcrumbs,
  breadcrumbsLabel,
  label,
  title,
  titleNote,
  lead,
}: PageHeaderProps) {
  return (
    <section className={label ? 'grid gap-8 pt-6 sm:pt-8' : 'grid gap-5 pt-6 sm:pt-8'}>
      <Breadcrumbs items={breadcrumbs} label={breadcrumbsLabel} />
      <div className="grid gap-5">
        {label ? <StitchLabel index="01">{label}</StitchLabel> : null}
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="text-[2rem] leading-[1.08] font-extrabold tracking-[-0.025em] sm:text-[2.75rem]">
            {title}
          </h1>
          {titleNote ? (
            <span className="font-semibold whitespace-nowrap text-muted-foreground">
              {titleNote}
            </span>
          ) : null}
        </div>
        {lead ? (
          <p className="max-w-[44rem] text-lg leading-relaxed text-muted-foreground">{lead}</p>
        ) : null}
      </div>
    </section>
  );
}
