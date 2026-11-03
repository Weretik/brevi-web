import type { MediaUploadResult } from '../hooks/files/use-media-upload-queue';

/** One notice for the whole upload: green when all went through, otherwise the reasons. */
export function describeMediaUpload(result: MediaUploadResult): {
  text: string;
  tone: 'success' | 'warning' | 'error';
} {
  if (result.failures.length === 0)
    return { text: `Завантажено фото: ${result.uploaded}.`, tone: 'success' };
  const reasons = result.failures
    .map((failure) => `«${failure.fileName}» — ${failure.message}`)
    .join('\n');
  return result.uploaded === 0
    ? { text: `Не вдалося завантажити фото:\n${reasons}`, tone: 'error' }
    : {
        text: `Завантажено ${result.uploaded} з ${result.total}. Не вдалося:\n${reasons}`,
        tone: 'warning',
      };
}
