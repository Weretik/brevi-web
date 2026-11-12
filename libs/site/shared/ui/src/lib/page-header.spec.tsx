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

  it('shows a note next to the heading and no stitch label when it has none', () => {
    render(
      <PageHeader
        breadcrumbs={[{ name: 'Головна', href: '/uk' }]}
        breadcrumbsLabel="Хлібні крихти"
        title="Спецодяг зимовий"
        titleNote="33 моделі"
      />,
    );

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Спецодяг зимовий');
    expect(screen.getByText('33 моделі')).toBeTruthy();
    expect(screen.queryByText('01')).toBeNull();
  });
});
