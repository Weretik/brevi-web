import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MediaPage } from './media-page';

const front = {
  id: 1,
  originalFileName: 'Жилет-front.webp',
  publicUrl: '/front.webp',
  contentType: 'image/webp',
  status: 'Ready' as const,
};
const back = {
  id: 2,
  originalFileName: 'Жилет-back.png',
  publicUrl: '/back.png',
  contentType: 'image/png',
  status: 'PendingUpload' as const,
};

function response(body: unknown, status = 200) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('media page', () => {
  it('shows cards, accessible image fallback and case-insensitive search states', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response([front, back])));
    render(<MediaPage />);

    expect(await screen.findByRole('heading', { name: 'Медіа/Фото' })).toBeVisible();
    expect(await screen.findByText('Жилет-front.webp')).toBeVisible();
    expect(screen.getByText('Обробляється')).toBeVisible();

    fireEvent.error(screen.getByRole('img', { name: 'Жилет-front.webp' }));
    expect(screen.getByText('Прев’ю недоступне')).toBeVisible();

    await user.type(screen.getByRole('searchbox', { name: 'Пошук за назвою фото' }), 'BACK');
    expect(screen.queryByText('Жилет-front.webp')).not.toBeInTheDocument();
    expect(screen.getByText('Жилет-back.png')).toBeVisible();

    await user.clear(screen.getByRole('searchbox', { name: 'Пошук за назвою фото' }));
    await user.type(screen.getByRole('searchbox', { name: 'Пошук за назвою фото' }), 'missing');
    expect(screen.getByText('За вашим пошуком фото не знайдено.')).toBeVisible();
    expect(screen.queryByText('Медіатека поки порожня.')).not.toBeInTheDocument();
  });

  it('keeps the last successful gallery when refresh fails and retries', async () => {
    const user = userEvent.setup();
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(response([front]))
      .mockResolvedValueOnce(response(null, 500))
      .mockResolvedValueOnce(response([front, back]));
    vi.stubGlobal('fetch', fetcher);
    render(<MediaPage />);

    expect(await screen.findByText('Жилет-front.webp')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Оновити галерею' }));
    expect(await screen.findByText('Не вдалося виконати запит. Спробуйте ще раз.')).toBeVisible();
    expect(screen.getByText('Жилет-front.webp')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(await screen.findByText('Жилет-back.png')).toBeVisible();
  });

  it('rejects an unsupported file and refreshes after a valid upload', async () => {
    let listReads = 0;
    const fetcher = vi.fn<typeof fetch>((_input, init) => {
      if (init?.method === 'POST') {
        return Promise.resolve(
          response({
            mediaFileId: 3,
            storageKey: 'products/3.webp',
            publicUrl: '/back.png',
            contentType: 'image/webp',
            originalFileName: 'new.webp',
          }),
        );
      }
      listReads += 1;
      const list =
        listReads === 1
          ? [front]
          : [front, { ...back, id: 3, status: 'Ready' as const }];
      return Promise.resolve(response(list));
    });
    vi.stubGlobal('fetch', fetcher);
    render(<MediaPage />);
    expect(await screen.findByText('Жилет-front.webp')).toBeVisible();

    const input = screen.getByLabelText('Оберіть фото');
    fireEvent.change(input, {
      target: { files: [new File(['text'], 'notes.txt', { type: 'text/plain' })] },
    });
    expect(screen.getByText('Підтримуються лише JPEG, PNG і WebP.')).toBeVisible();
    expect(fetcher).toHaveBeenCalledTimes(1);

    fireEvent.change(input, {
      target: { files: [new File(['image'], 'new.webp', { type: 'image/webp' })] },
    });
    await waitFor(() =>
      expect(fetcher.mock.calls.some(([, init]) => init?.method === 'POST')).toBe(true),
    );
    expect(await screen.findByText('Фото завантажено.')).toBeVisible();
    expect(await screen.findByText('Жилет-back.png')).toBeVisible();
  });

  it('requires confirmation, preserves a conflict and removes a deleted card', async () => {
    const user = userEvent.setup();
    let deleteAttempts = 0;
    let deleted = false;
    const fetcher = vi.fn<typeof fetch>((_input, init) => {
      if (init?.method === 'DELETE') {
        deleteAttempts += 1;
        if (deleteAttempts === 1) {
          return Promise.resolve(response({ message: 'Media file is used.' }, 409));
        }
        deleted = true;
        return Promise.resolve(response(null, 204));
      }
      return Promise.resolve(response(deleted ? [back] : [front, back]));
    });
    vi.stubGlobal('fetch', fetcher);
    render(<MediaPage />);
    expect(await screen.findByText('Жилет-front.webp')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Видалити Жилет-front.webp' }));
    let dialog = screen.getByRole('dialog', { name: 'Підтвердження видалення' });
    expect(dialog).toHaveTextContent('Жилет-front.webp');
    await user.click(within(dialog).getByRole('button', { name: 'Скасувати' }));
    expect(deleteAttempts).toBe(0);
    await waitFor(() =>
      expect(
        screen.queryByRole('dialog', { name: 'Підтвердження видалення' }),
      ).not.toBeInTheDocument(),
    );

    await user.click(screen.getByRole('button', { name: 'Видалити Жилет-front.webp' }));
    dialog = screen.getByRole('dialog', { name: 'Підтвердження видалення' });
    await user.click(within(dialog).getByRole('button', { name: 'Видалити' }));
    expect(
      await screen.findByText('Фото використовується товаром і не може бути видалене.'),
    ).toBeVisible();
    expect(screen.getByText('Жилет-front.webp')).toBeVisible();

    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Закрити' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Видалити Жилет-front.webp' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Видалити' }));
    expect(await screen.findByText('Фото видалено.')).toBeVisible();
    await waitFor(() => expect(screen.queryByText('Жилет-front.webp')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { name: 'Медіа/Фото' })).toHaveFocus();
  });
});
