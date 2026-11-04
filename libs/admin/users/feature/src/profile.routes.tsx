import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const ProfilePage = lazy(() => import('./pages/profile-page'));

export const profilePath = '/profile';

export interface ProfileRouteOptions {
  /** Re-reads the session after a change, so the header shows the new name or photo. */
  onProfileChanged: () => Promise<void>;
}

/** «Мій кабінет» is open to every staff role. */
export function createProfileRoutes({ onProfileChanged }: ProfileRouteOptions): RouteObject[] {
  return [{ path: profilePath, element: <ProfilePage onProfileChanged={onProfileChanged} /> }];
}
