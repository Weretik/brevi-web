import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SewingArticlesPanel } from './sewing-articles-panel';

afterEach(cleanup);

describe('SewingArticlesPanel', () => {
  it('selects an Article and shows its active/readiness status', () => {
    const onSelect = vi.fn();
    render(
      <SewingArticlesPanel
        articles={[
          {
            id: 501,
            productId: 42,
            saleSku: '246',
            active: true,
            sortOrder: 0,
            readiness: { ready: false, blockers: ['Немає тканини'] },
          },
        ]}
        selectedArticleId={null}
        version={2}
        canManage={false}
        onSelect={onSelect}
        onCreate={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Артикул 246/ }));

    expect(screen.getByText(/Потрібна перевірка: Немає тканини/)).toBeInTheDocument();
    expect(onSelect).toHaveBeenCalledWith(501);
    expect(screen.queryByRole('form', { name: 'Створити артикул' })).not.toBeInTheDocument();
  });

  it('trims the submitted SKU and leaves it in the form after an error rerender', () => {
    const onCreate = vi.fn();
    const props = {
      articles: [],
      selectedArticleId: null,
      version: 7,
      canManage: true,
      onSelect: vi.fn(),
      onCreate,
    };
    const { rerender } = render(<SewingArticlesPanel {...props} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'SKU артикулу' }), {
      target: { value: ' 246 ' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Додати артикул' }));
    rerender(<SewingArticlesPanel {...props} error="SKU вже використовується." />);

    expect(onCreate).toHaveBeenCalledWith({
      saleSku: '246',
      active: true,
      sortOrder: 0,
      expectedVersion: 7,
    });
    expect(screen.getByRole('textbox', { name: 'SKU артикулу' })).toHaveValue(' 246 ');
    expect(screen.getByText('SKU вже використовується.')).toBeInTheDocument();
  });
});
