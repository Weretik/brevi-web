'use client';

import { XIcon } from 'lucide-react';
import { Dialog as DialogPrimitive } from 'radix-ui';

import { cn } from './cn';

import type { ComponentProps } from 'react';

export const Dialog = DialogPrimitive.Root;

type DialogContentProps = ComponentProps<typeof DialogPrimitive.Content> & { closeLabel: string };

/**
 * Window in the middle of the screen over a dimmed page, for example the request form. On phones it takes the
 * whole width and scrolls inside; Escape, a click outside and the cross close it.
 */
export function DialogContent({ className, children, closeLabel, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-1.5rem)] max-w-[32rem] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-background shadow-xl outline-none',
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className="absolute top-3 right-3 rounded-md p-1.5 text-muted-foreground hover:bg-background/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label={closeLabel}
        >
          <XIcon className="size-5" strokeWidth={1.75} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn('sr-only', className)} {...props} />;
}

export function DialogDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description className={cn('sr-only', className)} {...props} />;
}
