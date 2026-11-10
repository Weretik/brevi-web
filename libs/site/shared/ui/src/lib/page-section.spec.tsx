import { render, screen, within } from '@testing-library/react';

import { PageSection } from './page-section';

describe('PageSection', () => {
  it('labels the section by its heading and renders the action link', () => {
    render(
      <PageSection
        id="home-catalog"
        title="Каталог спецодягу"
        label={{ index: '02', text: 'Що ми шиємо' }}
        action={{ href: '/uk/catalog', label: 'Весь каталог' }}
      >
        content
      </PageSection>,
    );

    const section = screen.getByRole('region', { name: 'Каталог спецодягу' });
    expect(within(section).getByRole('heading', { level: 2 })).toBeTruthy();
    expect(
      within(section)
        .getByRole('link', { name: /Весь каталог/ })
        .getAttribute('href'),
    ).toBe('/uk/catalog');
  });
});
