import { configureApiClient, resetAdminApiState } from '@admin/shared/api-client';

import { setSessionState } from './session-store';
import { requestCurrentUser, requestLogin, requestLogout } from './session-transport';

import type { LoginRequest } from './session-transport';
import type { SessionUser } from './session-user';

/** Ends the local session: cached API data of the previous user is dropped. */
function endLocalSession(): void {
  resetAdminApiState();
  setSessionState({ status: 'anonymous' });
}

export async function login(request: LoginRequest): Promise<SessionUser> {
  const user = await requestLogin(request);
  resetAdminApiState();
  setSessionState({ status: 'authenticated', user });
  return user;
}

export async function logout(): Promise<void> {
  try {
    await requestLogout();
  } finally {
    endLocalSession();
  }
}

/**
 * Re-reads the signed-in user after they change their own name, email or photo, so the header
 * shows it. A failure leaves the current session as it is.
 */
export async function refreshSession(): Promise<void> {
  const user = await requestCurrentUser();
  setSessionState(user ? { status: 'authenticated', user } : { status: 'anonymous' });
}

/** Restores the session from the cookie; any API 401 later sends the user back to the login page. */
export async function initializeAdminAuth(): Promise<void> {
  configureApiClient({ authSession: { onUnauthenticated: endLocalSession } });

  try {
    const user = await requestCurrentUser();
    setSessionState(user ? { status: 'authenticated', user } : { status: 'anonymous' });
  } catch {
    // The API is unreachable; the login page shows the error on the next attempt.
    setSessionState({ status: 'anonymous' });
  }
}
