import { inject, Injectable } from '@angular/core';

import { TokenProvider } from './token.provider';
import { SessionStore } from '../state/session.store';

@Injectable({ providedIn: 'root' })
export class SessionTokenProvider extends TokenProvider {
  private readonly session = inject(SessionStore);

  getAccessToken(): string | null {
    return this.session.session().accessToken;
  }
}
