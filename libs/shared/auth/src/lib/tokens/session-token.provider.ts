import { inject, Injectable } from '@angular/core';

import { TokenProvider } from '../interceptors/auth.interceptor';
import { SessionStore } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class SessionTokenProvider extends TokenProvider {
  private readonly session = inject(SessionStore);

  getAccessToken(): string | null {
    return this.session.session().accessToken;
  }
}
