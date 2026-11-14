import { describe, expect, it } from 'vitest';

import { companyMapUrl, managerPhotoSrc } from './company-links';

describe('company links', () => {
  it('opens the address in Google Maps', () => {
    expect(companyMapUrl('Дніпро, Робоча 1')).toBe(
      'https://www.google.com/maps/search/?api=1&query=%D0%94%D0%BD%D1%96%D0%BF%D1%80%D0%BE%2C%20%D0%A0%D0%BE%D0%B1%D0%BE%D1%87%D0%B0%201',
    );
  });

  it('shows only a manager photo from the media library', () => {
    expect(managerPhotoSrc('https://cdn.brevi.com.ua/a.jpg')).toBe(
      'https://cdn.brevi.com.ua/a.jpg',
    );
    expect(managerPhotoSrc('/images/a.jpg')).toBeUndefined();
    expect(managerPhotoSrc(null)).toBeUndefined();
  });
});
