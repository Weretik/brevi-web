import { configureApiClient, resetAdminApiState } from '@admin/shared/api-client';

import { getAccessToken, setAccessToken } from './session-state';
import { requestAccessTokenRefresh, requestLogin, requestLogout } from './session-transport';

import type { LoginRequest } from './session-transport';

async function refreshAccessToken(): Promise<string> {
  const nextAccessToken = await requestAccessTokenRefresh();
  setAccessToken(nextAccessToken);
  return nextAccessToken;
}

function clearLocalSession(): void {
  setAccessToken(null);
  resetAdminApiState();
}

export async function login(request: LoginRequest): Promise<void> {
  const nextAccessToken = await requestLogin(request);
  setAccessToken(nextAccessToken);
}

export async function logout(): Promise<void> {
  const accessToken = getAccessToken();

  try {
    if (accessToken) await requestLogout(accessToken);
  } finally {
    clearLocalSession();
  }
}

export async function initializeAdminAuth(): Promise<void> {
  configureApiClient({
    authSession: {
      getAccessToken,
      refreshAccessToken,
      onUnauthenticated: clearLocalSession,
    },
  });

  try {
    await refreshAccessToken();
  } catch {
    clearLocalSession();
  }
}
