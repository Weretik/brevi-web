import { Injectable, computed, signal } from '@angular/core';

export interface Session {
  accessToken: string | null;
}

const STORAGE_KEY = 'app.session.v1';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly _session = signal<Session>(loadSession());

  readonly session = computed(() => this._session());
  readonly isAuthenticated = computed(() => !!this._session().accessToken);

  setAccessToken(token: string | null): void {
    const next: Session = { accessToken: token };
    this._session.set(next);
    saveSession(next);
  }

  clear(): void {
    this.setAccessToken(null);
  }
}

function loadSession(): Session {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { accessToken: null };
    const parsed = JSON.parse(raw) as Session;
    return { accessToken: parsed?.accessToken ?? null };
  } catch {
    return { accessToken: null };
  }
}

function saveSession(session: Session): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore storage failures
  }
}
