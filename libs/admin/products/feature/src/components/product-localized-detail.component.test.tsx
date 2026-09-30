import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProductCharacteristicsDetail } from './product-characteristics-detail';
import { ProductInformationDetail } from './product-information-detail';

describe('localized product sections', () => {
  it('shows both languages in information block order', () => {
    const { container } = render(
      <ProductInformationDetail
        blocks={[
          {
            titleUk: 'Другий',
            titleRu: 'Второй',
            textUk: 'Текст 2',
            textRu: 'Текст RU 2',
            sortOrder: 2,
          },
          {
            titleUk: 'Перший',
            titleRu: 'Первый',
            textUk: 'Текст 1',
            textRu: 'Текст RU 1',
            sortOrder: 1,
          },
        ]}
      />,
    );
    expect(screen.getByText('Російська: Первый')).toBeTruthy();
    expect(container.textContent?.indexOf('Перший')).toBeLessThan(
      container.textContent?.indexOf('Другий') ?? 0,
    );
  });

  it('shows both languages and orders characteristic rows', () => {
    const { container } = render(
      <ProductCharacteristicsDetail
        tables={[
          {
            titleUk: 'Розмір',
            titleRu: 'Размер',
            sortOrder: 0,
            rows: [
              { labelUk: 'Другий', labelRu: 'Второй', valueUk: 'Б', valueRu: 'Б', sortOrder: 2 },
              { labelUk: 'Перший', labelRu: 'Первый', valueUk: 'А', valueRu: 'А', sortOrder: 1 },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByText('Російська: Размер')).toBeTruthy();
    expect(screen.getByText('Первый: А')).toBeTruthy();
    expect(container.textContent?.indexOf('Перший')).toBeLessThan(
      container.textContent?.indexOf('Другий') ?? 0,
    );
  });
});
