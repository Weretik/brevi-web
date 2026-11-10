import { LOCALE_LANGUAGE_TAGS, localizedPath } from '@site/core/i18n';
import { Button, StitchLabel } from '@site/shared/ui';
import Link from 'next/link';

import { SHELL_PATHS } from '../navigation/site-navigation';

import type { Locale } from '@site/core/i18n';

const TEXT: Record<
  Locale,
  { label: string; heading: string; body: string; home: string; catalog: string }
> = {
  uk: {
    label: 'Немає такої сторінки',
    heading: 'Сторінку не знайдено',
    body: 'Можливо, її видалили або адреса введена з помилкою.',
    home: 'На головну',
    catalog: 'До каталогу',
  },
  ru: {
    label: 'Нет такой страницы',
    heading: 'Страница не найдена',
    body: 'Возможно, её удалили или адрес введён с ошибкой.',
    home: 'На главную',
    catalog: 'В каталог',
  },
};

/** Not-found message with links to the home page and the catalog; used by both app 404 files. */
export function NotFoundView({
  locale,
  headingLevel = 'h1',
}: {
  locale: Locale;
  headingLevel?: 'h1' | 'h2';
}) {
  const text = TEXT[locale];
  const Heading = headingLevel;

  return (
    <section className="py-14" lang={LOCALE_LANGUAGE_TAGS[locale]}>
      <StitchLabel index="404">{text.label}</StitchLabel>
      <Heading className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {text.heading}
      </Heading>
      <p className="mt-3 text-muted-foreground">{text.body}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <Link href={localizedPath(locale)}>{text.home}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={localizedPath(locale, SHELL_PATHS.catalog)}>{text.catalog}</Link>
        </Button>
      </div>
    </section>
  );
}
