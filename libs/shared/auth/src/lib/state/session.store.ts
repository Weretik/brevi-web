import { Injectable, computed, signal, inject } from '@angular/core';
import { BrowserStorageService } from '@shared/util';

export interface Session {
  accessToken: string | null;
}

const STORAGE_KEY = 'app.session.v1';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly storage = inject(BrowserStorageService);
  private readonly _session = signal<Session>(this.loadSession());

  readonly session = computed(() => this._session());
  readonly isAuthenticated = computed(() => !!this._session().accessToken);

  setAccessToken(token: string | null): void {
    const next: Session = { accessToken: token };
    this._session.set(next);
    this.saveSession(next);
  }

  clear(): void {
    this.setAccessToken(null);
  }

  private loadSession(): Session {
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (!raw) return { accessToken: null };
      const parsed = JSON.parse(raw) as Session;
      return { accessToken: parsed?.accessToken ?? null };
    } catch {
      return { accessToken: null };
    }
  }

  private saveSession(session: Session): void {
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // ignore storage failures
    }
  }
}
