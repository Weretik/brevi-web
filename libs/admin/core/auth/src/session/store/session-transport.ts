import { apiClient, apiRequest, isAdminApiError } from '@admin/shared/api-client';

import type { SessionAccess, SessionUser } from './session-user';
import type { operations } from '@admin/shared/contracts';

export type LoginRequest =
  operations['loginCookieSession']['requestBody']['content']['application/json'];
type SessionUserResponse =
  operations['getCurrentSession']['responses'][200]['content']['application/json'];

type SessionAccessResponse =
  operations['getSessionAccess']['responses'][200]['content']['application/json'];

const toSessionAccess = (response: SessionAccessResponse): SessionAccess => ({
  allowAll: response.allowAll,
  roles: response.roles,
  // The server sends only the four actions of «Права доступу».
  grants: response.grants as SessionAccess['grants'],
});

/** What the signed-in user may open and do, per page of «Права доступу». */
const requestAccess = (): Promise<SessionAccess> =>
  apiRequest(apiClient.GET('/api/auth/session/access'), toSessionAccess);

const toSessionUser = (response: SessionUserResponse, access: SessionAccess): SessionUser => ({
  id: response.userId,
  email: response.email,
  fullName: response.fullName,
  roles: response.roles,
  avatarUrl: response.avatarUrl ?? null,
  access,
});

/** Signs in with the HttpOnly session cookie. Throws the `ApiError` on 401 or 429. */
export const requestLogin = async (request: LoginRequest): Promise<SessionUser> => {
  const user = await apiRequest(apiClient.POST('/api/auth/cookie/login', { body: request }));

  return toSessionUser(user, await requestAccess());
};

/** The CSRF header is added by the client, as on every request that changes data. */
export const requestLogout = async (): Promise<void> => {
  await apiRequest(apiClient.POST('/api/auth/cookie/logout'));
};

/** Returns the signed-in user, or null when there is no valid session cookie. */
export const requestCurrentUser = async (): Promise<SessionUser | null> => {
  try {
    const user = await apiRequest(apiClient.GET('/api/auth/session/me'));

    return toSessionUser(user, await requestAccess());
  } catch (error) {
    if (isAdminApiError(error) && error.status === 401) {
      return null;
    }

    throw error;
  }
};
