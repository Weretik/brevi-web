import {
  cleanRequestValues,
  formatUkrainianPhone,
  normalizeUkrainianPhone,
  validateRequest,
} from './request-validators';

const values = { phone: '050 123 45 67', workwear: '', quantity: '', comment: '' };

describe('request validators', () => {
  it.each([
    ['050 123 45 67', '+380501234567'],
    ['+38 (050) 123-45-67', '+380501234567'],
    ['380501234567', '+380501234567'],
    ['80501234567', '+380501234567'],
  ])('reads the phone %s', (input, expected) => {
    expect(normalizeUkrainianPhone(input)).toBe(expected);
  });

  it.each(['', '12345', '050 123 45', '0501234567 доб. 2', '+48 501 234 567', '000 123 45 67'])(
    'rejects the phone "%s"',
    (input) => {
      expect(normalizeUkrainianPhone(input)).toBeNull();
    },
  );

  it('formats the phone for reading back to the visitor', () => {
    expect(formatUkrainianPhone('+380501234567')).toBe('+380 50 123 45 67');
  });

  it('needs only the phone', () => {
    expect(validateRequest(values)).toEqual({});
    expect(validateRequest({ ...values, phone: '' })).toEqual({ phone: 'required' });
    expect(validateRequest({ ...values, phone: '12345' })).toEqual({ phone: 'invalidPhone' });
  });

  it('limits the length of every field', () => {
    expect(validateRequest({ ...values, comment: 'a'.repeat(1001) })).toEqual({
      comment: 'tooLong',
    });
  });

  it('accepts a brief or a layout up to 10 MB', () => {
    expect(validateRequest(values, { name: 'Макет.PDF', size: 1024 })).toEqual({});
    expect(validateRequest(values, { name: 'logo.cdr', size: 11 * 1024 * 1024 })).toEqual({
      attachment: 'fileTooLarge',
    });
    expect(validateRequest(values, { name: 'run.exe', size: 1024 })).toEqual({
      attachment: 'fileType',
    });
  });

  it('trims fields before the check', () => {
    expect(
      cleanRequestValues({ ...values, workwear: '  куртки,   штани ', comment: ' a\nb ' }),
    ).toEqual({ ...values, workwear: 'куртки, штани', comment: 'a\nb' });
  });
});
