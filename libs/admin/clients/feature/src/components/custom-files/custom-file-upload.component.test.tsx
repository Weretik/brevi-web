import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CustomFileUpload } from './custom-file-upload';

afterEach(cleanup);
describe('private upload selection', () => {
  it.each([
    new File(['x'], 'unsafe.svg', { type: 'image/svg+xml' }),
    new File([], 'empty.pdf', { type: 'application/pdf' }),
  ])('rejects invalid input before sending bytes ($name)', (file) => {
    const upload = vi.fn();
    render(<CustomFileUpload disabled={false} onUpload={upload} />);
    fireEvent.change(screen.getByLabelText('Приватний файл PDF, JPEG або PNG'), {
      target: { files: [file] },
    });
    expect(upload).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
  it('accepts exactly 20 MiB and rejects the next byte', () => {
    const upload = vi.fn();
    render(<CustomFileUpload disabled={false} onUpload={upload} />);
    const input = screen.getByLabelText('Приватний файл PDF, JPEG або PNG');
    const file = new File(['%PDF'], 'file.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 20971520 });
    fireEvent.change(input, { target: { files: [file] } });
    expect(upload).toHaveBeenCalledWith(file);
    upload.mockClear();
    const huge = new File(['%PDF'], 'huge.pdf', { type: 'application/pdf' });
    Object.defineProperty(huge, 'size', { value: 20971521 });
    fireEvent.change(input, { target: { files: [huge] } });
    expect(upload).not.toHaveBeenCalled();
  });
});
