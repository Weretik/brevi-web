import type { SessionUser } from './session-user';

export type SessionState =
  { status: 'loading' } | { status: 'anonymous' } | { status: 'authenticated'; user: SessionUser };

let state: SessionState = { status: 'loading' };
const listeners = new Set<() => void>();

export const getSessionState = (): SessionState => state;

export const setSessionState = (nextState: SessionState): void => {
  state = nextState;
  listeners.forEach((listener) => listener());
};

export const subscribeToSession = (listener: () => void): (() => void) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};
