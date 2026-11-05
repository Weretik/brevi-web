import { describe, expect, it } from 'vitest';

import { financeAttachmentFileProblem } from './finance-attachment-validation';
import { formatFileSize } from '../../mappers/text/finance-file-size';

describe('financeAttachmentFileProblem', () => {
  it('takes a PDF, JPEG or PNG up to 10 MiB', () => {
    expect(
      financeAttachmentFileProblem({ name: 'рахунок.pdf', size: 10, type: 'application/pdf' }),
    ).toBeNull();
    expect(financeAttachmentFileProblem({ name: 'IMG_1.JPG', size: 10, type: '' })).toBeNull();
    expect(financeAttachmentFileProblem({ name: 'scan', size: 10, type: 'image/png' })).toBeNull();
  });

  it('names the problem of any other file', () => {
    expect(financeAttachmentFileProblem({ name: 'a.pdf', size: 0, type: 'application/pdf' })).toBe(
      'Файл порожній.',
    );
    expect(
      financeAttachmentFileProblem({
        name: 'a.pdf',
        size: 10 * 1024 * 1024 + 1,
        type: 'application/pdf',
      }),
    ).toBe('Файл більший за 10 МБ.');
    expect(
      financeAttachmentFileProblem({ name: 'акт.docx', size: 10, type: 'application/msword' }),
    ).toBe('Підходять лише PDF, JPG або PNG.');
  });
});

describe('formatFileSize', () => {
  it('shows kilobytes below a megabyte and megabytes above', () => {
    expect(formatFileSize(300)).toBe('1 КБ');
    expect(formatFileSize(250 * 1024)).toBe('250 КБ');
    expect(formatFileSize(1.4 * 1024 * 1024)).toBe('1,4 МБ');
  });
});
