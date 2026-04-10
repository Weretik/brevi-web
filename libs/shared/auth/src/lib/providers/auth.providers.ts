import { Provider } from '@angular/core';

import { SessionTokenProvider } from '../tokens/session-token.provider';
import { TokenProvider } from '../tokens/token.provider';

export function provideSessionTokenAuth(): Provider[] {
  return [{ provide: TokenProvider, useClass: SessionTokenProvider }];
}
