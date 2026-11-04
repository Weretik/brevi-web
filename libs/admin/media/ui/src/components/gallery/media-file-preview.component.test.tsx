import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MediaFilePreview } from './media-file-preview';

const file = {
  fileName: 'Фартух.jpg',
  alt: null,
  publicUrl: 'https://cdn.test/original.jpg',
  thumbnailUrl: 'https://cdn.test/thumbs/a.webp',
};

describe('MediaFilePreview', () => {
  it('loads the small preview in the grid and falls back to the original, then to a note', () => {
    render(<MediaFilePreview file={file} preferThumbnail />);
    const image = screen.getByRole('img', { name: 'Фартух.jpg' });
    expect(image).toHaveAttribute('src', file.thumbnailUrl);

    fireEvent.error(image);
    expect(screen.getByRole('img', { name: 'Фартух.jpg' })).toHaveAttribute('src', file.publicUrl);

    fireEvent.error(screen.getByRole('img', { name: 'Фартух.jpg' }));
    expect(screen.getByText('Прев’ю недоступне')).toBeInTheDocument();
  });

  it('shows the original in the side panel', () => {
    render(<MediaFilePreview file={file} />);
    expect(screen.getByRole('img', { name: 'Фартух.jpg' })).toHaveAttribute('src', file.publicUrl);
  });
});
