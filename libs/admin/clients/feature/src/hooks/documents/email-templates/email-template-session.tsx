import { createContext, useContext } from 'react';

/** App composition supplies current server roles without a feature-to-core dependency. */
export interface EmailTemplateSession {
  readonly currentData?: readonly string[];
  readonly isLoading?: boolean;
  readonly isFetching?: boolean;
  readonly error?: unknown;
  readonly refetch: () => unknown;
}

const EmailTemplateSessionContext = createContext<EmailTemplateSession>({
  currentData: [],
  refetch: () => undefined,
});
export const EmailTemplateSessionProvider = EmailTemplateSessionContext.Provider;
export function useEmailTemplateSession() {
  return useContext(EmailTemplateSessionContext);
}
