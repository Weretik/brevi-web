import { describe, expect, it } from 'vitest';

import {
  seoSettingsInputOf,
  validateSeoSettings,
  verificationCode,
} from './seo-settings-validation';

const values = {
  googleAnalyticsId: ' g-abc1234 ',
  googleTagManagerId: '',
  googleSiteVerification: '<meta name="google-site-verification" content="abcDEF123_-xyz" />',
  bingSiteVerification: '',
  picture: null,
};

describe('seo settings form', () => {
  it('takes the code out of a pasted meta tag', () => {
    expect(verificationCode(values.googleSiteVerification)).toBe('abcDEF123_-xyz');
    expect(verificationCode(' 0123456789ABCDEF ')).toBe('0123456789ABCDEF');
  });

  it('accepts lower-case ids and sends them in upper case, empty fields as null', () => {
    expect(validateSeoSettings(values)).toEqual({});
    expect(seoSettingsInputOf(3, values)).toEqual({
      revision: 3,
      googleAnalyticsId: 'G-ABC1234',
      googleTagManagerId: null,
      googleSiteVerification: 'abcDEF123_-xyz',
      bingSiteVerification: null,
      defaultOgPhotoId: null,
    });
  });

  it('names the wrong code', () => {
    const errors = validateSeoSettings({
      ...values,
      googleAnalyticsId: 'UA-1234-1',
      googleTagManagerId: 'G-ABC1234',
    });
    expect(Object.keys(errors)).toEqual(['googleAnalyticsId', 'googleTagManagerId']);
  });
});
