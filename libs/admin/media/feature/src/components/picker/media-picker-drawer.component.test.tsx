import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MediaPickerDrawer } from './media-picker-drawer';

import type { MediaFile, MediaFileQuery, MediaFolder } from '@admin/media/model';

const folders: MediaFolder[] = [{ id: 1, name: 'Товари', parentId: null, fileCount: 2 }];

const photo = (id: number, fileName: string): MediaFile => ({
  id,
  fileName,
  alt: null,
  folderId: 1,
  publicUrl: `https://cdn.test/${id}.jpg`,
  thumbnailUrl: `https://cdn.test/thumbs/${id}.webp`,
  contentType: 'image/jpeg',
  sizeInBytes: 2_500_000,
  width: 1200,
  height: 800,
  createdAt: '2026-11-03T10:00:00Z',
});

const files = [photo(11, 'Фартух.jpg'), photo(12, 'Сумка.jpg'), photo(13, 'Рукавиці.jpg')];

const api = vi.hoisted(() => ({ queries: [] as unknown[], upload: vi.fn() }));

vi.mock('@admin/media/data-access', () => ({
  useGetMediaFoldersQuery: () => ({ data: folders, isLoading: false, refetch: vi.fn() }),
  useSearchMediaFilesQuery: (query: MediaFileQuery) => {
    api.queries.push(query);
    return {
      currentData: { items: files, total: files.length, page: 1, pageSize: 48 },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    };
  },
  useUploadMediaFileMutation: () => [
    (arg: unknown) => ({ unwrap: () => api.upload(arg) }),
    { isLoading: false },
  ],
}));

afterEach(() => {
  cleanup();
  api.queries = [];
  api.upload.mockReset();
});

function renderPicker(alreadyAddedIds: number[] = []) {
  const onPick = vi.fn();
  render(<MediaPickerDrawer alreadyAddedIds={alreadyAddedIds} onClose={vi.fn()} onPick={onPick} />);
  return { onPick, panel: screen.getByRole('dialog', { name: 'Вибрати фото' }) };
}

describe('MediaPickerDrawer', () => {
  it('adds the ticked photos and keeps the ones the product already has ticked', () => {
    const { onPick, panel } = renderPicker([11]);
    const added = within(panel).getByRole('checkbox', { name: 'Вибрати «Фартух.jpg»' });
    expect(added).toBeChecked();
    expect(within(panel).getByRole('button', { name: 'Додати' })).toBeDisabled();

    fireEvent.click(added);
    fireEvent.click(within(panel).getByRole('checkbox', { name: 'Вибрати «Рукавиці.jpg»' }));
    fireEvent.click(within(panel).getByRole('button', { name: 'Відкрити «Сумка.jpg»' }));
    fireEvent.click(within(panel).getByRole('button', { name: 'Додати (2)' }));

    expect(onPick).toHaveBeenCalledWith([files[2], files[1]]);
  });

  it('opens a folder from the tree and searches in it', () => {
    const { panel } = renderPicker();
    const tree = within(panel).getByRole('navigation', { name: 'Папки фото' });
    fireEvent.click(within(tree).getByRole('button', { name: /^Товари/ }));
    fireEvent.change(within(panel).getByRole('searchbox', { name: 'Пошук фото' }), {
      target: { value: 'Сумка' },
    });

    expect(api.queries.at(-1)).toMatchObject({ folderId: 1, includeSubfolders: true, page: 1 });
    expect(within(tree).queryByRole('button', { name: /Дії з папкою/ })).not.toBeInTheDocument();
  });

  it('ticks photos uploaded into the open folder', async () => {
    const uploaded = photo(14, 'Новий.jpg');
    api.upload.mockResolvedValue(uploaded);
    const { onPick, panel } = renderPicker();
    const input = panel.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, {
      target: {
        files: [new File([new Uint8Array([1, 2, 3])], 'Новий.jpg', { type: 'image/jpeg' })],
      },
    });

    await waitFor(() =>
      expect(within(panel).getByRole('button', { name: 'Додати (1)' })).toBeEnabled(),
    );
    expect(api.upload).toHaveBeenCalledWith(expect.objectContaining({ folderId: null }));
    fireEvent.click(within(panel).getByRole('button', { name: 'Додати (1)' }));
    expect(onPick).toHaveBeenCalledWith([uploaded]);
    expect(await screen.findByText('Завантажено фото: 1.')).toBeInTheDocument();
  });
});
