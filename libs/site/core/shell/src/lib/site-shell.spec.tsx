import { fireEvent, render, screen, within } from '@testing-library/react';

import { SiteShell } from './site-shell';

vi.mock('next/navigation', () => ({ usePathname: () => '/ru/contacts' }));

describe('SiteShell', () => {
  it('frames the page with the header menu, phones, and footer contacts', () => {
    render(
      <SiteShell locale="ru">
        <h1>Страница</h1>
      </SiteShell>,
    );

    const header = screen.getByRole('banner');
    const footer = screen.getByRole('contentinfo');
    expect(screen.getByRole('main').textContent).toContain('Страница');
    expect(within(header).getByRole('link', { name: 'Цены для опта' }).getAttribute('href')).toBe(
      '/ru/order-in-bulk',
    );
    expect(
      within(header)
        .getByRole('link', { name: /050 307 55 54/ })
        .getAttribute('href'),
    ).toBe('tel:+380503075554');
    expect(within(footer).getByRole('link', { name: '0532 67 11 09' }).getAttribute('href')).toBe(
      'tel:+380532671109',
    );
    expect(
      within(footer).getByRole('link', { name: 'pp.brevi@gmail.com' }).getAttribute('href'),
    ).toBe('mailto:pp.brevi@gmail.com');
    expect(within(footer).getByText('Полтава, ул. Кагамлыка, 3А')).toBeTruthy();
  });

  it('marks the current page in the header menu', () => {
    render(<SiteShell locale="ru">content</SiteShell>);

    const nav = screen.getByRole('navigation', { name: 'Главное меню' });
    expect(within(nav).getByRole('link', { name: 'Контакты' }).getAttribute('aria-current')).toBe(
      'page',
    );
    expect(
      within(nav).getByRole('link', { name: 'О производстве' }).getAttribute('aria-current'),
    ).toBeNull();
  });

  it('keeps the request link out of search results', () => {
    render(<SiteShell locale="uk">content</SiteShell>);

    const request = within(screen.getByRole('banner')).getByRole('link', { name: 'Заявка' });
    expect(request.getAttribute('href')).toBe('/uk/request');
    expect(request.getAttribute('rel')).toBe('nofollow');
  });

  it('keeps every catalog section in the HTML and opens the mega menu on click', () => {
    render(<SiteShell locale="uk">content</SiteShell>);

    const toggle = within(screen.getByRole('banner')).getByRole('button', { name: 'Каталог' });
    const panel = document.getElementById(toggle.getAttribute('aria-controls') ?? '');
    expect(panel?.hidden).toBe(true);
    expect(panel?.querySelectorAll('a[href="/uk/catalog"]').length).toBeGreaterThan(30);

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(
      within(screen.getByRole('region', { name: 'Розділи каталогу' })).getByRole('link', {
        name: 'Теніски-поло',
      }),
    ).toBeTruthy();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens the side menu with the same pages on a phone', () => {
    render(<SiteShell locale="uk">content</SiteShell>);

    fireEvent.click(screen.getByRole('button', { name: 'Відкрити меню' }));
    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByRole('link', { name: 'Пошиття з логотипом' }).getAttribute('href'),
    ).toBe('/uk/logo-printing');
    expect(within(dialog).getByRole('link', { name: 'Захист рук' })).toBeTruthy();
  });

  it('switches the language on the same page', () => {
    render(<SiteShell locale="ru">content</SiteShell>);

    const languages = screen.getByRole('navigation', { name: 'Язык сайта' });
    const ua = within(languages).getByRole('link', { name: 'UA' });
    expect(ua.getAttribute('href')).toBe('/uk/contacts');
    expect(ua.getAttribute('hreflang')).toBe('uk-UA');
    expect(within(languages).getByRole('link', { name: 'RU' }).getAttribute('aria-current')).toBe(
      'true',
    );
  });
});
