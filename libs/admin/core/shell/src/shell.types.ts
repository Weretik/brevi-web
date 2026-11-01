import type { SvgIconComponent } from '@mui/icons-material';

export type AdminColorMode = 'light' | 'dark' | 'system';

export interface AdminNavigationItem {
  id: string;
  label: string;
  /** Route of an implemented page. Without it the item is shown as unavailable. */
  to?: string;
}

/** A link in the profile menu, for example legal or about pages outside the SPA. */
export interface AdminProfileLink {
  label: string;
  href: string;
}

export interface AdminNavigationGroup {
  id: string;
  label: string;
  /** Icon shown before the label and alone when the sidebar is collapsed. */
  icon?: SvgIconComponent;
  /** Sidebar section heading; consecutive groups with the same value share one heading. */
  section?: string;
  items: readonly AdminNavigationItem[];
}
