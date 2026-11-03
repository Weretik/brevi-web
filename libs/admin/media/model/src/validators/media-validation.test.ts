import { describe, expect, it } from 'vitest';

import { validateMediaFileDraft, validateMediaUpload } from './media-file-validation';
import { validateMediaFolderName, validateMediaFolderParent } from './media-folder-validation';
import { buildMediaFolderTree, mediaFolderOptions } from '../mappers/media-folder-tree';

import type { MediaFolder } from '../entities/media-folder';

describe('media validation', () => {
  it('checks folder names like the backend', () => {
    expect(validateMediaFolderName('  ')).toBe('Вкажіть назву папки.');
    expect(validateMediaFolderName('Товари/Сумки')).toBe('Назва не може містити / або \\.');
    expect(validateMediaFolderName('  Товари  ')).toBeNull();
  });

  it('keeps the folder tree within eight levels', () => {
    const chain: MediaFolder[] = Array.from({ length: 8 }, (_, index) => ({
      id: index + 1,
      name: `Рівень ${index + 1}`,
      parentId: index === 0 ? null : index,
      fileCount: 0,
    }));
    const options = mediaFolderOptions(buildMediaFolderTree(chain));
    expect(validateMediaFolderParent({ name: 'Нова', parentId: 7 }, null, options, 1)).toBeNull();
    expect(validateMediaFolderParent({ name: 'Нова', parentId: 8 }, null, options, 1)).toBe(
      'Можна створити не більше 8 рівнів папок.',
    );
  });

  it('accepts only images up to 15 MB', () => {
    expect(validateMediaUpload({ type: 'image/gif', size: 10 })).toBe(
      'Підтримуються лише JPEG, PNG і WebP.',
    );
    expect(validateMediaUpload({ type: 'image/png', size: 16 * 1024 * 1024 })).toBe(
      'Розмір фото не повинен перевищувати 15 МБ.',
    );
    expect(validateMediaUpload({ type: 'image/webp', size: 1000 })).toBeNull();
  });

  it('requires a photo name', () => {
    expect(validateMediaFileDraft({ fileName: ' ', alt: '', folderId: null })).toEqual({
      fileName: 'Вкажіть назву фото.',
    });
  });
});
