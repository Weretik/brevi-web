import { PageRightsProvider } from '@admin/shared/ui';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductPhotosTab } from './product-photos-tab';
import { render } from '../../test-utils';

import type { ProductCardPhoto } from '@admin/products/model';

const mocks = vi.hoisted(() => ({ save: vi.fn() }));

const photos: ProductCardPhoto[] = [
  {
    mediaFileId: 10,
    fileName: 'main.jpg',
    url: 'https://cdn/10.jpg',
    thumbnailUrl: null,
    isMain: true,
    missing: false,
  },
  {
    mediaFileId: 20,
    fileName: 'side.jpg',
    url: 'https://cdn/20.jpg',
    thumbnailUrl: null,
    isMain: false,
    missing: false,
  },
];

vi.mock('@admin/products/data-access', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@admin/products/data-access')>()),
  useGetProductPhotosQuery: () => ({
    data: photos,
    isLoading: false,
    error: undefined,
    refetch: vi.fn(),
  }),
  useSetProductPhotosMutation: () => [mocks.save, { isLoading: false }],
  useUploadProductMediaMutation: () => [vi.fn(), { isLoading: false }],
}));

/** `canEdit`: «Редагувати» on «Товари» (ACC-002). */
function show(canEdit: boolean) {
  return render(
    <MemoryRouter>
      <PageRightsProvider can={(action) => action !== 'edit' || canEdit}>
        <ProductPhotosTab productId={7} productName="Куртка" />
      </PageRightsProvider>
    </MemoryRouter>,
  );
}

describe('ProductPhotosTab (CAT-018)', () => {
  beforeEach(() => {
    mocks.save.mockReturnValue({ unwrap: () => Promise.resolve(photos) });
  });
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('shows the main photo to a manager without any change buttons', () => {
    show(false);

    expect(screen.getByText('Головне')).toBeTruthy();
    expect(screen.getAllByRole('img')).toHaveLength(2);
    expect(screen.queryByRole('button', { name: /Додати з медіатеки/ })).toBeNull();
    expect(screen.queryByRole('button', { name: /Прибрати фото/ })).toBeNull();
  });

  it('lets a role that edits «Товари» make another photo main and move it', async () => {
    show(true);

    await userEvent.click(screen.getByRole('button', { name: 'Зробити головним фото 2' }));
    expect(mocks.save).toHaveBeenCalledWith({
      id: 7,
      body: { mediaFileIds: [10, 20], mainMediaFileId: 20 },
    });

    await userEvent.click(screen.getByRole('button', { name: 'Посунути фото 2 лівіше' }));
    expect(mocks.save).toHaveBeenLastCalledWith({
      id: 7,
      body: { mediaFileIds: [20, 10], mainMediaFileId: null },
    });
  });

  it('removes a photo from the product only', async () => {
    show(true);

    await userEvent.click(screen.getByRole('button', { name: 'Прибрати фото 1' }));

    expect(mocks.save).toHaveBeenCalledWith({
      id: 7,
      body: { mediaFileIds: [20], mainMediaFileId: null },
    });
  });
});
