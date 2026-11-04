import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { QuotePhotoPickerDrawer } from './quote-photo-picker-drawer';

import type { QuoteItemDraft } from '@admin/quotes/model';

vi.mock('@admin/quotes/data-access', () => ({
  useGetQuoteProductPhotosQuery: () => ({
    data: [
      { mediaFileId: 1, url: 'https://cdn/main.jpg', thumbnailUrl: null, isMain: true },
      { mediaFileId: 2, url: 'https://cdn/side.jpg', thumbnailUrl: null, isMain: false },
    ],
    isLoading: false,
    isError: false,
    isSuccess: true,
  }),
}));

afterEach(cleanup);

const item = {
  key: 'item-1',
  kind: 'Sewing',
  productId: 10,
  name: 'Костюм «Імпульс»',
  photoUrl: 'https://cdn/main.jpg',
} as unknown as QuoteItemDraft;

describe('«Змінити фото» of a КП item', () => {
  it('marks the current photo and picks another photo of the product', async () => {
    const onDone = vi.fn();
    render(<QuotePhotoPickerDrawer item={item} onClose={vi.fn()} onDone={onDone} />);

    expect(screen.getByRole('radio', { name: 'Фото 1, головне' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    const choose = screen.getByRole('button', { name: 'Вибрати' });
    expect(choose).toBeDisabled();

    await userEvent.click(screen.getByRole('radio', { name: 'Фото 2' }));
    await userEvent.click(choose);

    expect(onDone).toHaveBeenCalledWith('https://cdn/side.jpg');
  });
});
