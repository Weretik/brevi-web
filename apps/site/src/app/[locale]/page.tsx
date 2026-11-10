import { COMPANY } from '@site/core/config';
import { isLocale } from '@site/core/i18n';
import {
  JsonLd,
  buildLocalBusinessJsonLd,
  buildPageMetadata,
  buildWebSiteJsonLd,
} from '@site/core/seo';
import { StitchLabel } from '@site/shared/ui';
import { notFound } from 'next/navigation';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

// Temporary first screen of migration step 1 (site shell). The home step replaces this file's content with
// the `site-home-*` libraries; only the route and its structured data stay.
// A page in the layout's own segment does not get the layout title template, so the brand is written out.
const TEXT: Record<
  Locale,
  { title: string; description: string; label: string; heading: string; lead: string }
> = {
  uk: {
    title: 'Пошиття спецодягу з логотипом від виробника — Brevi',
    description:
      'Brevi шиє спецодяг з логотипом вашої компанії на власному виробництві в Полтаві. Робочі костюми, куртки, футболки і поло оптом від 5 штук, з ПДВ.',
    label: 'Шиємо самі',
    heading: 'Шиємо спецодяг з логотипом вашої компанії',
    lead: 'Робочі костюми, куртки, футболки і поло для підприємств, агросектору та нафтогазового комплексу. Від 5 штук, найвигідніше — від 40.',
  },
  ru: {
    title: 'Пошив спецодежды с логотипом от производителя — Brevi',
    description:
      'Brevi шьёт спецодежду с логотипом вашей компании на собственном производстве в Полтаве. Рабочие костюмы, куртки, футболки и поло оптом от 5 штук, с НДС.',
    label: 'Шьём сами',
    heading: 'Шьём спецодежду с логотипом вашей компании',
    lead: 'Рабочие костюмы, куртки, футболки и поло для предприятий, агросектора и нефтегазового комплекса. От 5 штук, выгоднее всего — от 40.',
  },
};

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { title, description } = TEXT[locale];
  return buildPageMetadata({ locale, path: '/', title, description });
}

export default async function Page({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const text = TEXT[locale];
  const [salesPhone] = COMPANY.phones;

  return (
    <section className="grid max-w-2xl gap-5 py-12 sm:py-16">
      <StitchLabel index="01">{text.label}</StitchLabel>
      <h1 className="text-[2.125rem] leading-[1.06] font-extrabold tracking-[-0.025em] sm:text-[3.125rem]">
        {text.heading}
      </h1>
      <p className="text-lg leading-relaxed text-muted-foreground">{text.lead}</p>
      <a href={`tel:${salesPhone.e164}`} className="font-mono text-xl font-semibold">
        {salesPhone.display}
      </a>
      <JsonLd data={[buildWebSiteJsonLd(locale), buildLocalBusinessJsonLd(locale)]} />
    </section>
  );
}
