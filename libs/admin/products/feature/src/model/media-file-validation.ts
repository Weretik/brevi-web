const ALLOWED_MEDIA_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const MAX_MEDIA_FILE_SIZE_BYTES = 50 * 1024 * 1024;

export function validateMediaFile(file: File): string | null {
  if (!ALLOWED_MEDIA_TYPES.has(file.type)) return 'Підтримуються лише JPEG, PNG і WebP.';
  if (file.size === 0) return 'Файл порожній.';
  if (file.size > MAX_MEDIA_FILE_SIZE_BYTES) return 'Розмір фото не повинен перевищувати 50 МіБ.';
  return null;
}
