import Link from 'next/link';

import { cn } from './cn';

export type BreadcrumbItem = {
  name: string;
  /** Localized path of the page, for example `/uk/about-company`. */
  href: string;
};

/** Breadcrumb trail; the last item is the current page and is not a link. */
export function Breadcrumbs({
  items,
  label,
  className,
}: {
  items: readonly BreadcrumbItem[];
  /** Accessible name of the navigation, for example «Хлібні крихти». */
  label: string;
  className?: string;
}) {
  return (
    <nav aria-label={label} className={cn('text-sm text-muted-foreground', className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden className="font-mono text-brand-text">
                  /
                </span>
              ) : null}
              {isCurrent ? (
                <span aria-current="page" className="text-foreground">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-brand-text hover:underline">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
