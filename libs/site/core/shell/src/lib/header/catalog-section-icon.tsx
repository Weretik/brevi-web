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
  TreesIcon,
  TriangleAlertIcon,
  WindIcon,
} from 'lucide-react';

import type { LucideIcon, LucideProps } from 'lucide-react';

/** Icons by the slug of a catalog section. */
const ICONS: Record<string, LucideIcon> = {
  'specodyag-litnij': SunIcon,
  'specodyag-zymovyj': SnowflakeIcon,
  'futbolky-polo-flisovyj-odyag': ShirtIcon,
  'kamuflyazhnyj-odyag': TreesIcon,
  'sygnalnyj-odyag': TriangleAlertIcon,
  'odyag-dlya-zvaryuvalnykiv': FlameIcon,
  'odyag-vologozahysnyj': DropletsIcon,
  'roboche-vzuttya': FootprintsIcon,
  'zahyst-ruk': HandIcon,
  'zahyst-ochej': GlassesIcon,
  'zahyst-organiv-dyhannya': WindIcon,
  'kasky-kepky': HardHatIcon,
  'gotovi-rishennya': PackageCheckIcon,
};

/** Icon of a catalog section by its key; a section without its own icon gets the catalog grid. */
export function CatalogSectionIcon({ sectionKey, ...props }: LucideProps & { sectionKey: string }) {
  const Icon = ICONS[sectionKey] ?? LayoutGridIcon;
  return <Icon aria-hidden strokeWidth={1.75} {...props} />;
}
