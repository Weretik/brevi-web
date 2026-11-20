'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@site/shared/ui';
import { useRouter } from 'next/navigation';

import type { ReactNode } from 'react';

/**
 * The request form as a window over the page a visitor came from. It opens at once; closing it goes back to
 * that page, so the address of the page returns too.
 */
export function RequestDialog({
  title,
  description,
  closeLabel,
  children,
}: {
  title: string;
  description: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <Dialog defaultOpen onOpenChange={(open) => (open ? undefined : router.back())}>
      <DialogContent closeLabel={closeLabel} className="bg-muted">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        {children}
      </DialogContent>
    </Dialog>
  );
}
