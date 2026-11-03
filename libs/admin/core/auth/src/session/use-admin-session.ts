import { useSyncExternalStore } from 'react';

import { getSessionState, subscribeToSession } from './session-store';

import type { SessionState } from './session-store';

export const useAdminSession = (): SessionState =>
  useSyncExternalStore(subscribeToSession, getSessionState, getSessionState);
