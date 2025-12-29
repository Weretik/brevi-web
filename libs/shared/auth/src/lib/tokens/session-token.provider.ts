import { inject, Injectable } from '@angular/core';
import { TokenProvider } from '@shared/auth';
import { SessionStore } from '@shared/auth';

@Injectable({ providedIn: 'root' })
export class SessionTokenProvider extends TokenProvider {
  private readonly session = inject(SessionStore);

  getAccessToken(): string | null {
    return this.session.session().accessToken;
  }
}
