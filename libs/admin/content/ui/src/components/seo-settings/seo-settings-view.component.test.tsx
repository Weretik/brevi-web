import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { SeoSettingsView, sharingPictureProblem } from './seo-settings-view';

afterEach(cleanup);

const picture = (width: number | null, height: number | null) => ({
  photoId: 1,
  url: 'https://cdn.example/og.jpg',
  width,
  height,
});

describe('SeoSettingsView', () => {
  it('shows each service code as a tile and names the empty ones', () => {
    render(
      <SeoSettingsView
        settings={{
          googleAnalyticsId: 'G-ABC123',
          googleTagManagerId: null,
          googleSiteVerification: 'verify-google',
          bingSiteVerification: null,
          defaultOgImage: null,
          revision: 1,
          updatedAtUtc: null,
          updatedBy: null,
        }}
      />,
    );
    expect(screen.getByText('G-ABC123')).toBeTruthy();
    expect(screen.getByText('verify-google')).toBeTruthy();
    expect(screen.getAllByText('Не вказано')).toHaveLength(2);
    expect(screen.getByText('Не обрано: посилання поширюються без картинки.')).toBeTruthy();
  });

  it('marks only a sharing picture that is too small', () => {
    expect(sharingPictureProblem(picture(1200, 630))).toBeNull();
    expect(sharingPictureProblem(picture(null, null))).toBeNull();
    expect(sharingPictureProblem(picture(800, 600))).toContain('800 × 600');
  });
});
