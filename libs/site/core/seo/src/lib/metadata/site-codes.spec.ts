import { describe, expect, it } from 'vitest';

import {
  analyticsId,
  buildVerificationMetadata,
  tagManagerId,
  withSharePicture,
} from './site-codes';

const empty = {
  googleAnalyticsId: null,
  googleTagManagerId: null,
  googleSiteVerification: null,
  bingSiteVerification: null,
};

describe('site codes', () => {
  it('lets only ids of the Google shape reach a script', () => {
    expect(analyticsId('G-AB12CD34EF')).toBe('G-AB12CD34EF');
    expect(analyticsId("G-1');alert(1)//")).toBeNull();
    expect(tagManagerId('GTM-AB12CD3')).toBe('GTM-AB12CD3');
    expect(tagManagerId('G-AB12CD34EF')).toBeNull();
  });

  it('places the Google and Bing verification tags', () => {
    expect(buildVerificationMetadata(empty)).toBeUndefined();
    expect(
      buildVerificationMetadata({
        ...empty,
        googleSiteVerification: 'abcDEF_123-xyz',
        bingSiteVerification: '0123456789ABCDEF',
      }),
    ).toEqual({ google: 'abcDEF_123-xyz', other: { 'msvalidate.01': '0123456789ABCDEF' } });
    expect(
      buildVerificationMetadata({ ...empty, googleSiteVerification: '"><script>' }),
    ).toBeUndefined();
  });

  it('adds the sharing picture only to pages without their own', () => {
    const picture = { url: 'https://cdn.test/share.jpg', width: 1200, height: 630 };
    const page = { title: 'A', openGraph: { title: 'A' } };
    expect(withSharePicture(page, picture).openGraph?.images).toEqual([
      { url: 'https://cdn.test/share.jpg', width: 1200, height: 630 },
    ]);
    const own = { openGraph: { images: [{ url: 'https://cdn.test/own.jpg' }] } };
    expect(withSharePicture(own, picture)).toBe(own);
    expect(withSharePicture(page, null)).toBe(page);
  });
});
