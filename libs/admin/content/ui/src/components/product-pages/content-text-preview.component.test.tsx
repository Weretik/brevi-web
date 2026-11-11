import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ContentTextPreview } from './content-text-preview';

afterEach(cleanup);

describe('ContentTextPreview', () => {
  it('lays out facts, description blocks and characteristics by part', () => {
    render(
      <ContentTextPreview
        text={{
          name: 'Костюм робочий «Лідер»',
          seoTitle: null,
          seoDescription: 'Робочий костюм власного пошиття.',
          summary: [{ label: 'Сезон', text: 'весна, літо' }],
          description: [
            { kind: 'Heading', text: 'Опис', lead: null, items: [] },
            { kind: 'Paragraph', text: 'пряма, з кишенями.', lead: 'Куртка:', items: [] },
            { kind: 'List', text: null, lead: null, items: ['дві кишені'] },
          ],
          specs: [{ title: 'Брюки', rows: [{ name: 'Пояс', value: 'на гумці' }] }],
        }}
      />,
    );

    expect(screen.getByText('Костюм робочий «Лідер»')).toBeInTheDocument();
    expect(screen.getByText('Сезон:')).toBeInTheDocument();
    expect(screen.getByText('Куртка:')).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveTextContent('дві кишені');
    expect(screen.getByText('Брюки')).toBeInTheDocument();
    expect(screen.getByText('Пояс')).toBeInTheDocument();
    // Only the SEO title is empty.
    expect(screen.getAllByText('Не заповнено')).toHaveLength(1);
  });

  it('says what is not filled in', () => {
    render(
      <ContentTextPreview
        text={{
          name: null,
          seoTitle: null,
          seoDescription: null,
          summary: [],
          description: [],
          specs: [],
        }}
      />,
    );
    expect(screen.getAllByText('Не заповнено')).toHaveLength(6);
  });
});
