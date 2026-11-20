import { cityPagePath } from './site-paths';

describe('city page paths', () => {
  it('puts each kind of city page under its own root', () => {
    expect(cityPagePath('sewing', 'kharkiv')).toBe('/sewing/kharkiv');
    expect(cityPagePath('workwear', 'bila-tserkva')).toBe('/workwear/bila-tserkva');
  });
});
