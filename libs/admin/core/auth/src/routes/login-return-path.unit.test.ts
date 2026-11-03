import { describe, expect, it } from 'vitest';

import { buildLoginPath, readReturnPath } from './login-return-path';

describe('login return path', () => {
  it('keeps the page the session ended on', () => {
    const loginUrl = buildLoginPath('/orders/15?tab=lines');

    expect(readReturnPath(loginUrl.slice(loginUrl.indexOf('?')), '/')).toBe('/orders/15?tab=lines');
  });

  it('does not add a return path for the root or the login page', () => {
    expect(buildLoginPath('/')).toBe('/login');
    expect(buildLoginPath('/login?returnTo=%2Fx')).toBe('/login');
  });

  it.each(['https://evil.example', '//evil.example', '/\\evil.example'])(
    'rejects an external target %s',
    (target) => {
      expect(readReturnPath(`?returnTo=${encodeURIComponent(target)}`, '/')).toBe('/');
    },
  );
});
