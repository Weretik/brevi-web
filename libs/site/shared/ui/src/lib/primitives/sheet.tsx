'use client';

import { XIcon } from 'lucide-react';
import { Dialog as SheetPrimitive } from 'radix-ui';

import { cn } from './cn';

import type { ComponentProps } from 'react';

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;
export const SheetClose = SheetPrimitive.Close;

type SheetContentProps = ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'left' | 'right' | 'bottom';
  closeLabel: string;
};

const SIDES = {
  left: 'inset-y-0 left-0 w-[min(22rem,88vw)] border-r border-border',
  right: 'inset-y-0 right-0 w-[min(22rem,88vw)] border-l border-border',
  bottom:
    'inset-x-0 bottom-0 max-h-[85dvh] rounded-t-2xl border-t border-border pb-[max(1.25rem,env(safe-area-inset-bottom))]',
} as const;

/** Side panel for the mobile menu, or a panel from the bottom edge for filters. */
export function SheetContent({
  className,
  children,
  side = 'left',
  closeLabel,
  ...props
}: SheetContentProps) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <SheetPrimitive.Content
        className={cn(
          'fixed z-50 flex flex-col gap-4 overflow-y-auto bg-background p-5 shadow-lg outline-none',
          SIDES[side],
          className,
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close
          className="absolute top-4 right-4 rounded-md p-1 text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label={closeLabel}
        >
          <XIcon className="size-5" strokeWidth={1.75} />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}

export function SheetTitle({ className, ...props }: ComponentProps<typeof SheetPrimitive.Title>) {
  return <SheetPrimitive.Title className={cn('text-base font-semibold', className)} {...props} />;
}

export function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof SheetPrimitive.Description>) {
  return <SheetPrimitive.Description className={cn('sr-only', className)} {...props} />;
}
