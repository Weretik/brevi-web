import { CITIES, findCity } from './city-list';
import { citySections } from './city-sections';

describe('city list', () => {
  it('has the 13 cities of the old site, each with unique slug and three neighbours from the list', () => {
    const slugs = CITIES.map((city) => city.slug);
    expect(slugs).toHaveLength(13);
    expect(new Set(slugs).size).toBe(13);
    for (const city of CITIES) {
      expect(city.slug).toMatch(/^[a-z]+(-[a-z]+)*$/);
      expect(city.neighbours).toHaveLength(3);
      expect(city.neighbours).not.toContain(city.slug);
      for (const neighbour of city.neighbours) expect(slugs).toContain(neighbour);
    }
  });

  it('finds a city by slug and nothing for other places', () => {
    expect(findCity('kharkiv')?.name.uk).toBe('Харків');
    expect(findCity('kharkiv')?.locative.ru).toBe('в Харькове');
    expect(findCity('lviv')).toBeUndefined();
  });

  it('gives the catalog menu two sections with every city as a subsection', () => {
    const [sewing, workwear] = citySections();

    expect(sewing.label.uk).toBe('Пошиття');
    expect(workwear.label.uk).toBe('Робочий одяг');
    expect(sewing.path).toBe('/regions');
    expect(sewing.items).toHaveLength(13);
    expect(sewing.items[0]).toMatchObject({ label: { uk: 'Київ' }, path: '/sewing/kyiv' });
    expect(workwear.items[1]).toMatchObject({ path: '/workwear/kharkiv' });
  });
});
