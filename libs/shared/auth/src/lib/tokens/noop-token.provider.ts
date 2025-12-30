import { Injectable } from '@angular/core';

import { TokenProvider } from './token.provider';

@Injectable({ providedIn: 'root' })
export class NoopTokenProvider extends TokenProvider {
  getAccessToken(): string | null {
    return null;
  }
}
