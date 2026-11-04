import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import MediaLibraryPage from './media-library-page';

import type { MediaFile, MediaFileQuery, MediaFolder } from '@admin/media/model';

const folders: MediaFolder[] = [
  { id: 1, name: 'Товари', parentId: null, fileCount: 2 },
  { id: 2, name: 'Сумки', parentId: 1, fileCount: 1 },
  { id: 3, name: 'Порожня', parentId: null, fileCount: 0 },
];

const photo = (id: number, folderId: number | null, fileName: string): MediaFile => ({
  id,
  fileName,
  alt: null,
  folderId,
  publicUrl: `https://cdn.test/${id}.jpg`,
  thumbnailUrl: null,
  contentType: 'image/jpeg',
  sizeInBytes: 2_500_000,
  width: null,
  height: null,
  createdAt: '2026-11-03T10:00:00Z',
});

const files = [photo(11, 1, 'Фартух.jpg'), photo(12, 2, 'Сумка.jpg')];

const api = vi.hoisted(() => ({
  queries: [] as unknown[],
  upload: vi.fn(),
  move: vi.fn(),
  deleteFile: vi.fn(),
  createFolder: vi.fn(),
  deleteFolder: vi.fn(),
  mutation: (fn: (arg: unknown) => unknown) => () => [
    (arg: unknown) => ({ unwrap: () => fn(arg) }),
    { isLoading: false },
  ],
}));

vi.mock('@admin/media/data-access', () => ({
  useGetMediaFoldersQuery: () => ({ data: folders, isLoading: false, refetch: vi.fn() }),
  useSearchMediaFilesQuery: (query: MediaFileQuery) => {
    api.queries.push(query);
    const items = query.search ? files.filter((file) => file.fileName.includes('Сумка')) : files;
    return {
      currentData: { items, total: items.length, page: 1, pageSize: 48 },
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    };
  },
  useGetMediaFileQuery: (id: number, options: { skip: boolean }) => ({
    currentData: options.skip
      ? undefined
      : {
          file: files.find((file) => file.id === id),
          usages: [{ area: 'Товари', ownerId: 5, title: 'Фартух кухарський' }],
        },
  }),
  useUploadMediaFileMutation: api.mutation(api.upload),
  useUpdateMediaFileMutation: api.mutation(vi.fn()),
  useMoveMediaFilesMutation: api.mutation(api.move),
  useDeleteMediaFileMutation: api.mutation(api.deleteFile),
  useCreateMediaFolderMutation: api.mutation(api.createFolder),
  useUpdateMediaFolderMutation: api.mutation(vi.fn()),
  useDeleteMediaFolderMutation: api.mutation(api.deleteFolder),
}));

function Location() {
  const location = useLocation();
  return <span data-testid="location">{location.search}</span>;
}

function renderPage(url = '/media') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <MediaLibraryPage />
      <Location />
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  api.queries = [];
  for (const fn of [api.upload, api.move, api.deleteFile, api.createFolder, api.deleteFolder])
    fn.mockReset();
});

describe('MediaLibraryPage', () => {
  it('shows the folder tree and opens a folder with its subfolders', () => {
    renderPage();
    const tree = screen.getByRole('navigation', { name: 'Папки фото' });
    expect(within(tree).getByRole('button', { name: /^Товари\s*3/ })).toBeInTheDocument();

    fireEvent.click(within(tree).getByRole('button', { name: /^Товари/ }));

    expect(screen.getByTestId('location')).toHaveTextContent('?folder=1');
    expect(api.queries.at(-1)).toMatchObject({ folderId: 1, includeSubfolders: true, page: 1 });
    expect(within(tree).getByRole('button', { name: /^Сумки/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Лише ця папка 2' })).toBeInTheDocument();
  });

  it('searches photos by name on the server', async () => {
    renderPage('/media?folder=1');
    fireEvent.change(screen.getByRole('textbox', { name: 'Пошук фото' }), {
      target: { value: 'Сумка' },
    });
    await waitFor(() => expect(api.queries.at(-1)).toMatchObject({ folderId: 1, search: 'Сумка' }));
    expect(screen.getByText('Сумка.jpg')).toBeInTheDocument();
  });

  it('uploads several photos into the open folder', async () => {
    api.upload.mockResolvedValue(files[0]);
    const { container } = renderPage('/media?folder=2');
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const a = new File(['a'], 'a.jpg', { type: 'image/jpeg' });
    const b = new File(['b'], 'b.gif', { type: 'image/gif' });

    fireEvent.change(input, { target: { files: [a, b] } });

    expect(await screen.findByText(/Завантажено 1 з 2/)).toBeInTheDocument();
    expect(api.upload).toHaveBeenCalledTimes(1);
    expect(api.upload).toHaveBeenCalledWith({ file: a, folderId: 2 });
    expect(screen.getByText(/«b.gif» — Підтримуються лише JPEG, PNG і WebP./)).toBeInTheDocument();
  });

  it('uploads photos dropped anywhere on the page', async () => {
    api.upload.mockResolvedValue(files[0]);
    renderPage('/media?folder=1');
    const photo = new File(['a'], 'drop.jpg', { type: 'image/jpeg' });
    const dragEvent = (type: string) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'dataTransfer', {
        value: { types: ['Files'], files: [photo], dropEffect: 'none' },
      });
      return event;
    };

    act(() => {
      window.dispatchEvent(dragEvent('dragenter'));
    });
    expect(screen.getByText('Відпустіть фото, щоб завантажити')).toBeInTheDocument();
    act(() => {
      window.dispatchEvent(dragEvent('drop'));
    });

    await waitFor(() => expect(api.upload).toHaveBeenCalledWith({ file: photo, folderId: 1 }));
    expect(await screen.findByText('Завантажено фото: 1.')).toBeInTheDocument();
  });

  it('opens a photo with the products that use it', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Відкрити «Фартух.jpg»' }));
    const panel = await screen.findByRole('dialog');
    expect(within(panel).getByText('Товари: Фартух кухарський')).toBeInTheDocument();
    expect(within(panel).getByText('Товари', { selector: 'dd' })).toBeInTheDocument();
  });

  it('moves selected photos to another folder', async () => {
    api.move.mockResolvedValue(undefined);
    renderPage();
    fireEvent.click(screen.getByRole('checkbox', { name: 'Вибрати «Фартух.jpg»' }));
    fireEvent.click(screen.getByRole('button', { name: 'Перемістити' }));
    const panel = await screen.findByRole('dialog');
    fireEvent.mouseDown(within(panel).getByRole('combobox'));
    fireEvent.click(await screen.findByRole('option', { name: 'Порожня' }));
    fireEvent.click(within(panel).getByRole('button', { name: 'Зберегти' }));

    await waitFor(() => expect(api.move).toHaveBeenCalledWith({ fileIds: [11], folderId: 3 }));
    expect(await screen.findByText('Переміщено фото: 1.')).toBeInTheDocument();
  });

  it('does not offer to delete a folder that still has photos', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Дії з папкою «Товари»' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Видалити папку' }));
    expect(api.deleteFolder).not.toHaveBeenCalled();
    expect(screen.getByText(/у ній є фото або підпапки/)).toBeInTheDocument();
  });

  it('creates a subfolder from the folder menu', async () => {
    api.createFolder.mockResolvedValue({ id: 9, name: 'Шопери', parentId: 2, fileCount: 0 });
    renderPage('/media?folder=2');
    fireEvent.click(screen.getByRole('button', { name: 'Дії з папкою «Сумки»' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Нова підпапка' }));
    const panel = await screen.findByRole('dialog');
    fireEvent.change(within(panel).getByRole('textbox', { name: 'Назва папки' }), {
      target: { value: 'Шопери' },
    });
    fireEvent.click(within(panel).getByRole('button', { name: 'Зберегти' }));

    await waitFor(() =>
      expect(api.createFolder).toHaveBeenCalledWith({ name: 'Шопери', parentId: 2 }),
    );
    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('?folder=9'));
  });
});
