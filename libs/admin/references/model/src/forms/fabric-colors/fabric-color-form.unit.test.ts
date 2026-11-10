import { describe, expect, it } from 'vitest';

import { createFabricColorFormValues, fabricColorBody } from './fabric-color-form';
import { filterFabricColors } from '../../queries/fabric-colors/fabric-color-filters';
import { validateFabricColor } from '../../validators/fabric-colors/fabric-color-validation';

describe('fabric colour form', () => {
  it('starts active and trims the name in the body', () => {
    const values = createFabricColorFormValues(null);
    expect(values).toEqual({ name: '', isActive: true });
    expect(fabricColorBody({ name: '  Вафля ', isActive: false }, 62)).toEqual({
      name: 'Вафля',
      isActive: false,
      sortOrder: 62,
    });
  });

  it('needs a name and rejects the same colour with other case or spaces', () => {
    expect(validateFabricColor({ name: ' ', isActive: true }).name).toBe('Вкажіть назву кольору.');
    expect(validateFabricColor({ name: 'я'.repeat(81), isActive: true }).name).toContain('80');
    expect(
      validateFabricColor({ name: 'світло - сірий', isActive: true }, [{ name: 'Світло-сірий' }])
        .name,
    ).toBe('Такий колір уже є в довіднику.');
    expect(validateFabricColor({ name: 'Хакі', isActive: true }, [{ name: 'Тайга' }])).toEqual({});
  });

  it('searches by name', () => {
    const rows = [
      { id: 1, name: 'Чорний', isActive: true, sortOrder: 1 },
      { id: 2, name: 'Темно-синій кол.1076', isActive: true, sortOrder: 2 },
    ];
    expect(filterFabricColors(rows, '1076').map((row) => row.id)).toEqual([2]);
    expect(filterFabricColors(rows, '')).toHaveLength(2);
  });
});
