import { validateAvatarDimensions, validateAvatarFile } from '@admin/users/model';

const readImageSize = async (file: File): Promise<{ width: number; height: number } | null> => {
  if (typeof createImageBitmap !== 'function') return null;

  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return null;
  }
};

/**
 * Checks a chosen photo before upload: type, size, then the decoded dimensions.
 * Returns a message for the user, or undefined when the photo can be sent.
 */
export const checkAvatarFile = async (file: File): Promise<string | undefined> => {
  const fileError = validateAvatarFile(file);
  if (fileError) return fileError;

  const size = await readImageSize(file);
  // A browser that cannot decode the file leaves the final check to the server.
  return size ? validateAvatarDimensions(size) : undefined;
};
