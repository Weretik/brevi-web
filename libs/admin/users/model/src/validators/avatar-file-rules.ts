/** Matches the server limits for an avatar upload. */
export const avatarMaxBytes = 2 * 1024 * 1024;
export const avatarMinSide = 128;
export const avatarAcceptedTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const avatarRulesHint =
  'JPG, PNG або WebP, до 2 МБ, щонайменше 128×128 пікселів. Фото обріжеться до квадрата по центру.';

const formatMegabytes = (bytes: number): string =>
  (bytes / (1024 * 1024)).toLocaleString('uk-UA', { maximumFractionDigits: 1 });

/** Checks what is known before decoding: type and size. */
export const validateAvatarFile = (file: { type: string; size: number }): string | undefined => {
  if (!(avatarAcceptedTypes as readonly string[]).includes(file.type)) {
    return 'Підходять лише фото у форматі JPG, PNG або WebP.';
  }

  return file.size > avatarMaxBytes
    ? `Фото завелике: ${formatMegabytes(file.size)} МБ. Максимум — 2 МБ.`
    : undefined;
};

/** Checks the decoded size of the image. */
export const validateAvatarDimensions = (size: {
  width: number;
  height: number;
}): string | undefined =>
  Math.min(size.width, size.height) < avatarMinSide
    ? `Фото замале: ${size.width}×${size.height} пікселів. Потрібно щонайменше ${avatarMinSide}×${avatarMinSide}.`
    : undefined;
