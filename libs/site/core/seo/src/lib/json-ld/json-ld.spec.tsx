import { COMPANY, createSiteConfig } from '@site/core/config';
import { renderToStaticMarkup } from 'react-dom/server';

import { buildBreadcrumbJsonLd } from './breadcrumb-json-ld';
import { JsonLd, serializeJsonLd } from './json-ld';
import {
  buildLocalBusinessJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from './site-json-ld';

const config = createSiteConfig({});

describe('JSON-LD', () => {
  it('escapes characters that could close the script tag', () => {
    expect(serializeJsonLd({ name: '</script><b>&' })).toBe(
      '{"name":"\\u003c/script\\u003e\\u003cb\\u003e\\u0026"}',
    );
  });

  it('renders a JSON-LD script tag', () => {
    const html = renderToStaticMarkup(<JsonLd data={{ '@type': 'Thing' }} />);

    expect(html).toBe('<script type="application/ld+json">{"@type":"Thing"}</script>');
  });

  it('describes the organization with the localized address and the sales phone', () => {
    expect(buildOrganizationJsonLd('ru', COMPANY, config)).toMatchObject({
      '@type': 'Organization',
      '@id': 'https://brevi.com.ua/#organization',
      url: 'https://brevi.com.ua/ru',
      logo: 'https://brevi.com.ua/assets/logo/brevi-logo-dark.png',
      telephone: '+380504698675',
      address: {
        streetAddress: 'ул. Кагамлыка, 3А',
        addressLocality: 'Полтава',
        addressCountry: 'UA',
      },
      areaServed: { '@type': 'Country', name: 'UA' },
      contactPoint: { contactType: 'sales', availableLanguage: ['uk', 'ru'] },
    });
  });

  it('links the website to the organization', () => {
    expect(buildWebSiteJsonLd('uk', config)).toMatchObject({
      '@type': 'WebSite',
      inLanguage: 'uk-UA',
      publisher: { '@id': 'https://brevi.com.ua/#organization' },
    });
  });

  it('describes the workshop with the phone and opening hours', () => {
    expect(buildLocalBusinessJsonLd('uk', COMPANY, config)).toMatchObject({
      '@type': 'LocalBusiness',
      telephone: ['+380504698675'],
      address: { streetAddress: 'вул. Кагамлика, 3А' },
      openingHoursSpecification: {
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    });
  });

  it('lists breadcrumbs with positions and absolute URLs', () => {
    const data = buildBreadcrumbJsonLd(
      [
        { name: 'Головна', path: '/uk' },
        { name: 'Виробництво', path: '/uk/about-company' },
      ],
      config,
    );

    expect(data['@type']).toBe('BreadcrumbList');
    expect(data['itemListElement']).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://brevi.com.ua/uk' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Виробництво',
        item: 'https://brevi.com.ua/uk/about-company',
      },
    ]);
  });
});
