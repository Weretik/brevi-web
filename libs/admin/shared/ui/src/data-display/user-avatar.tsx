import { Avatar } from '@mui/material';

import type { SxProps, Theme } from '@mui/material';

/**
 * Backgrounds for the initial when there is no photo. All keep white text above 4.5:1 contrast
 * and read on both light and dark surfaces.
 */
export const avatarColors = [
  '#2E7D32',
  '#1565C0',
  '#6A1B9A',
  '#AD1457',
  '#00695C',
  '#BF360C',
  '#4E342E',
  '#37474F',
] as const;

/** First letter of the name, or of the email when there is no name. */
export const avatarInitial = (name: string, email = ''): string => {
  const source = name.trim() || email.trim();
  return source ? Array.from(source)[0].toLocaleUpperCase('uk-UA') : '?';
};

/** Stable colour for a person: the same name always gets the same colour. */
export const avatarColorIndex = (seed: string): number => {
  let hash = 0;
  for (const character of seed.trim().toLocaleLowerCase('uk-UA')) {
    hash = (hash * 31 + (character.codePointAt(0) ?? 0)) >>> 0;
  }

  return hash % avatarColors.length;
};

interface UserAvatarProps {
  name: string;
  email?: string;
  avatarUrl?: string | null;
  size?: number;
  sx?: SxProps<Theme>;
}

/** A staff member's photo, or the first letter of the name on a colour derived from the name. */
export function UserAvatar({ avatarUrl, email = '', name, size = 32, sx }: UserAvatarProps) {
  const label = name.trim() || email;

  return (
    <Avatar
      alt={label}
      src={avatarUrl ?? undefined}
      sx={[
        {
          bgcolor: avatarColors[avatarColorIndex(label)],
          color: '#FFFFFF',
          fontSize: size * 0.42,
          fontWeight: 700,
          height: size,
          width: size,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {avatarInitial(name, email)}
    </Avatar>
  );
}
