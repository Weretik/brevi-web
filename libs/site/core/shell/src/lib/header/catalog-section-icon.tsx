import { HardHatIcon, LayoutGridIcon, ShirtIcon } from 'lucide-react';

import type { LucideIcon, LucideProps } from 'lucide-react';

/** Icons by the slug of a catalog section. */
const ICONS: Record<string, LucideIcon> = {
  spetsodyah: ShirtIcon,
  'zasoby-zakhystu': HardHatIcon,
};

/** Icon of a catalog section by its key; a section without its own icon gets the catalog grid. */
export function CatalogSectionIcon({ sectionKey, ...props }: LucideProps & { sectionKey: string }) {
  const Icon = ICONS[sectionKey] ?? LayoutGridIcon;
  return <Icon aria-hidden strokeWidth={1.75} {...props} />;
}
