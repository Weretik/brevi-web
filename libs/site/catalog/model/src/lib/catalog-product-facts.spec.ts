import { splitCatalogProductFacts } from './catalog-product-facts';

describe('product short facts', () => {
  it('turns bold labels and typed labels into rows, short lines into tags, and finds the audience', () => {
    const facts = splitCatalogProductFacts([
      {
        type: 'paragraph',
        lead: 'Підходить для професій:',
        text: 'працівників **складів** і водіїв',
      },
      { type: 'paragraph', text: 'Чоловіча / жіноча' },
      { type: 'paragraph', text: 'Сезон : Зима, Весна, Осінь від -20С до + 5С' },
      { type: 'paragraph', text: 'Можливо зробити з тканини іншого кольору.' },
      { type: 'heading', text: 'Деталі' },
    ]);

    expect(facts.tags).toEqual(['Чоловіча / жіноча']);
    expect(facts.rows).toEqual([
      { name: 'Підходить для професій', value: 'працівників складів і водіїв' },
      { name: 'Сезон', value: 'Зима, Весна, Осінь від -20С до + 5С' },
    ]);
    expect(facts.audience).toEqual({
      name: 'Підходить для професій',
      value: 'працівників складів і водіїв',
    });
    expect(facts.notes).toEqual(['Можливо зробити з тканини іншого кольору.']);
  });

  it('gives nothing for a product without facts', () => {
    expect(splitCatalogProductFacts([])).toEqual({ tags: [], rows: [], audience: null, notes: [] });
  });
});
