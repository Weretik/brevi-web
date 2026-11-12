import {
  DropletsIcon,
  FlameIcon,
  FootprintsIcon,
  GlassesIcon,
  HandIcon,
  HardHatIcon,
  LayoutGridIcon,
  PackageCheckIcon,
  ShirtIcon,
  SnowflakeIcon,
  SunIcon,
  TrafficConeIcon,
  TreePineIcon,
  WindIcon,
} from 'lucide-react';

import type { LucideIcon, LucideProps } from 'lucide-react';

/**
 * Icons of the top-level categories by their slug in «Контент → Розділи сайту». A category staff add later
 * gets the catalog grid until it has its own icon here.
 */
const ICONS: Record<string, LucideIcon> = {
  'specodyag-litnij': SunIcon,
  'specodyag-zymovyj': SnowflakeIcon,
  'futbolky-polo-flisovyj-odyag': ShirtIcon,
  'kamuflyazhnyj-odyag': TreePineIcon,
  'sygnalnyj-odyag': TrafficConeIcon,
  'odyag-dlya-zvaryuvalnykiv': FlameIcon,
  'odyag-vologozahysnyj': DropletsIcon,
  'roboche-vzuttya': FootprintsIcon,
  'zahyst-ruk': HandIcon,
  'zahyst-ochej': GlassesIcon,
  'zahyst-organiv-dyhannya': WindIcon,
  'kasky-kepky': HardHatIcon,
  'gotovi-rishennya': PackageCheckIcon,
};

/** Icon of a catalog category by its slug; decorative, the name is always written next to it. */
export function CatalogCategoryIcon({ slug, ...props }: LucideProps & { slug: string }) {
  const Icon = ICONS[slug] ?? LayoutGridIcon;
  return <Icon aria-hidden strokeWidth={1.75} {...props} />;
}
