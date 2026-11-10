import { Breadcrumbs, StitchLabel } from '@site/shared/ui';

import type { DeliveryDictionary } from '../i18n/delivery-dictionary';
import type { BreadcrumbItem } from '@site/shared/ui';

/** Page head: breadcrumbs, stitch label, `h1`, and one lead sentence. */
export function DeliveryHero({
  dictionary,
  breadcrumbs,
}: {
  dictionary: DeliveryDictionary;
  breadcrumbs: readonly BreadcrumbItem[];
}) {
  return (
    <section className="grid gap-8 pt-6 sm:pt-8">
      <Breadcrumbs items={breadcrumbs} label={dictionary.breadcrumbsLabel} />
      <div className="grid gap-5">
        <StitchLabel index="01">{dictionary.label}</StitchLabel>
        <h1 className="text-[2rem] leading-[1.08] font-extrabold tracking-[-0.025em] sm:text-[2.75rem]">
          {dictionary.title}
        </h1>
        <p className="max-w-[44rem] text-lg leading-relaxed text-muted-foreground">
          {dictionary.lead}
        </p>
      </div>
    </section>
  );
}
