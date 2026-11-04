import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { avatarColorIndex, avatarInitial, UserAvatar } from './user-avatar';

describe('avatarInitial', () => {
  it('takes the first letter of the name, then of the email', () => {
    expect(avatarInitial('  олена ')).toBe('О');
    expect(avatarInitial('', 'petro@example.com')).toBe('P');
    expect(avatarInitial('', '')).toBe('?');
  });
});

describe('avatarColorIndex', () => {
  it('gives the same colour to the same name regardless of case and spaces', () => {
    expect(avatarColorIndex('Олена Коваль')).toBe(avatarColorIndex(' олена коваль '));
  });

  it('spreads different names over the palette', () => {
    const names = ['Олена', 'Петро', 'Іван', 'Марія', 'Андрій', 'Наталія', 'Сергій', 'Оксана'];

    expect(new Set(names.map(avatarColorIndex)).size).toBeGreaterThan(3);
  });
});

describe('UserAvatar', () => {
  it('shows the initial when there is no photo', () => {
    render(<UserAvatar name="Олена" />);

    expect(screen.getByText('О')).toBeTruthy();
  });

  it('shows the photo when the URL is set', () => {
    render(<UserAvatar avatarUrl="https://cdn.test/a.webp" name="Олена" />);

    expect(screen.getByRole('img', { name: 'Олена' }).getAttribute('src')).toBe(
      'https://cdn.test/a.webp',
    );
  });
});
