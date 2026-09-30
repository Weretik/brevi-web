import { describe, expect, it, vi } from 'vitest';

import { deleteProductMedia, listProductMedia, uploadProductMedia } from './catalog-media.api';

const readyMedia = {
  id: 7,
  originalFileName: 'Жилет-front.webp',
  publicUrl: 'https://cdn.example.test/catalog/7.webp',
  contentType: 'image/webp',
  storageKey: 'products/7.webp',
  status: 'Ready',
};

describe('catalog media API', () => {
  it('maps a valid list and rejects an unknown processing status', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(JSON.stringify([readyMedia]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ ...readyMedia, status: 'Archived' }]), { status: 200 }),
      );

    await expect(listProductMedia(undefined, fetcher)).resolves.toEqual([
      {
        id: 7,
        originalFileName: 'Жилет-front.webp',
        publicUrl: 'https://cdn.example.test/catalog/7.webp',
        contentType: 'image/webp',
        status: 'Ready',
      },
    ]);
    await expect(listProductMedia(undefined, fetcher)).rejects.toThrow('Некоректне медіа');
  });

  it('uploads the lowercase contract field and returns the media id', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          mediaFileId: 9,
          storageKey: 'products/9.webp',
          publicUrl: 'https://cdn.example.test/catalog/9.webp',
          contentType: 'image/webp',
          originalFileName: 'photo.webp',
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );
    const file = new File(['image'], 'photo.webp', { type: 'image/webp' });

    await expect(uploadProductMedia(file, fetcher)).resolves.toBe(9);
    const body = fetcher.mock.calls[0][1]?.body;
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get('file')).toBe(file);
    expect((body as FormData).get('File')).toBeNull();
  });

  it('deletes by id and preserves a conflict as an API error', async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'Media file is used by a product.' }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

    await expect(deleteProductMedia(7, fetcher)).resolves.toBeUndefined();
    expect(fetcher.mock.calls[0][0]).toContain('/api/catalog/media/7');
    expect(fetcher.mock.calls[0][1]?.method).toBe('DELETE');
    await expect(deleteProductMedia(7, fetcher)).rejects.toMatchObject({ status: 409 });
  });
});
