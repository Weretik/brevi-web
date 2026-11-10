'use client';

import { cn } from '@site/shared/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { ReactNode } from 'react';

type NavLinkProps = {
  /** Localized path, for example `/uk/contacts`. */
  href: string;
  className?: string;
  onNavigate?: () => void;
  children: ReactNode;
};

/** Menu link that marks itself with `aria-current="page"` on its own page and the pages below it. */
export function NavLink({ href, className, onNavigate, children }: NavLinkProps) {
  const pathname = (usePathname() ?? '').replace(/\/+$/, '');
  const current = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={current ? 'page' : undefined}
      onClick={onNavigate}
      className={cn('transition-colors hover:text-brand-text', className)}
    >
      {children}
    </Link>
  );
}
