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
        .getByRole('link', { name: /050 469 86 75/ })
        .getAttribute('href'),
    ).toBe('tel:+380504698675');
    for (const link of within(footer).getAllByRole('link', { name: '050 469 86 75' })) {
      expect(link.getAttribute('href')).toBe('tel:+380504698675');
    }
    expect(within(footer).getByText(/Частное предприятие «Бреви» · ЕГРПОУ 35521636/)).toBeTruthy();
    expect(within(footer).queryByRole('heading')).toBeNull();
    expect(
      within(footer)
        .getByRole('link', { name: /Показать на карте/ })
        .getAttribute('href'),
    ).toContain('google.com/maps');
    expect(within(footer).queryByRole('link', { name: '0532 67 11 09' })).toBeNull();
    expect(
      within(footer).getByRole('link', { name: 'pp.brevi@gmail.com' }).getAttribute('href'),
    ).toBe('mailto:pp.brevi@gmail.com');
    expect(within(footer).getByText('Полтава, ул. Кагамлыка, 3А')).toBeTruthy();
    // Social profiles have no address yet, so the footer names them without links.
    const socials = within(footer).getByRole('list', { name: 'Соцсети' });
    expect(within(socials).getByText('Instagram')).toBeTruthy();
    expect(within(socials).queryByRole('link')).toBeNull();
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

    const request = within(screen.getByRole('banner')).getByRole('link', {
      name: 'Залишити заявку',
    });
    expect(request.getAttribute('href')).toBe('/uk/request');
    expect(request.getAttribute('rel')).toBe('nofollow');
  });

  it('keeps every catalog section in the HTML and shows one section at a time', () => {
    render(<SiteShell locale="uk">content</SiteShell>);

    const toggle = within(screen.getByRole('banner')).getByRole('button', { name: 'Каталог' });
    const panel = document.getElementById(toggle.getAttribute('aria-controls') ?? '');
    expect(panel?.hidden).toBe(true);
    expect(panel?.querySelectorAll('a[href="/uk/catalog"]').length).toBeGreaterThan(30);

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const menu = screen.getByRole('region', { name: 'Розділи каталогу' });
    expect(within(menu).getByRole('link', { name: 'Костюми робочі літні' })).toBeTruthy();
    expect(within(menu).queryByRole('link', { name: 'Теніски-поло' })).toBeNull();

    fireEvent.click(within(menu).getByRole('button', { name: 'Трикотаж' }));
    expect(within(menu).getByRole('link', { name: 'Теніски-поло' })).toBeTruthy();
    expect(within(menu).queryByRole('link', { name: 'Костюми робочі літні' })).toBeNull();
    expect(
      within(menu)
        .getByRole('link', { name: /Дізнатися умови/ })
        .getAttribute('href'),
    ).toBe('/uk/logo-printing');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('shows the phone in the menu row once the page is scrolled', () => {
    render(<SiteShell locale="uk">content</SiteShell>);
    const header = screen.getByRole('banner');
    expect(within(header).getAllByRole('link', { name: /050 469 86 75/ })).toHaveLength(1);
    expect(within(header).getByText('Від 5 одиниць · Працюємо з ПДВ')).toBeTruthy();

    Object.defineProperty(window, 'scrollY', { value: 400, configurable: true });
    fireEvent.scroll(window);
    expect(within(header).getAllByRole('link', { name: /050 469 86 75/ })).toHaveLength(2);
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('gives phones a bottom bar with the catalog, the request, the call, and the menu', () => {
    render(<SiteShell locale="uk">content</SiteShell>);

    const bar = screen.getByRole('navigation', { name: 'Швидкі дії' });
    expect(within(bar).getByRole('link', { name: 'Заявка' }).getAttribute('href')).toBe(
      '/uk/request',
    );
    expect(
      within(bar)
        .getByRole('link', { name: /050 469 86 75/ })
        .getAttribute('href'),
    ).toBe('tel:+380504698675');

    fireEvent.click(within(bar).getByRole('button', { name: 'Каталог' }));
    const catalog = screen.getByRole('dialog');
    expect(within(catalog).getByText('Захист рук')).toBeTruthy();
    expect(within(catalog).getAllByRole('link', { name: 'Усі товари розділу' }).length).toBe(8);
    fireEvent.click(within(catalog).getByRole('button', { name: 'Закрити меню' }));

    fireEvent.click(screen.getByRole('button', { name: 'Відкрити меню' }));
    const menu = screen.getByRole('dialog');
    expect(
      within(menu).getByRole('link', { name: 'Пошиття з логотипом' }).getAttribute('href'),
    ).toBe('/uk/logo-printing');
    expect(within(menu).getByText(/Працюємо з ПДВ/)).toBeTruthy();
  });

  it('switches the language on the same page', () => {
    render(<SiteShell locale="ru">content</SiteShell>);

    // The toggle is in the contacts row on phones and in the menu row on wide screens.
    const [languages] = screen.getAllByRole('navigation', { name: 'Язык сайта' });
    const ua = within(languages).getByRole('link', { name: 'UA' });
    expect(ua.getAttribute('href')).toBe('/uk/contacts');
    expect(ua.getAttribute('hreflang')).toBe('uk-UA');
    expect(within(languages).getByRole('link', { name: 'RU' }).getAttribute('aria-current')).toBe(
      'true',
    );
  });
});
