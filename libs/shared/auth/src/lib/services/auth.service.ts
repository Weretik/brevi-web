import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { AuthApi, LoginRequest } from '../data-access/auth.api';
import { SessionStore } from '../state/session.store';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(AuthApi);
  private readonly session = inject(SessionStore);

  login(req: LoginRequest) {
    return this.api.login(req).pipe(tap((res) => this.session.setAccessToken(res.accessToken)));
  }

  logout() {
    return this.api.logout().pipe(tap(() => this.session.clear()));
  }

  forceLogout(): void {
    this.session.clear();
  }
}
