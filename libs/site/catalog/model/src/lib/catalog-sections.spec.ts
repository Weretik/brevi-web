import { CATALOG_SECTIONS } from './catalog-sections';

describe('catalog sections', () => {
  it('lists eight sections with unique keys and both languages', () => {
    expect(CATALOG_SECTIONS).toHaveLength(8);
    const keys = CATALOG_SECTIONS.flatMap((section) => [
      section.key,
      ...section.items.map((item) => item.key),
    ]);
    expect(new Set(keys).size).toBe(keys.length);

    for (const section of CATALOG_SECTIONS) {
      expect(section.items.length).toBeGreaterThan(0);
      for (const { label } of [section, ...section.items]) {
        expect(label.uk.trim()).not.toBe('');
        expect(label.ru.trim()).not.toBe('');
      }
    }
  });
});
