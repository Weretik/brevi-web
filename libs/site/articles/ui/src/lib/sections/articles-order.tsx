import { buttonVariants } from '@site/shared/ui';
import Link from 'next/link';

import type { ArticlesDictionary } from '../i18n/articles-dictionary';

/** Closing block: what to do after reading an article. */
export function ArticlesOrder({
  id,
  dictionary,
  discussHref,
  productionHref,
}: {
  id: string;
  dictionary: ArticlesDictionary['article']['order'];
  discussHref: string;
  productionHref: string;
}) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="grid gap-4 rounded-xl border-2 border-dashed border-brand-soft bg-muted p-6 sm:p-8"
    >
      <p className="font-mono text-[0.8125rem] font-semibold text-brand-text uppercase">
        {dictionary.label}
      </p>
      <h2 id={titleId} className="text-2xl leading-tight font-extrabold tracking-[-0.015em]">
        {dictionary.title}
      </h2>
      <p className="max-w-[52rem] leading-relaxed text-muted-foreground">{dictionary.text}</p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link href={discussHref} className={buttonVariants({ size: 'lg' })}>
          {dictionary.discuss}
        </Link>
        <Link href={productionHref} className="font-bold text-brand-text hover:underline">
          {dictionary.production} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
