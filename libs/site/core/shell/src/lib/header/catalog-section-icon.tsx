import {
  DropletsIcon,
  FootprintsIcon,
  GlassesIcon,
  HandIcon,
  LayoutGridIcon,
  ShirtIcon,
  SnowflakeIcon,
  SunIcon,
  WindIcon,
} from 'lucide-react';

import type { LucideIcon, LucideProps } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  summer: SunIcon,
  winter: SnowflakeIcon,
  knitwear: ShirtIcon,
  waterproof: DropletsIcon,
  shoes: FootprintsIcon,
  handProtection: HandIcon,
  eyeProtection: GlassesIcon,
  respiratory: WindIcon,
};

/** Icon of a catalog section by its key; a section without its own icon gets the catalog grid. */
export function CatalogSectionIcon({ sectionKey, ...props }: LucideProps & { sectionKey: string }) {
  const Icon = ICONS[sectionKey] ?? LayoutGridIcon;
  return <Icon aria-hidden strokeWidth={1.75} {...props} />;
}
