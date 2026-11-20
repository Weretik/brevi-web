import { BILA_TSERKVA } from '../texts/centre/bila-tserkva';
import { CHERNIHIV } from '../texts/centre/chernihiv';
import { KYIV } from '../texts/centre/kyiv';
import { VINNYTSIA } from '../texts/centre/vinnytsia';
import { ZHYTOMYR } from '../texts/centre/zhytomyr';
import { KHARKIV } from '../texts/east/kharkiv';
import { POLTAVA } from '../texts/east/poltava';
import { SUMY } from '../texts/east/sumy';
import { MYKOLAIV } from '../texts/south/mykolaiv';
import { ODESA } from '../texts/south/odesa';
import { DNIPRO } from '../texts/south-east/dnipro';
import { KRYVYI_RIH } from '../texts/south-east/kryvyi-rih';
import { ZAPORIZHZHIA } from '../texts/south-east/zaporizhzhia';

import type { CityPageKind, Locale } from '@site/core/i18n';

/** What one city page says in one language; the blocks shared by all cities are in the page dictionary. */
export type CityPageText = {
  /** `<title>` without « — Brevi» (the layout adds it), at most 52 characters, unique on the site. */
  title: string;
  /** Meta description, 110–160 characters, unique on the site. */
  description: string;
  /** Two paragraphs written for this city and this kind of page. */
  intro: readonly string[];
  /** Three kinds of work in the city and what to wear for them. */
  needs: readonly { title: string; text: string }[];
  /** Three questions a buyer from this city asks, shown and marked up as `FAQPage`. */
  faq: readonly { question: string; answer: string }[];
};

/** Both kinds of page of a city in both languages. */
export type CityTexts = Record<CityPageKind, Record<Locale, CityPageText>>;

const TEXTS: Record<string, CityTexts> = {
  kyiv: KYIV,
  kharkiv: KHARKIV,
  dnipro: DNIPRO,
  odesa: ODESA,
  zaporizhzhia: ZAPORIZHZHIA,
  'kryvyi-rih': KRYVYI_RIH,
  mykolaiv: MYKOLAIV,
  vinnytsia: VINNYTSIA,
  poltava: POLTAVA,
  chernihiv: CHERNIHIV,
  zhytomyr: ZHYTOMYR,
  sumy: SUMY,
  'bila-tserkva': BILA_TSERKVA,
};

/** The text of a city page; the city must be one of `CITIES` (the route answers 404 for the rest). */
export function cityText(kind: CityPageKind, citySlug: string, locale: Locale): CityPageText {
  const texts = TEXTS[citySlug];
  if (!texts) throw new Error(`No texts for the city «${citySlug}».`);
  return texts[kind][locale];
}
