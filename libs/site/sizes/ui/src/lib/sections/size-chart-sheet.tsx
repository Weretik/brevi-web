'use client';

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@site/shared/ui';
import { RulerIcon } from 'lucide-react';
import Link from 'next/link';

import { SizeFinder } from './size-finder';
import { SizeTables } from './size-tables';

import type { SizesDictionary } from '../i18n/sizes-dictionary';

/**
 * «Таблиця розмірів» help for a product page: a button that opens a side panel with the finder and the
 * charts, so the visitor does not leave the product. `fullPageHref` links to the full page with the rules.
 */
export function SizeChartSheet({
  dictionary,
  fullPageHref,
}: {
  dictionary: SizesDictionary;
  fullPageHref: string;
}) {
  const { sheet } = dictionary;

  return (
    <Sheet>
      <SheetTrigger className="inline-flex h-10 items-center gap-2 justify-self-start rounded-lg border border-border-strong px-4 text-sm font-bold hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
        <RulerIcon className="size-4 text-brand-text" strokeWidth={1.75} aria-hidden />
        {sheet.trigger}
      </SheetTrigger>
      <SheetContent
        side="right"
        closeLabel={sheet.close}
        className="w-[min(34rem,100vw)] gap-6 p-6"
      >
        <div className="grid gap-1 pr-8">
          <SheetTitle className="text-xl font-extrabold">{sheet.title}</SheetTitle>
          <SheetDescription>{sheet.description}</SheetDescription>
        </div>
        <SizeFinder dictionary={dictionary.finder} />
        <SizeTables dictionary={dictionary.tables} />
        <Link href={fullPageHref} className="font-bold text-brand-text hover:underline">
          {sheet.full} <span aria-hidden>→</span>
        </Link>
      </SheetContent>
    </Sheet>
  );
}
