import { EmailTemplateSessionProvider } from '@admin/clients/feature';
import { useGetAdminSessionRolesQuery } from '@admin/core/auth';

import type { ReactNode } from 'react';

/** The app composes core session state into the CRM feature without a feature-to-core dependency. */
export function EmailTemplateAccess({ children }: { children: ReactNode }) {
  const session = useGetAdminSessionRolesQuery();
  return (
    <EmailTemplateSessionProvider
      value={{
        currentData: session.currentData,
        isLoading: session.isLoading,
        isFetching: session.isFetching,
        error: session.error,
        refetch: () => session.refetch(),
      }}
    >
      {children}
    </EmailTemplateSessionProvider>
  );
}
