import type { SvgIconComponent } from '@mui/icons-material';

export type AdminColorMode = 'light' | 'dark' | 'system';

export interface AdminNavigationItem {
  id: string;
  label: string;
  /** Route of an implemented page. Without it the item is shown as unavailable. */
  to?: string;
}

/** The signed-in staff member as the header shows them; the app maps it from the session. */
export interface AdminShellUser {
  email: string;
  fullName: string;
  /** Role in Ukrainian, for example «Адміністратор». */
  roleLabel: string;
  avatarUrl: string | null;
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
