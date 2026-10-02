import { emptyProductDraft } from '@admin/products/model';
import { cleanup, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductEditor } from './product-editor';
import { render } from '../../test-utils';

afterEach(cleanup);

vi.mock('../../hooks/product-editor/use-product-lookups', () => ({
  useProductLookups: () => ({
    lookups: {
      categories: [],
      media: [],
      fabrics: [],
      accessories: [],
      operations: [],
      suppliers: [],
      references: [],
    },
    error: null,
    loading: false,
    reload: vi.fn(),
    setLookups: vi.fn(),
  }),
}));

function renderEditor(editor: React.ReactNode) {
  return render(<MemoryRouter>{editor}</MemoryRouter>);
}

describe('ProductEditor', () => {
  it('renders an empty create form in separate MUI cards with a create action', () => {
    renderEditor(<ProductEditor />);

    expect(screen.getByRole('spinbutton', { name: 'ID товару' })).toHaveValue(null);
    expect(screen.getByRole('textbox', { name: 'Назва українською' })).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Створити товар' })).toBeEnabled();
    for (const name of [
      'Основна інформація',
      'Опис двома мовами',
      'Фото',
      'Швейний товар',
      'Інформаційні блоки',
      'Таблиці характеристик',
    ]) {
      expect(screen.getByRole('region', { name })).toHaveClass('MuiCard-root');
    }
  });

  it('uses the same card structure with populated values and an edit action', () => {
    const draft = { ...emptyProductDraft('Sewing'), name: 'Куртка', ruName: 'Куртка' };
    renderEditor(<ProductEditor initial={draft} productId={8} />);

    expect(screen.getByRole('textbox', { name: 'Назва українською' })).toHaveValue('Куртка');
    expect(screen.getByRole('button', { name: 'Зберегти зміни' })).toBeEnabled();
    expect(screen.getAllByRole('region')).toHaveLength(6);
  });
});
