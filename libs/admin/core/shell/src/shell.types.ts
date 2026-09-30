export type AdminColorMode = 'light' | 'dark' | 'system';

export interface AdminNavigationItem {
  id: string;
  label: string;
  to?: string;
}

export interface AdminNavigationGroup {
  id: string;
  label: string;
  items: readonly AdminNavigationItem[];
}
