import { COMPANY } from '@site/core/config';
import { fireEvent, render, screen, within } from '@testing-library/react';

import { SiteShell } from './site-shell';

import type { CatalogSection } from '@site/catalog/model';

vi.mock('next/navigation', () => ({
  usePathname: () => '/ru/contacts',
  useRouter: () => ({ push: vi.fn() }),
}));

const CATALOG_SECTIONS: CatalogSection[] = [
  {
    key: 'spetsodyah',
    slug: 'spetsodyah',
    label: { uk: 'Спецодяг власного пошиття', ru: 'Спецодежда собственного пошива' },
    items: [
      { key: 'kostyumy', slug: 'kostyumy', label: { uk: 'Костюми', ru: 'Костюми' } },
      { key: 'kurtky', slug: 'kurtky', label: { uk: 'Куртки', ru: 'Куртки' } },
    ],
  },
  {
    key: 'zasoby-zakhystu',
    slug: 'zasoby-zakhystu',
    label: { uk: 'Засоби індивідуального захисту', ru: 'Средства индивидуальной защиты' },
    items: [
      { key: 'zakhyst-ruk', slug: 'zakhyst-ruk', label: { uk: 'Захист рук', ru: 'Захист рук' } },
    ],
  },
];

/** «Каталог» of the menu row of wide screens; the phone header has its own, which opens a sheet. */
const catalogToggle = () =>
  within(screen.getByRole('banner'))
    .getAllByRole('button', { name: 'Каталог' })
    .find((button) => !button.hasAttribute('aria-haspopup')) as HTMLElement;

describe('SiteShell', () => {
  it('frames the page with the header menu, phones, and footer contacts', () => {
    render(
      <SiteShell company={COMPANY} locale="ru" catalogSections={CATALOG_SECTIONS}>
        <h1>Страница</h1>
      </SiteShell>,
    );

    const header = screen.getByRole('banner');
    const footer = screen.getByRole('contentinfo');
    expect(screen.getByRole('main').textContent).toContain('Страница');
    expect(within(header).getByRole('link', { name: 'Цены для опта' }).getAttribute('href')).toBe(
      '/ru/order-in-bulk',
    );
    for (const link of within(header).getAllByRole('link', { name: /050 469 86 75/ })) {
      expect(link.getAttribute('href')).toBe('tel:+380504698675');
    }
    for (const link of within(footer).getAllByRole('link', { name: '050 469 86 75' })) {
      expect(link.getAttribute('href')).toBe('tel:+380504698675');
    }
    expect(within(footer).getByText(/Частное предприятие «Бреви» · ЕГРПОУ 35521636/)).toBeTruthy();
    expect(within(footer).queryByRole('heading')).toBeNull();
    expect(
      within(footer)
        .getByRole('link', { name: /Доставка по всей Украине/ })
        .getAttribute('href'),
    ).toBe('/ru/regions');
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
    render(
      <SiteShell company={COMPANY} locale="ru" catalogSections={CATALOG_SECTIONS}>
        content
      </SiteShell>,
    );

    const nav = screen.getByRole('navigation', { name: 'Главное меню' });
    expect(within(nav).getByRole('link', { name: 'Контакты' }).getAttribute('aria-current')).toBe(
      'page',
    );
    expect(
      within(nav).getByRole('link', { name: 'О производстве' }).getAttribute('aria-current'),
    ).toBeNull();
  });

  it('keeps the request link out of search results', () => {
    render(
      <SiteShell company={COMPANY} locale="uk" catalogSections={CATALOG_SECTIONS}>
        content
      </SiteShell>,
    );

    const request = within(screen.getByRole('banner')).getByRole('link', {
      name: 'Залишити заявку',
    });
    expect(request.getAttribute('href')).toBe('/uk/request');
    expect(request.getAttribute('rel')).toBe('nofollow');
  });

  it('keeps every catalog section in the HTML and shows one section at a time', () => {
    render(
      <SiteShell company={COMPANY} locale="uk" catalogSections={CATALOG_SECTIONS}>
        content
      </SiteShell>,
    );

    const toggle = catalogToggle();
    const panel = document.getElementById(toggle.getAttribute('aria-controls') ?? '');
    expect(panel?.hidden).toBe(true);
    expect(panel?.querySelectorAll('a[href^="/uk/catalog/"]').length).toBe(5);

    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const menu = screen.getByRole('region', { name: 'Розділи каталогу' });
    const [first, second] = CATALOG_SECTIONS;
    const firstItem = first.items[0];
    const secondItem = second.items[0];
    expect(within(menu).getByRole('link', { name: firstItem.label.uk }).getAttribute('href')).toBe(
      `/uk/catalog/${firstItem.slug}`,
    );
    expect(within(menu).queryByRole('link', { name: secondItem.label.uk })).toBeNull();

    fireEvent.click(within(menu).getByRole('button', { name: second.label.uk }));
    expect(within(menu).getByRole('link', { name: secondItem.label.uk })).toBeTruthy();
    expect(within(menu).queryByRole('link', { name: firstItem.label.uk })).toBeNull();
    expect(
      within(menu)
        .getByRole('link', { name: /Дізнатися умови/ })
        .getAttribute('href'),
    ).toBe('/uk/logo-printing');

    // The owner asked for no extra buttons under the sections.
    expect(within(menu).queryByRole('link', { name: /Весь каталог/ })).toBeNull();
    expect(within(menu).queryByRole('link', { name: 'Доставка та оплата' })).toBeNull();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('keeps the catalog entry when the catalog is empty', () => {
    render(
      <SiteShell company={COMPANY} locale="uk" catalogSections={[]}>
        content
      </SiteShell>,
    );

    fireEvent.click(catalogToggle());
    const menu = screen.getByRole('region', { name: 'Розділи каталогу' });
    expect(
      within(menu)
        .getByRole('link', { name: /Весь каталог/ })
        .getAttribute('href'),
    ).toBe('/uk/catalog');
    expect(
      within(screen.getByRole('contentinfo'))
        .getByRole('link', { name: 'Весь каталог' })
        .getAttribute('href'),
    ).toBe('/uk/catalog');
  });

  it('shows the phone in the menu row once the page is scrolled', () => {
    render(
      <SiteShell company={COMPANY} locale="uk" catalogSections={CATALOG_SECTIONS}>
        content
      </SiteShell>,
    );
    const header = screen.getByRole('banner');
    // One phone in the contacts row of wide screens, one in the phone header.
    expect(within(header).getAllByRole('link', { name: /050 469 86 75/ })).toHaveLength(2);
    expect(within(header).queryByText(/Від 5 одиниць/)).toBeNull();
    expect(within(header).getByText('власне виробництво, Полтава')).toBeTruthy();

    Object.defineProperty(window, 'scrollY', { value: 400, configurable: true });
    fireEvent.scroll(window);
    expect(within(header).getAllByRole('link', { name: /050 469 86 75/ })).toHaveLength(3);
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
  });

  it('opens the catalog search from the header menu', () => {
    render(
      <SiteShell company={COMPANY} locale="uk" catalogSections={CATALOG_SECTIONS}>
        content
      </SiteShell>,
    );
    const header = screen.getByRole('banner');
    expect(within(header).queryByRole('search')).toBeNull();

    // Phones search inside «Меню»; the header button is for wide screens.
    const buttons = within(header).getAllByRole('button', { name: 'Пошук' });
    expect(buttons).toHaveLength(1);
    fireEvent.click(buttons[0]);
    const form = within(header).getByRole('search', { name: 'Пошук по каталогу' });
    expect(form.getAttribute('action')).toBe('/uk/search');
    expect(within(form).getByRole('combobox')).toBeTruthy();
  });

  it('gives phones a header with the phone, «Каталог» and «Меню», and no bottom bar', () => {
    render(
      <SiteShell company={COMPANY} locale="uk" catalogSections={CATALOG_SECTIONS}>
        content
      </SiteShell>,
    );

    const header = screen.getByRole('banner');
    expect(screen.queryByRole('navigation', { name: 'Швидкі дії' })).toBeNull();
    const call = within(header).getAllByRole('link', { name: /050 469 86 75/ })[1];
    expect(call.getAttribute('href')).toBe('tel:+380504698675');

    const catalogSheet = within(header)
      .getAllByRole('button', { name: 'Каталог' })
      .find((button) => button.hasAttribute('aria-haspopup')) as HTMLElement;
    fireEvent.click(catalogSheet);
    const catalog = screen.getByRole('dialog');
    expect(within(catalog).getByText('Захист рук')).toBeTruthy();
    expect(within(catalog).getAllByRole('link', { name: 'Усі товари розділу' }).length).toBe(
      CATALOG_SECTIONS.length,
    );
    fireEvent.click(within(catalog).getByRole('button', { name: 'Закрити меню' }));

    fireEvent.click(within(header).getByRole('button', { name: 'Меню' }));
    const menu = screen.getByRole('dialog');
    expect(
      within(menu).getByRole('link', { name: 'Пошиття з логотипом' }).getAttribute('href'),
    ).toBe('/uk/logo-printing');
    // Search, the request and the language are inside «Меню» on phones.
    expect(within(menu).getByRole('search', { name: 'Пошук по каталогу' })).toBeTruthy();
    const request = within(menu).getByRole('link', { name: 'Залишити заявку' });
    expect(request.getAttribute('href')).toBe('/uk/request');
    expect(request.getAttribute('rel')).toBe('nofollow');
    expect(within(menu).getByRole('navigation', { name: 'Мова сайту' })).toBeTruthy();
    expect(within(menu).getByText(/Працюємо з ПДВ/)).toBeTruthy();
  });

  it('switches the language on the same page', () => {
    render(
      <SiteShell company={COMPANY} locale="ru" catalogSections={CATALOG_SECTIONS}>
        content
      </SiteShell>,
    );

    // The toggle is in the menu row on wide screens and inside «Меню» on phones.
    const [languages] = screen.getAllByRole('navigation', { name: 'Язык сайта' });
    const ua = within(languages).getByRole('link', { name: 'UA' });
    expect(ua.getAttribute('href')).toBe('/uk/contacts');
    expect(ua.getAttribute('hreflang')).toBe('uk-UA');
    expect(within(languages).getByRole('link', { name: 'RU' }).getAttribute('aria-current')).toBe(
      'true',
    );
  });
});
