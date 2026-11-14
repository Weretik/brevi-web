import { render, screen, within } from '@testing-library/react';

import { Breadcrumbs } from './breadcrumbs';

describe('Breadcrumbs', () => {
  it('links every item except the current page', () => {
    render(
      <Breadcrumbs
        label="Хлібні крихти"
        items={[
          { name: 'Головна', href: '/uk' },
          { name: 'Виробництво', href: '/uk/about-company' },
        ]}
      />,
    );

    const nav = screen.getByRole('navigation', { name: 'Хлібні крихти' });
    expect(within(nav).getByRole('link', { name: 'Головна' }).getAttribute('href')).toBe('/uk');
    expect(within(nav).queryByRole('link', { name: 'Виробництво' })).toBeNull();
    expect(within(nav).getByText('Виробництво').getAttribute('aria-current')).toBe('page');
  });
});
