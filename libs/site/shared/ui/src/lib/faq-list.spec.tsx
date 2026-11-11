import { render, screen } from '@testing-library/react';

import { FaqList } from './faq-list';

describe('FaqList', () => {
  it('shows every question with its answer in order', () => {
    render(
      <FaqList
        items={[
          { question: 'Що шиєте?', answer: 'Спецодяг.' },
          { question: 'Яка партія?', answer: 'Від 5 штук.' },
        ]}
      />,
    );
    expect(screen.getAllByText(/\?$/).map((item) => item.textContent)).toEqual([
      'Що шиєте?+',
      'Яка партія?+',
    ]);
    expect(screen.getByText('Від 5 штук.')).toBeTruthy();
  });
});
