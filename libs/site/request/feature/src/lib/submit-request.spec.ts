import { REQUEST_FORM_IDLE } from '@site/request/model';

import { submitRequest } from './submit-request';

const post = vi.hoisted(() => vi.fn());

vi.mock('@site/shared/api-client', () => ({ siteApiPostForm: post }));

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
};

afterEach(() => post.mockReset());

describe('submitRequest', () => {
  it('returns field errors and the typed values for a wrong phone', async () => {
    const state = await submitRequest(
      'uk',
      REQUEST_FORM_IDLE,
      form({ phone: '123', workwear: ' куртки ' }),
    );

    expect(state).toEqual({
      status: 'invalid',
      values: { phone: '123', workwear: 'куртки', quantity: '', comment: '' },
      errors: { phone: 'invalidPhone' },
    });
    expect(post).not.toHaveBeenCalled();
  });

  it('rejects a file that is not a brief or a layout', async () => {
    const data = form({ phone: '050 123 45 67' });
    data.set('attachment', new File(['x'], 'run.exe'));

    expect(await submitRequest('uk', REQUEST_FORM_IDLE, data)).toMatchObject({
      status: 'invalid',
      errors: { attachment: 'fileType' },
    });
  });

  it('posts a valid request with the file and the locale and reports it sent', async () => {
    post.mockResolvedValue({ kind: 'ok', data: { id: 5 } });
    const data = form({ phone: '050 123 45 67', workwear: 'Куртки', comment: '' });
    data.set('attachment', new File(['%PDF'], 'brief.pdf'));

    const state = await submitRequest('ru', REQUEST_FORM_IDLE, data);

    expect(state).toEqual({ status: 'sent', phone: '+380501234567' });
    const [path, body] = post.mock.calls[0] as [string, FormData];
    expect(path).toBe('/api/public/site-requests');
    expect(body.get('phone')).toBe('+380501234567');
    expect(body.get('workwear')).toBe('Куртки');
    expect(body.get('comment')).toBeNull();
    expect(body.get('locale')).toBe('ru');
    expect((body.get('attachment') as File).name).toBe('brief.pdf');
  });

  it('asks to call when the API does not take the request', async () => {
    post.mockResolvedValue({ kind: 'unavailable', status: 503 });

    const state = await submitRequest('uk', REQUEST_FORM_IDLE, form({ phone: '050 123 45 67' }));

    expect(state.status).toBe('unavailable');
  });

  it('thanks a bot that filled the hidden field and sends nothing', async () => {
    const state = await submitRequest(
      'uk',
      REQUEST_FORM_IDLE,
      form({ phone: '050 123 45 67', website: 'http://spam.example' }),
    );

    expect(state.status).toBe('sent');
    expect(post).not.toHaveBeenCalled();
  });
});
