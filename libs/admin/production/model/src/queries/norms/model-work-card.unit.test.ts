import { describe, expect, it } from 'vitest';

import { compositionRest, fabricNormVariants, forBatch, parseBatchSize } from './model-work-card';

const norm = {
  oneColor: 2.5,
  twoColorsMain: 2.2,
  twoColorsAdditional: 0.3,
  threeColorsMain: null,
  threeColorsAdditional1: null,
  threeColorsAdditional2: null,
};

describe('fabricNormVariants', () => {
  it('puts each fabric of a variant on its own line with the total', () => {
    const [one, two, three] = fabricNormVariants({ norm });
    expect(one.parts).toEqual([{ label: 'Основна', meters: 2.5 }]);
    expect(one.total).toBeNull();
    expect(two.parts).toEqual([
      { label: 'Основна', meters: 2.2 },
      { label: 'Додаткова', meters: 0.3 },
    ]);
    expect(two.total).toBe(2.5);
    expect(three.parts).toEqual([]);
  });

  it('gives empty variants when the model has no norm', () => {
    expect(fabricNormVariants({ norm: null }).every((variant) => variant.parts.length === 0)).toBe(
      true,
    );
  });
});

describe('compositionRest', () => {
  it('leaves out lining, insulation and fleece shown as layers', () => {
    const line = (kind: 'Fabric' | 'Accessory', code: string) => ({
      kind,
      code,
      article: null,
      name: null,
      quantity: 1,
      unit: 'Metre' as const,
      comment: null,
    });
    const rest = compositionRest({
      layers: [{ purpose: 'Підкладка', code: 'FUR-021', name: null, quantity: 1.9, unit: 'Metre' }],
      lines: [
        line('Fabric', 'FAB-023'),
        line('Accessory', 'FUR-021'),
        line('Accessory', 'FUR-004'),
      ],
    });
    expect(rest.map((item) => item.code)).toEqual(['FAB-023', 'FUR-004']);
  });
});

describe('batch', () => {
  it('reads a whole number of items', () => {
    expect(parseBatchSize(' 40 ')).toBe(40);
    expect(parseBatchSize('0')).toBeNull();
    expect(parseBatchSize('2,5')).toBeNull();
    expect(parseBatchSize('')).toBeNull();
  });

  it('multiplies without float noise', () => {
    expect(forBatch(0.1, 3)).toBe(0.3);
    expect(forBatch(2.5, 40)).toBe(100);
  });
});
