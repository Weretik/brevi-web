import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProductMarkdown } from './product-markdown';

describe('ProductMarkdown', () => {
  it('shows allowed formatting and omits raw HTML, images and unsafe links', () => {
    const { container } = render(
      <ProductMarkdown
        text={
          '## Назва\n\n**Важливо** [сайт](https://example.test) [небезпечно](javascript:alert(1)) ![фото](https://example.test/a.png) <script>alert(1)</script>'
        }
      />,
    );

    expect(screen.getByRole('heading', { name: 'Назва' })).toBeInTheDocument();
    expect(screen.getByText('Важливо').tagName).toBe('STRONG');
    expect(screen.getByRole('link', { name: 'сайт' })).toHaveAttribute(
      'href',
      'https://example.test',
    );
    expect(container.querySelector('script, img, table')).toBeNull();
    expect(screen.getByText('небезпечно').closest('a')).toHaveAttribute('href', '');
  });
});
