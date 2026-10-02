import { createContext, useContext } from 'react';

import type { PropsWithChildren } from 'react';

export type AdminShellLogoutAction = () => Promise<void>;

const AdminShellLogoutContext = createContext<AdminShellLogoutAction | null>(null);

export interface AdminShellSessionProviderProps extends PropsWithChildren {
  readonly onLogout: AdminShellLogoutAction;
}

export function AdminShellSessionProvider({ children, onLogout }: AdminShellSessionProviderProps) {
  return (
    <AdminShellLogoutContext.Provider value={onLogout}>{children}</AdminShellLogoutContext.Provider>
  );
}

export function useAdminShellLogout(): AdminShellLogoutAction | null {
  return useContext(AdminShellLogoutContext);
}
