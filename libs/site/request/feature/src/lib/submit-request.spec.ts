import { REQUEST_FORM_IDLE } from '@site/request/model';

import { submitRequest } from './submit-request';

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
};

describe('submitRequest', () => {
  it('returns field errors and the typed values for a wrong phone', async () => {
    const state = await submitRequest(
      REQUEST_FORM_IDLE,
      form({ phone: '123', workwear: ' куртки ' }),
    );

    expect(state).toEqual({
      status: 'invalid',
      values: { phone: '123', workwear: 'куртки', quantity: '', comment: '' },
      errors: { phone: 'invalidPhone' },
    });
  });

  it('rejects a file that is not a brief or a layout', async () => {
    const data = form({ phone: '050 123 45 67' });
    data.set('attachment', new File(['x'], 'run.exe'));

    expect(await submitRequest(REQUEST_FORM_IDLE, data)).toMatchObject({
      status: 'invalid',
      errors: { attachment: 'fileType' },
    });
  });

  it('does not report a valid request as sent while delivery is not connected', async () => {
    const state = await submitRequest(REQUEST_FORM_IDLE, form({ phone: '050 123 45 67' }));

    expect(state.status).toBe('unavailable');
  });
});
