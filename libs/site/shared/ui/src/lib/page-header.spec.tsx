import { render, screen } from '@testing-library/react';

import { PageHeader } from './page-header';

describe('PageHeader', () => {
  it('shows breadcrumbs, the h1, and the lead', () => {
    render(
      <PageHeader
        breadcrumbs={[
          { name: 'Головна', href: '/uk' },
          { name: 'Контакти', href: '/uk/contacts' },
        ]}
        breadcrumbsLabel="Хлібні крихти"
        label="Зв’язок"
        title="Контакти Brevi"
        lead="Телефони, адреса і графік роботи."
      />,
    );

    expect(screen.getByRole('navigation', { name: 'Хлібні крихти' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Контакти Brevi');
    expect(screen.getByText('Телефони, адреса і графік роботи.')).toBeTruthy();
  });
});
